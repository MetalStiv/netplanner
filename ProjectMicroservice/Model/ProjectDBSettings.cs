namespace ProjectMicroservice.Model;

public class ProjectDBSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string ProjectMetaCollectionName { get; set; } = null!;
    public string ProjectCollectionName { get; set; } = null!;

    public ProjectDBSettings(string connectionString, string databaseName, 
        string projectMetaCollectionName, string projectCollectionName)
    {
        ConnectionString = connectionString;
        DatabaseName = databaseName;
        ProjectMetaCollectionName = projectMetaCollectionName;
        ProjectCollectionName = projectCollectionName;
    }
}