using MongoDB.Driver;

namespace ProjectMicroservice.Services.ProjectRepositoryService;

public class MongoDBProjectRepositoryService : IProjectRepositoryService
{
    private readonly IMongoCollection<ProjectMeta> _projectMetaCollection;
    private readonly IMongoCollection<Project> _projectCollection;
    private readonly IMongoCollection<Page> _pageCollection;
    private readonly IMongoCollection<Layer> _layerCollection;
    private readonly IMongoCollection<Shape> _shapeCollection;

    public MongoDBProjectRepositoryService(ProjectDBSettings projectDBSettings)
    {
        var mongoClient = new MongoClient(projectDBSettings.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(projectDBSettings.DatabaseName);

        _projectMetaCollection = mongoDatabase.
            GetCollection<ProjectMeta>(projectDBSettings.ProjectMetaCollectionName);
        _projectCollection = mongoDatabase.
            GetCollection<Project>(projectDBSettings.ProjectCollectionName);
        _pageCollection = mongoDatabase.
            GetCollection<Page>(projectDBSettings.PageCollectionName);
        _layerCollection = mongoDatabase.
            GetCollection<Layer>(projectDBSettings.LayerCollectionName);
        _shapeCollection = mongoDatabase.
            GetCollection<Shape>(projectDBSettings.ShapeCollectionName);
    }

    public async Task AddAsync(ProjectMeta newProjectMeta)
    {
        var tasks = newProjectMeta.IsGroup ? 
            Task.WhenAll(_projectMetaCollection.InsertOneAsync(newProjectMeta))
            : Task.WhenAll(
                _projectMetaCollection.InsertOneAsync(newProjectMeta),
                Task.Run(async () => {
                    var newProject = new Project(newProjectMeta.Id!);
                    await _projectCollection.InsertOneAsync(newProject);
                    
                    var newPage = new Page("Page_1", newProject.Id!);
                    await _pageCollection.InsertOneAsync(newPage);

                    var newLayer = new Layer("Layer_1", newPage.Id!, 10000);
                    await _layerCollection.InsertOneAsync(newLayer);
                })
            );
        await tasks;
    }

    public async Task UpdateAsync(ProjectMeta projectMetaToUpdate) =>
        await _projectMetaCollection
            .ReplaceOneAsync(p => p.Id == projectMetaToUpdate.Id, projectMetaToUpdate);

    public async Task RemoveAsync(string projectId)
    {
        var removeChildrenTasks = new List<Task>();
        var project = await (await _projectCollection.FindAsync(p => p.Id == projectId)).SingleAsync();
        var children = await (await _projectMetaCollection.FindAsync(p => p.GroupId == projectId)).ToListAsync();
        children.ForEach(ch => removeChildrenTasks.Add(RemoveAsync(ch.Id!)));
        await Task.WhenAll(removeChildrenTasks);

        await Task.WhenAll(
            _projectMetaCollection.DeleteOneAsync(p => p.Id == projectId),
            RemovePagesAsync(project.Id!),
            _projectCollection.DeleteOneAsync(p => p.Id == projectId)
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