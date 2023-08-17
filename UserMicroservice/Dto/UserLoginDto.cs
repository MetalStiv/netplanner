namespace UserMicroservice.Dto;
public record UserLoginDto(string AccessToken, string RefreshToken, 
    string Name, string Email, string AvatarBase64, int TimeZone,
    float AppVersion, List<string> Updates);