using MongoDB.Driver;

namespace ProjectMicroservice.Services.ProjectRepositoryService;

public class MongoDBProjectRepositoryService : IProjectRepositoryService
{
    private readonly IMongoCollection<ProjectMeta> _projectMetaCollection;
    private readonly IMongoCollection<Project> _projectCollection;

    public MongoDBProjectRepositoryService(ProjectDBSettings projectDBSettings)
    {
        var mongoClient = new MongoClient(projectDBSettings.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(projectDBSettings.DatabaseName);

        _projectMetaCollection = mongoDatabase.
            GetCollection<ProjectMeta>(projectDBSettings.ProjectMetaCollectionName);
        _projectCollection = mongoDatabase.
            GetCollection<Project>(projectDBSettings.ProjectCollectionName);
    }

    public async Task AddAsync(ProjectMeta newProjectMeta)
    {
        var tasks = newProjectMeta.IsGroup ? 
            Task.WhenAll(_projectMetaCollection.InsertOneAsync(newProjectMeta))
            : Task.WhenAll(
                _projectMetaCollection.InsertOneAsync(newProjectMeta), 
                _projectCollection.InsertOneAsync(new Project(newProjectMeta.Id!))
            );
        await tasks;
    }

    public async Task UpdateAsync(ProjectMeta projectMetaToUpdate) =>
        await _projectMetaCollection
            .ReplaceOneAsync(p => p.Id == projectMetaToUpdate.Id, projectMetaToUpdate);

    public async Task RemoveAsync(string projectId)
    {
        var removeChildrenTasks = new List<Task>();
        var children = await _projectMetaCollection.Find(p => p.GroupId == projectId).ToListAsync();
        children.ForEach(ch => removeChildrenTasks.Add(RemoveAsync(ch.Id!)));
        await Task.WhenAll(removeChildrenTasks);

        await Task.WhenAll(
             _projectMetaCollection.DeleteOneAsync(p => p.Id == projectId),
             _projectCollection.DeleteOneAsync(p => p.Id == projectId)
        );
    }

    public async Task<ProjectMeta> GetProjectByIdAsync(string projectId) =>
        await _projectMetaCollection.Find(p => p.Id == projectId).SingleAsync();

    public async Task<List<ProjectMeta>?> GetProjectsAsync(string userId) =>
        await (await _projectMetaCollection.FindAsync(p => p.OwnerId == userId)).ToListAsync();
}