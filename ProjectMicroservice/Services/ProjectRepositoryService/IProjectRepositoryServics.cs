namespace ProjectMicroservice.Services.ProjectRepositoryService;

public interface IProjectRepositoryService
{
    Task AddAsync(ProjectMeta newProject);
    Task UpdateAsync(ProjectMeta projectToUpdate);
    Task<List<ProjectMeta>?> GetProjectsAsync(string userId);
}