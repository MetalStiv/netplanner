namespace UserMicroservice.Model;

public class UserDBSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string UsersCollectionName { get; set; } = null!;

    public UserDBSettings(string connectionString, string databaseName, string usersCollectionName)
    {
        ConnectionString = connectionString;
        DatabaseName = databaseName;
        UsersCollectionName = usersCollectionName;
    }
}