var builder = WebApplication.CreateBuilder(args);

var dbSettings = new UserDBSettings(
    Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? "",
    Environment.GetEnvironmentVariable("DB_NAME") ?? "",
    Environment.GetEnvironmentVariable("DB_USER_COLLECTION_NAME") ?? ""
);

var mailSettings = new MailSettings(
    Environment.GetEnvironmentVariable("MAIL_NAME") ?? "",
    Environment.GetEnvironmentVariable("MAIL_DISPLAY_NAME") ?? "",
    Environment.GetEnvironmentVariable("MAIL_PASSWORD") ?? "",
    Environment.GetEnvironmentVariable("MAIL_HOST") ?? "",
    Int32.Parse(Environment.GetEnvironmentVariable("MAIL_PORT") ?? "")
);

var jwtSettings = new JwtSettings(
    Environment.GetEnvironmentVariable("JWT_PRIVATE_KEY") ?? "",
    Environment.GetEnvironmentVariable("JWT_PUBLIC_KEY") ?? "",
    Environment.GetEnvironmentVariable("JWT_ISSUER") ?? ""
);

builder.Services.AddSingleton<ITokenService>(new RsaTokenService(jwtSettings));
builder.Services.AddSingleton<IUserRepositoryService>(new MongoDBUserRepositoryService(dbSettings));
builder.Services.AddSingleton<UserMicroservice.Services.MailService.IMailService>(new MyMailService(mailSettings));
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new ()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Issuer,
        IssuerSigningKey = jwtSettings.PublicKey,
    };
});
builder.Services.AddCors();

await using var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
 
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000"));

app.MapPost("/register", [AllowAnonymous] async (HttpContext http,
    IUserRepositoryService userRepositoryService,
    UserMicroservice.Services.MailService.IMailService mailService) => {
        var loginDto = await http.Request.ReadFromJsonAsync<LoginDto>();
        if (loginDto == null)
        {
            http.Response.StatusCode = 500;
            return;
        }
        var user = new User(loginDto.Email, loginDto.Password);
        
        var sameUser = await userRepositoryService.GetByEmailAsync(user.Email);
        if (sameUser != null)
        {
            http.Response.StatusCode = 520;
            return;
        }

        await userRepositoryService.AddAsync(user);
        await mailService.SendAuthMailAsync(user);
        return;
    }
);
 
app.MapPost("/login", [AllowAnonymous] async (HttpContext http, 
    ITokenService tokenService, 
    IUserRepositoryService userRepositoryService) => {
        var loginDto = await http.Request.ReadFromJsonAsync<LoginDto>();
        if (loginDto == null)
        {
            http.Response.StatusCode = 500;
            return;
        }
        var user = await userRepositoryService.GetByEmailAsync(loginDto.Email);
        if (user == null || !user.Verified)
        {
            http.Response.StatusCode = 520;
            return;
        }

        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password + user.Salt, user.PasswordHash))
        {
            http.Response.StatusCode = 521;
            return;
        }
    
        var accessToken = tokenService.GenerateAccessToken(user);
        var refreshToken = tokenService.GenerateRefreshToken(user);

        await userRepositoryService.UpdateAsync(user);

        await http.Response.WriteAsJsonAsync(new {
            accessToken = accessToken, 
            refreshToken = refreshToken,
            name = user.Name,
            email = user.Email,
            avatarBase64 =  user.AvatarBase64,
            timeZone = user.TimeZone
        });
        return;
    }
);

app.MapPost("/refreshToken", [AllowAnonymous] async (HttpContext http, 
    ITokenService tokenService, 
    IUserRepositoryService userRepositoryService) => {
        var tokenApiDto = await http.Request.ReadFromJsonAsync<TokenApiDto>();
        if (tokenApiDto == null)
        {
            http.Response.StatusCode = 500;
            return;
        }
        
        var principal = tokenService.GetPrincipalFromExpiredToken(tokenApiDto.AccessToken);
        if (principal.Identities == null)
        {
            http.Response.StatusCode = 401;
            return;
        }
        var claims = principal.Identities.First().Claims.ToList();

        var user = await userRepositoryService.GetByIdAsync(claims.First(c => c.Type.Equals("Id")).Value);
        if (user == null)
        {
            http.Response.StatusCode = 401;
            return;
        }

        if (user.RefreshToken != tokenApiDto.RefreshToken || !user.Verified)
        {
            http.Response.StatusCode = 401;
            return;
        }
        var newAccessToken = tokenService.GenerateAccessToken(user);
        var newRefreshToken = tokenService.GenerateRefreshToken(user);

        await userRepositoryService.UpdateAsync(user);

        await http.Response.WriteAsJsonAsync(new
        {
            accessToken = newAccessToken,
            refreshToken = newRefreshToken
        });
        return;
    }
);

app.MapGet("/verify", [AllowAnonymous] async (HttpContext http,
    IUserRepositoryService userRepositoryService) => {
        var verificationApiDto = new VerificationApiDto(http.Request.Query["email"],
            http.Request.Query["code"]);

        var user = await userRepositoryService.GetByEmailAsync(verificationApiDto.Email);
        if (user == null)
        {
            http.Response.StatusCode = 500;
            return;
        }

        if (user.VerificationCode != verificationApiDto.Code)
        {
            http.Response.StatusCode = 520;
            return;
        }

        user.Verified = true;

        await userRepositoryService.UpdateAsync(user);

        await http.Response.WriteAsJsonAsync(new
        {
            res = "Ok"
        });
        return;
    }
);
 
app.MapGet("/getUsersByIds", ([Authorize] async (HttpContext http,
    IUserRepositoryService userRepositoryService) => {
        var userIdsDto = new UserIdsDto(http.Request.Query["ids[]"]);

        var userDtos = new List<UserDto>();
        foreach (var id in userIdsDto.Ids)
        {
            var user = await userRepositoryService.GetByIdAsync(id);
            if (user == null){
                http.Response.StatusCode = 520;
                return;
            }
            userDtos.Add(new UserDto(user.Id!, user.Name, user.AvatarBase64!, user.TimeZone));
        }

        await http.Response.WriteAsJsonAsync(userDtos);
        return;
    })
);

app.MapPost("/changeName", ([Authorize] async (HttpContext http,
    ITokenService tokenService,
    IUserRepositoryService userRepositoryService) => {
        var newNameDto = await http.Request.ReadFromJsonAsync<UserNameDto>();
        if (newNameDto!.name.Length <= 0)
        {
            http.Response.StatusCode = 500;
            return;
        }
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var user = await userRepositoryService.GetByIdAsync(userId);
        user!.Name = newNameDto.name;
        await userRepositoryService.UpdateAsync(user);

        http.Response.StatusCode = 200;
        return;
    })
);

app.MapPost("/changeAvatar", ([Authorize] async (HttpContext http,
    ITokenService tokenService,
    IUserRepositoryService userRepositoryService) => {
        var newAvatarDto = await http.Request.ReadFromJsonAsync<UserAvatarDto>();
        if (newAvatarDto!.avatarBase64.Length <= 0)
        {
            http.Response.StatusCode = 500;
            return;
        }
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var user = await userRepositoryService.GetByIdAsync(userId);
        user!.AvatarBase64 = newAvatarDto.avatarBase64;
        await userRepositoryService.UpdateAsync(user);

        http.Response.StatusCode = 200;
        return;
    })
);

app.MapPost("/changeTimeZone", ([Authorize] async (HttpContext http,
    ITokenService tokenService,
    IUserRepositoryService userRepositoryService) => {
        var newTimezoneDto = await http.Request.ReadFromJsonAsync<UserTimeZoneDto>();

        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var user = await userRepositoryService.GetByIdAsync(userId);
        user!.TimeZone = newTimezoneDto.timeZoneId;
        await userRepositoryService.UpdateAsync(user);

        http.Response.StatusCode = 200;
        return;
    })
);
 
await app.RunAsync();