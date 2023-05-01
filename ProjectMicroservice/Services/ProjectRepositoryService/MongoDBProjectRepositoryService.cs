using MongoDB.Driver;

namespace ProjectMicroservice.Services.ProjectRepositoryService;

public class MongoDBProjectRepositoryService : IProjectRepositoryService
{
    private readonly IMongoCollection<ProjectMeta> _projectMetaCollection;
    private readonly IMongoCollection<Page> _pageCollection;
    private readonly IMongoCollection<Layer> _layerCollection;
    private readonly IMongoCollection<Shape> _shapeCollection;

    public MongoDBProjectRepositoryService(ProjectDBSettings projectDBSettings)
    {
        var mongoClient = new MongoClient(projectDBSettings.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(projectDBSettings.DatabaseName);

        _projectMetaCollection = mongoDatabase.
            GetCollection<ProjectMeta>(projectDBSettings.ProjectMetaCollectionName);
        _pageCollection = mongoDatabase.
            GetCollection<Page>(projectDBSettings.PageCollectionName);
        _layerCollection = mongoDatabase.
            GetCollection<Layer>(projectDBSettings.LayerCollectionName);
        _shapeCollection = mongoDatabase.
            GetCollection<Shape>(projectDBSettings.ShapeCollectionName);
    }

    public async Task AddAsync(ProjectMeta newProjectMeta, string pageName, string layerName)
    {
        var task = newProjectMeta.IsGroup ? 
            _projectMetaCollection.InsertOneAsync(newProjectMeta)
            : Task.Run(async () => {
                await _projectMetaCollection.InsertOneAsync(newProjectMeta);
                var newPage = new Page(pageName, newProjectMeta.Id!);
                await _pageCollection.InsertOneAsync(newPage);

                var newLayer = new Layer(layerName, newPage.Id!, 10000);
                await _layerCollection.InsertOneAsync(newLayer);
            });
        await task;
    }

    public async Task UpdateAsync(ProjectMeta projectMetaToUpdate) =>
        await _projectMetaCollection
            .ReplaceOneAsync(p => p.Id == projectMetaToUpdate.Id, projectMetaToUpdate);

    public async Task RemoveAsync(string projectId)
    {
        var removeChildrenTasks = new List<Task>();
        var projectMeta = await (await _projectMetaCollection.FindAsync(p => p.Id == projectId)).SingleAsync();
        var children = await (await _projectMetaCollection.FindAsync(p => p.GroupId == projectId)).ToListAsync();
        children.ForEach(ch => removeChildrenTasks.Add(RemoveAsync(ch.Id!)));
        await Task.WhenAll(removeChildrenTasks);

        await Task.WhenAll(
            _projectMetaCollection.DeleteOneAsync(p => p.Id == projectId),
            RemovePagesAsync(projectMeta.Id!)
        );
    }

    public async Task RemovePagesAsync(string projectId)
    {
        var pages = await (await _pageCollection.FindAsync(p => p.ProjectId == projectId)).ToListAsync();
        foreach(var p in pages)
        {
            await RemoveLayersAsync(p.Id!);
        }
        await _pageCollection.DeleteManyAsync(p => p.ProjectId! == projectId);
    }

    public async Task RemoveLayersAsync(string pageId)
    {
        var layers = await (await _layerCollection.FindAsync(l => l.PageId == pageId)).ToListAsync();
        foreach(var l in layers)
        {
            await RemoveShapesAsync(l.Id!);
        }
        await _layerCollection.DeleteManyAsync(l => l.PageId == pageId);
    }

    public async Task RemoveShapesAsync(string layerId)
    {
        await _shapeCollection.DeleteManyAsync(s => s.LayerId == layerId);
    }

    public async Task<ProjectMeta> GetProjectByIdAsync(string projectId) =>
        await (await _projectMetaCollection.FindAsync(p => p.Id == projectId)).SingleAsync();

    public async Task<List<ProjectMeta>?> GetProjectsAsync(string userId) =>
        await (await _projectMetaCollection.FindAsync(p => p.OwnerId == userId)).ToListAsync();
}