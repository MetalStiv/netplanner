namespace UserMicroservice.Services.UserRepositoryService;

public interface IUserRepositoryService
{
    Task AddAsync(User newUser);
    Task UpdateAsync(User userToUpdate);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(string id);
    Task<List<Message>> GetVersionMessages(string version);
}