namespace UserMicroservice.Model;

public class JwtSettings
{
    public string Key { set; get; } = string.Empty;
    public string Issuer {set; get; } = string.Empty;

    public JwtSettings(string key, string issuer)
    {
        Key = key;
        Issuer = issuer;
    }
}