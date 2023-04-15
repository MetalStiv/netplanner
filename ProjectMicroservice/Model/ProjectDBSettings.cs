namespace ProjectMicroservice.Model;

public class ProjectDBSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string ProjectMetaCollectionName { get; set; } = null!;
    public string ProjectCollectionName { get; set; } = null!;
    public string PageCollectionName { get; set; } = null!;
    public string LayerCollectionName { get; set; } = null!;
    public string ShapeCollectionName { get; set; } = null!;

    public ProjectDBSettings(string connectionString, string databaseName, 
        string projectMetaCollectionName, string projectCollectionName,
        string pageCollectionName, string layerCollectionName,
        string shapeCollectionName)
    {
        ConnectionString = connectionString;
        DatabaseName = databaseName;
        ProjectMetaCollectionName = projectMetaCollectionName;
        ProjectCollectionName = projectCollectionName;
        PageCollectionName = pageCollectionName;
        LayerCollectionName = layerCollectionName;
        ShapeCollectionName = shapeCollectionName;
    }
}