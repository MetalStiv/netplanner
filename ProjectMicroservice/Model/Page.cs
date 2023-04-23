using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ProjectMicroservice.Model;

public record Page
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }
    
    [BsonElement("projectId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ProjectId { get; private set; }
    
    [BsonElement("name")]
    public string Name { get; private set; }

    public Page(string name, string pojectId)
    {
        this.Name = name;
        this.ProjectId = pojectId;
    }
}