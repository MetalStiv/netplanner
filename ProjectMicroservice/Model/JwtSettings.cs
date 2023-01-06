namespace ProjectMicroservice.Model;

public class JwtSettings
{
    public RsaSecurityKey PublicKey { set; get; }
    public string Issuer {set; get; } = string.Empty;
    public string Audience {set; get; } = string.Empty;

    public JwtSettings(string publicKey, string issuer)
    {
        Issuer = issuer;

        using (var stream = File.OpenRead(publicKey))
        using (var reader = new PemReader(stream))
        {
            var rsaParameters = reader.ReadRsaKey();
            PublicKey = new RsaSecurityKey(RSA.Create(rsaParameters));
        }
    }
}