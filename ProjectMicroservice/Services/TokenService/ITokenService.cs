namespace ProjectMicroservice.Services.TokenService;

public interface ITokenService
{
    string GetUserIdFromToken(string token);
}