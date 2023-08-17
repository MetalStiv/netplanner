using MongoDB.Driver;

namespace UserMicroservice.Services.UserRepositoryService;

public class MongoDBUserRepositoryService : IUserRepositoryService
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMongoCollection<Message> _messagesCollection;

    public MongoDBUserRepositoryService(UserDBSettings userDBSettings)
    {
        var mongoClient = new MongoClient(userDBSettings.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(userDBSettings.DatabaseName);

        _usersCollection = mongoDatabase.GetCollection<User>(userDBSettings.UsersCollectionName);
        _messagesCollection = mongoDatabase.GetCollection<Message>(userDBSettings.MessagesCollectionName);
    }

    public async Task AddAsync(User newUser) =>
        await _usersCollection.InsertOneAsync(newUser);

    public async Task UpdateAsync(User userToUpdate) =>
        await _usersCollection.ReplaceOneAsync(u => u.Id == userToUpdate.Id, userToUpdate);

    public async Task<User?> GetByEmailAsync(string email) =>
        await _usersCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

    public async Task<User?> GetByIdAsync(string id) =>
        await _usersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<List<Message>> GetVersionMessages(string version) =>
        await (await _messagesCollection.FindAsync(m => m.Version == version)).ToListAsync();
}