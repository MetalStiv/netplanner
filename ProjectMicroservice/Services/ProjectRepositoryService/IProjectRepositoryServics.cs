namespace ProjectMicroservice.Services.ProjectRepositoryService;

public interface IProjectRepositoryService
{
    Task AddAsync(ProjectMeta newProject, string pageName, string layerName);
    Task UpdateAsync(ProjectMeta projectToUpdate);
    Task RemoveAsync(string projectId);
    Task<ProjectMeta> GetProjectByIdAsync(string projectId);
    Task<List<ProjectMeta>?> GetProjectsAsync(string userId);
    Task AddInvite(Invite invite);
    Task UpdateInviteAsync(Invite invite);
    Task RemoveInviteAsync(string inviteId);
    Task<Invite> GetInviteByIdAsync(string inviteId);
    Task<List<Invite>> GetUserInvitesAsync(string userId);
    Task<List<Invite>> GetProjectInvitesAsync(string projectId);
    Task<bool> CheckUserFullRight(string userId, string projectId);
}