namespace UserMicroservice.Services.TokenService;

public interface ITokenService
{
    string GenerateAccessToken(JwtSettings jwtSettings, User user);
    string GenerateRefreshToken(User user);
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token, string key);
}