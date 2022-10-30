using MongoDB.Driver;

namespace UserMicroservice.Services.UserRepositoryService;

public class MongoDBUserRepositoryService : IUserRepositoryService
{
    private readonly IMongoCollection<User> _usersCollection;

    public MongoDBUserRepositoryService(UserDBSettings userDBSettings)
    {
        var mongoClient = new MongoClient(userDBSettings.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(userDBSettings.DatabaseName);

        _usersCollection = mongoDatabase.GetCollection<User>(userDBSettings.UsersCollectionName);
    }

    public async Task AddAsync(User newUser) =>
        await _usersCollection.InsertOneAsync(newUser);

    public async Task UpdateAsync(User userToUpdate) =>
        await _usersCollection.ReplaceOneAsync(u => u.Id == userToUpdate.Id, userToUpdate);

    public async Task<User?> GetByEmailAsync(string email) =>
        await _usersCollection.Find(x => x.Email == email).FirstOrDefaultAsync();
}