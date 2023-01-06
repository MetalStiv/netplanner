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
            http.Response.StatusCode = 401;
            return;
        }
        var user = await userRepositoryService.GetByEmailAsync(loginDto.Email);
        if (user == null || !user.Verified)
        {
            http.Response.StatusCode = 401;
            return;
        }

        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password + user.Salt, user.PasswordHash))
        {
            http.Response.StatusCode = 401;
            return;
        }
    
        var accessToken = tokenService.GenerateAccessToken(user);
        var refreshToken = tokenService.GenerateRefreshToken(user);

        await userRepositoryService.UpdateAsync(user);

        await http.Response.WriteAsJsonAsync(new {
            accessToken = accessToken, 
            refreshToken = refreshToken });
        return;
    }
);

app.MapPost("/refreshToken", [AllowAnonymous] async (HttpContext http, 
    ITokenService tokenService, 
    IUserRepositoryService userRepositoryService) => {
        var tokenApiDto = await http.Request.ReadFromJsonAsync<TokenApiDto>();
        if (tokenApiDto == null)
        {
            http.Response.StatusCode = 401;
            return;
        }
        
        var principal = tokenService.GetPrincipalFromExpiredToken(tokenApiDto.AccessToken);
        if (principal.Identities == null)
        {
            http.Response.StatusCode = 401;
            return;
        }
        var claims = principal.Identities.First().Claims.ToList();

        var user = await userRepositoryService.GetByEmailAsync(claims.First(c => c.Type.Equals("Email")).Value);
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
            http.Response.StatusCode = 401;
            return;
        }

        if (user.VerificationCode != verificationApiDto.Code)
        {
            http.Response.StatusCode = 401;
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
 
app.MapGet("/doaction", (Func<string>)([Authorize]() => "Action Succeeded"));
 
await app.RunAsync();