namespace ProjectMicroservice.Model;

public class ProjectDBSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string ProjectMetaCollectionName { get; set; } = null!;
    public string PageCollectionName { get; set; } = null!;
    public string LayerCollectionName { get; set; } = null!;
    public string ShapeCollectionName { get; set; } = null!;
    public string InviteCollectionName { get; set; } = null!;

    public ProjectDBSettings(string connectionString, string databaseName, 
        string projectMetaCollectionName, string pageCollectionName, 
        string layerCollectionName, string shapeCollectionName,
        string inviteCollectionName)
    {
        ConnectionString = connectionString;
        DatabaseName = databaseName;
        ProjectMetaCollectionName = projectMetaCollectionName;
        PageCollectionName = pageCollectionName;
        LayerCollectionName = layerCollectionName;
        ShapeCollectionName = shapeCollectionName;
        InviteCollectionName = inviteCollectionName;
    }
}