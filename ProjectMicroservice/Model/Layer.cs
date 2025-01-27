using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ProjectMicroservice.Model;

public record Layer
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }
    
    [BsonElement("pageId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? PageId { get; private set; }

    [BsonElement("name")]
    public string Name { get; private set; }

    [BsonElement("zIndex")]
    public int ZIndex { get; private set; }

    [BsonElement("isVisible")]
    public bool isVisible { get; private set; }

    public Layer(string name, string pageId, int zIndex, bool isVisible)
    {
        this.Name = name;
        this.PageId = pageId;
        this.ZIndex = zIndex;
        this.isVisible = isVisible;
    }
}