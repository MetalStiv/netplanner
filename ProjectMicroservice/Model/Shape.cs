using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ProjectMicroservice.Model;

public record Shape
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }

    [BsonElement("type")]
    public string? Type { get; private set; }
    
    [BsonElement("layerId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? LayerId { get; private set; }

    [BsonElement("graphicalProperties")]
    public Dictionary<string, string> GraphicalProperties { get; private set; } = new Dictionary<string, string>();

    public Shape(string id, string layerId)
    {
        this.Id = id;
        this.LayerId = layerId;
    }
}