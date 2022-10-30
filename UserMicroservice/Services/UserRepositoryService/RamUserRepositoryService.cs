namespace UserMicroservice.Services.UserRepositoryService;

public class RamUserRepositoryService : IUserRepositoryService
{
    private List<User> _users => new List<User>();

    public async Task AddAsync(User newUser) =>
        await Task.Run(() => _users.Add(newUser));

    public async Task UpdateAsync(User userToUpdate) =>
        await Task.Run(() => 
        {
            var ind = _users.FindIndex(u => u.Id == userToUpdate.Id); 
            if (ind > -1)
            {
                _users[ind] = userToUpdate;
            }
        });

    public async Task<User?> GetByEmailAsync(string email) =>
        await Task.Run(() => _users.FirstOrDefault<User>(x => x.Email == email));
}