namespace ProjectMicroservice.Services.ProjectRepositoryService;

public interface IProjectRepositoryService
{
    Task AddAsync(ProjectMeta newProject, string pageName, string layerName);
    Task UpdateAsync(ProjectMeta projectToUpdate);
    Task RemoveAsync(string projectId);
    Task<ProjectMeta> GetProjectByIdAsync(string projectId);
    Task<List<ProjectMeta>?> GetProjectsAsync(string userId);
}