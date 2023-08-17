using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserMicroservice.Model;

public record Message
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }

    [BsonElement("version")]
    public string Version { get; private set; }

    [BsonElement("text")]
    public string Text { get; private set; }

    public Message(string version, string text)
    {
        this.Version = version;
        this.Text = text;
    }
}