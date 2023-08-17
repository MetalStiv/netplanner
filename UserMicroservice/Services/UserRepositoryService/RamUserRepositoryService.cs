namespace UserMicroservice.Services.UserRepositoryService;

public class RamUserRepositoryService : IUserRepositoryService
{
    private List<User> _users => new List<User>();
    private List<Message> _messages => new List<Message>();

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

    public async Task<User?> GetByIdAsync(string id) =>
        await Task.Run(() => _users.FirstOrDefault<User>(x => x.Id == id));

    public async Task<List<Message>> GetVersionMessages(string version) =>
        await Task.Run(() => _messages.FindAll(m => m.Version == version));
}