namespace UserMicroservice.Services.TokenService;

public class MyTokenService : ITokenService
{
    private TimeSpan ExpiryDuration = new TimeSpan(0, 10, 0);
    public string GenerateAccessToken(JwtSettings jwtSettings, User user)
    {
        var claims = new[]
        {
            new Claim("Id", user.Id ?? string.Empty),
            new Claim("Email", user.Email),
            new Claim("Name", user.Name ?? string.Empty)
        };
 
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
        var tokenDescriptor = new JwtSecurityToken(jwtSettings.Issuer, jwtSettings.Issuer, claims,
            expires: DateTime.Now.Add(ExpiryDuration), signingCredentials: credentials);
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

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token, string key)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false, 
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ValidateLifetime = false
        };
        SecurityToken securityToken;
        var principal = new JwtSecurityTokenHandler().ValidateToken(token, tokenValidationParameters, out securityToken);

        var jwtSecurityToken = securityToken as JwtSecurityToken;
        if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256Signature, 
            StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        return principal;
    }
}