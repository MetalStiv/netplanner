using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ProjectMicroservice.Model;

public record Project
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }

    public Project(string id)
    {
        this.Id = id;
    }
}