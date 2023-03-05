namespace UserMicroservice.Services.TokenService;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken(User user);
    string GetUserIdFromToken(string token);
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}