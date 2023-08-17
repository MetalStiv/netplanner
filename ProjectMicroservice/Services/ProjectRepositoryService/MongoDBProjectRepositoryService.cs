using MongoDB.Driver;

namespace ProjectMicroservice.Services.ProjectRepositoryService;

public class MongoDBProjectRepositoryService : IProjectRepositoryService
{
    private readonly IMongoCollection<ProjectMeta> _projectMetaCollection;
    private readonly IMongoCollection<Page> _pageCollection;
    private readonly IMongoCollection<Layer> _layerCollection;
    private readonly IMongoCollection<Shape> _shapeCollection;
    private readonly IMongoCollection<Invite> _inviteCollection;

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
        _inviteCollection = mongoDatabase.
            GetCollection<Invite>(projectDBSettings.InviteCollectionName);
    }

    public async Task AddAsync(ProjectMeta newProjectMeta, string pageName, string layerName)
    {
        var task = newProjectMeta.IsGroup ? 
            _projectMetaCollection.InsertOneAsync(newProjectMeta)
            : Task.Run(async () => {
                await _projectMetaCollection.InsertOneAsync(newProjectMeta);
                var newPage = new Page(pageName, newProjectMeta.Id!);
                await _pageCollection.InsertOneAsync(newPage);

                var newLayer = new Layer(layerName, newPage.Id!, 0, true);
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

    public async Task AddInvite(Invite invite)
    {
        var checkInvite = await
            (await _inviteCollection.FindAsync(i => i.ProjectId == invite.ProjectId && i.UserId == invite.UserId)).AnyAsync();
        if (checkInvite == false)
        {
            await _inviteCollection.InsertOneAsync(invite);
        }
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

    public async Task<List<ProjectMeta>?> GetDirectoryProjectsAsync(string projectId)
    {
        var projects = await (await _projectMetaCollection.FindAsync(p => p.GroupId == projectId)).ToListAsync();
        var childs = new List<ProjectMeta>();

        var groups = projects.FindAll(p => p.IsGroup == true);
        if (!(groups is null))
        {
            foreach (var g in groups)
            {
                var temp = await GetDirectoryProjectsAsync(g.Id!);
                if (!(temp is null))
                {
                    childs = childs.Union(temp).ToList();
                }

            }
        }
        // projects.FindAll(p => p.IsGroup == true)
        //     .ForEach(async p => {
        //         var temp = await GetDirectoryProjectsAsync(p.Id!);
        //         if (!(temp is null))
        //         {
        //             childs.AddRange(temp);
        //         }
        //     });
        return projects;
    }
    public async Task<List<ProjectMeta>?> GetProjectsAsync(string userId)
    {
        var ownedProjects = await (await _projectMetaCollection.FindAsync(p => p.OwnerId == userId)).ToListAsync();

        var invitedProjectIds = (await (await _inviteCollection.FindAsync(i => i.UserId == userId && i.State == 1)).ToListAsync())
            .Select(i => i.ProjectId).ToList();
        var subscribedProjects = await (await _projectMetaCollection.FindAsync(p => invitedProjectIds.Contains(p.Id!))).ToListAsync();
        
        var childs = new List<ProjectMeta>();
        var baseProjects = ownedProjects.Union(subscribedProjects).ToList();
        var baseGroups = baseProjects.FindAll(p => p.IsGroup == true);

        if (!(baseGroups is null))
        {
            foreach (var g in baseGroups)
            {
                var temp = await GetDirectoryProjectsAsync(g.Id!);
                if (!(temp is null))
                {
                    childs = childs.Union(temp).ToList();
                }

            }
        }
        return baseProjects.Union(childs).ToList();
    }
    
    public async Task<List<Invite>> GetProjectInvitesAsync(string projectId) =>
        await (await _inviteCollection.FindAsync(i => i.ProjectId == projectId)).ToListAsync();

    public async Task<Invite> GetInviteByIdAsync(string inviteId) =>
        await (await _inviteCollection.FindAsync(i => i.Id == inviteId)).SingleAsync();

    public async Task RemoveInviteAsync(string inviteId) =>
        await _inviteCollection.DeleteOneAsync(i => i.Id == inviteId);

    public async Task<int> CheckUserRight(string userId, string projectId)
    {
        var project = await this.GetProjectByIdAsync(projectId);
        if (project.OwnerId == userId)
        {
            return 0;
        }

        var userInvite = (await _inviteCollection
            .FindAsync(i => i.UserId == userId && i.ProjectId == projectId))
            .FirstOrDefault();
        if (userInvite != null)
        {
            if (userInvite.State == 1 && userInvite.Permission == 0)
            {
                return 0;
            }
            if (userInvite.State == 1 && userInvite.Permission == 1)
            {
                return 1;
            }
        }        

        if (project.GroupId is null){
            return 2;
        }
        else
        {
            return await CheckUserRight(userId, project.GroupId);
        }
    }

    public async Task<List<Invite>> GetUserInvitesAsync(string userId) =>
        await (await _inviteCollection.FindAsync(i => i.UserId == userId)).ToListAsync();
    
    public async Task UpdateInviteAsync(Invite invite) =>
        await _inviteCollection.ReplaceOneAsync(i => i.Id == invite.Id, invite);
}