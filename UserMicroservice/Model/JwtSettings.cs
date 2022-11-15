namespace UserMicroservice.Model;

public class JwtSettings
{
    public RsaSecurityKey PrivateKey { set; get; }
    public RsaSecurityKey PublicKey { set; get; }
    public string Issuer {set; get; } = string.Empty;

    public JwtSettings(string privateKey, string publicKey, string issuer)
    {
        Issuer = issuer;

        using (var stream = File.OpenRead(privateKey))
        using (var reader = new PemReader(stream))
        {
            var rsaParameters = reader.ReadRsaKey();
            PrivateKey = new RsaSecurityKey(RSA.Create(rsaParameters));
        }

        using (var stream = File.OpenRead(publicKey))
        using (var reader = new PemReader(stream))
        {
            var rsaParameters = reader.ReadRsaKey();
            PublicKey = new RsaSecurityKey(RSA.Create(rsaParameters));
        }
    }
}