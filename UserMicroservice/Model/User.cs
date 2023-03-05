using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserMicroservice.Model;

public record User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }

    [BsonElement("name")]
    public string Name { get; set; }

    [BsonElement("email")]
    public string Email { get; set; }
 
    [BsonElement("passwordHash")]
    public string PasswordHash { get; set; }

    [BsonElement("salt")]
    public string Salt {get; set; }

    [BsonElement("verified")]
    public bool Verified { get; set; }

    [BsonElement("verificationCode")]
    public string VerificationCode { get; set; }

    [BsonElement("refreshToken")]
    public string? RefreshToken { get; set; }

    [BsonElement("refreshTokenExpiryTime")]
    public DateTime? RefreshTokenExpiryTime { get; set; }

    [BsonElement("avatarBase64")]
    public string? AvatarBase64 { get; set; }

    [BsonElement("timezoneId")]
    public int TimeZone { get; set; }

    public User(string email, string password)
    {
        this.Email = email;
        this.Name = email.Split("@")[0];
        this.Salt = Convert.ToBase64String(RandomNumberGenerator.GetBytes(128 / 8));
        this.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password + this.Salt);
        this.Verified = false; 

        const string pool = "abcdefghijklmnopqrstuvwxyz0123456789";
        var rnd = new Random();
        var builder = new StringBuilder();
        for (var i = 0; i < 16; i++)
        {
            var c = pool[rnd.Next(0, pool.Length)];
            builder.Append(c);
        }
        this.VerificationCode = builder.ToString();
        this.AvatarBase64 = string.Empty;
        this.TimeZone = 18;
    }
}