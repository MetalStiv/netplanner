namespace UserMicroservice.Services.TokenService;

public class RsaTokenService : ITokenService
{
    private TimeSpan _expiryDuration = new TimeSpan(0, 6, 0);
    private JwtSettings _settings;

    public RsaTokenService(JwtSettings jwtSettings)
    {
        _settings = jwtSettings;
    }
    public string GenerateAccessToken(User user)
    {
        var claims = new[]
        {
            new Claim("Id", user.Id ?? string.Empty),
            new Claim("Email", user.Email),
            new Claim("Name", user.Name ?? string.Empty)
        };

        var credentials = new SigningCredentials(_settings.PrivateKey, SecurityAlgorithms.RsaSha256);
            var tokenDescriptor = new JwtSecurityToken(_settings.Issuer, _settings.Issuer, claims,
                expires: DateTime.Now.Add(_expiryDuration), signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    public string GenerateRefreshToken(User user)
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            var refreshToken = Convert.ToBase64String(randomNumber);
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddHours(12.0);
            return refreshToken;
        }
    }

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
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

        return principal;
    }
}