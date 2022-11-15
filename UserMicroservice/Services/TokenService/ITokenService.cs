namespace UserMicroservice.Services.TokenService;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken(User user);
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}