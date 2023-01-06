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

    public async Task AddAsync(ProjectMeta newProjectMeta){
        await _projectMetaCollection.InsertOneAsync(newProjectMeta);
        await _projectCollection.InsertOneAsync(new Project(newProjectMeta.Id!));
    }

    public async Task UpdateAsync(ProjectMeta projectMetaToUpdate) =>
        await _projectMetaCollection
            .ReplaceOneAsync(p => p.Id == projectMetaToUpdate.Id, projectMetaToUpdate);

    public async Task<List<ProjectMeta>?> GetProjectsAsync(string userId) =>
        await (await _projectMetaCollection.FindAsync(p => p.OwnerId == userId)).ToListAsync();
}