using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ProjectMicroservice.Model;

public record ProjectMeta
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }

    [BsonElement("name")]
    public string Name { get; set; }

    [BsonElement("ownerId")]
    public string OwnerId { get; set; }

    [BsonElement("subscriberIds")]
    public List<String>? SubscriberIds { get; set; }

    [BsonElement("creationTime")]
    public DateTime CreationTime { get; private set; }

    public ProjectMeta(string name, string ownerId)
    {
        this.Name = name;
        this.OwnerId = ownerId;
        this.CreationTime = DateTime.Now;
        this.SubscriberIds = null;
    }
}