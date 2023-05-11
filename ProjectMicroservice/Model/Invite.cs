using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ProjectMicroservice.Model;

public record Invite
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }

    [BsonElement("projectId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProjectId { get; private set; }

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; private set; }
    
    [BsonElement("permission")]
    [BsonRepresentation(BsonType.Int32)]
    public int Permission { get; private set; }

    [BsonElement("state")]
    [BsonRepresentation(BsonType.Int32)]
    public int State { get; private set; }

    public Invite(string projectId, string userId, int permission)
    {
        this.ProjectId = projectId;
        this.UserId = userId;
        this.Permission = permission;
        this.State = 0;
    }
}