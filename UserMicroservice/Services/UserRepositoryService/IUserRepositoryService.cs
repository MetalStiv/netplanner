namespace UserMicroservice.Services.UserRepositoryService;

public interface IUserRepositoryService
{
    Task AddAsync(User newUser);
    Task UpdateAsync(User userToUpdate);
    Task<User?> GetByEmailAsync(string email);
}