namespace ProjectMicroservice.Services.TokenService;

public class RsaTokenService : ITokenService
{
    private JwtSettings _settings;

    public RsaTokenService(JwtSettings jwtSettings)
    {
        _settings = jwtSettings;
    }

    public string GetUserIdFromToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false, 
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = _settings.PublicKey,
            ValidateLifetime = false
        };
        SecurityToken securityToken;
        var principal = new JwtSecurityTokenHandler().ValidateToken(token, tokenValidationParameters, 
            out securityToken);

        var jwtSecurityToken = securityToken as JwtSecurityToken;
        if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.RsaSha256, 
            StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        return principal.Identities.First().Claims.ToList()
            .First(c => c.Type.Equals("Id")).Value;
    }
}