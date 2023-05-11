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

    [BsonElement("groupId")]
    public string? GroupId { get; set; }

    [BsonElement("creationTime")]
    public DateTime CreationTime { get; private set; }
    
    [BsonElement("lastModifyTime")]
    public DateTime LastModifyTime { get; private set; }

    [BsonElement("isGroup")]
    public bool IsGroup { get; set; }

    private ProjectMeta(string name, string ownerId, string groupId, bool isGroup)
    {
        this.Name = name;
        this.OwnerId = ownerId;
        this.GroupId = groupId;
        this.CreationTime = DateTime.Now;
        this.LastModifyTime = DateTime.Now;
        this.IsGroup = isGroup;
    }

    public static ProjectMeta CreateProjectMeta(string name, string ownerId, string groupId)
    {
        return new ProjectMeta(name, ownerId, groupId, false);
    }

    public static ProjectMeta CreateProjectMetaGroup(string name, string ownerId, string groupId)
    {
        return new ProjectMeta(name, ownerId, groupId, true);
    }
}