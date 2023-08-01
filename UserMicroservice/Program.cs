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

var frontUrl = "http://localhost:3000/";

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c => c.EnableAnnotations());

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
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000"));

app.UseAuthentication();
app.UseAuthorization();
 
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.MapPost("/register", 
    [SwaggerOperation(
        Summary = "Register new user",
        Description = "Not requires login")]
    [SwaggerResponse(520, "Email is already used")]
    [SwaggerResponse(521, "Email is unreachable")]
    [SwaggerResponse(500, "Some failure")]
    [AllowAnonymous] async (HttpContext http,
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
            using(var cts = new CancellationTokenSource())
            {
                await mailService.SendAuthMailAsync(user, cts.Token);
            }
            await userRepositoryService.AddAsync(user);
            return;
        }
)
    .Accepts<LoginDto>("application/json")
    .Produces(StatusCodes.Status200OK);


app.MapPost("/changePassword", 
    [SwaggerOperation(
        Summary = "Change user's password",
        Description = "Requires login")]
    [SwaggerResponse(520, "Wrong old password")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http,
        ITokenService tokenService,
        IUserRepositoryService userRepositoryService,
        UserMicroservice.Services.MailService.IMailService mailService) => {
            var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var userId = tokenService.GetUserIdFromToken(token);
            var user = await userRepositoryService.GetByIdAsync(userId);
            var passwordChangeDto = await http.Request.ReadFromJsonAsync<PasswordChangeDto>();
            if (passwordChangeDto == null)
            {
                http.Response.StatusCode = 500;
                return;
            };

            if (!BCrypt.Net.BCrypt.Verify(passwordChangeDto.OldPassword + user!.Salt, user.PasswordHash))
            {
                http.Response.StatusCode = 520;
                return;
            }

            user.ChangePassword(passwordChangeDto.NewPassword);
            await userRepositoryService.UpdateAsync(user!);
            http.Response.StatusCode = 200;
            return;
        }
)
    .Accepts<PasswordChangeDto>("application/json")
    .Produces(StatusCodes.Status200OK);
 
app.MapPost("/login", 
    [SwaggerOperation(
        Summary = "Login",
        Description = "Not requires login")]
    [SwaggerResponse(520, "No verified user with such email")]
    [SwaggerResponse(521, "Wrong password")]
    [SwaggerResponse(500, "Some failure")]
    [AllowAnonymous] async (HttpContext http, 
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

            await http.Response.WriteAsJsonAsync(new UserLoginDto(
                accessToken, 
                refreshToken,
                user.Name,
                user.Email,
                user.AvatarBase64!,
                user.TimeZone
            ));
            return;
        }
)
    .Accepts<LoginDto>("application/json")
    .Produces<UserLoginDto>(StatusCodes.Status200OK);

app.MapGet("/whoIs", 
    [SwaggerOperation(
        Summary = "Returns user info",
        Description = "Requires login")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http, 
        ITokenService tokenService, 
        IUserRepositoryService userRepositoryService) => {
            var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var userId = tokenService.GetUserIdFromToken(token);

            var user = await userRepositoryService.GetByIdAsync(userId);
            await http.Response.WriteAsJsonAsync(new UserLoginDto(
                "",
                "",
                user!.Name,
                user.Email,
                user.AvatarBase64!,
                user.TimeZone
            ));
            return;
        }
)
    .Accepts<LoginDto>("application/json")
    .Produces<UserLoginDto>(StatusCodes.Status200OK);

app.MapPost("/refreshToken", 
    [SwaggerOperation(
        Summary = "Refresh token",
        Description = "Requires login")]
    [SwaggerResponse(520, "IncorrectData")]
    [SwaggerResponse(521, "Empty principal")]
    [SwaggerResponse(522, "Incorrect user id")]
    [SwaggerResponse(523, "Incorrect refresh token")]
    [SwaggerResponse(500, "Some failure")]
    [AllowAnonymous] async (HttpContext http, 
        ITokenService tokenService, 
        IUserRepositoryService userRepositoryService) => {
            var tokenApiDto = await http.Request.ReadFromJsonAsync<TokenApiDto>();
            if (tokenApiDto == null)
            {
                http.Response.StatusCode = 520;
                return;
            }
            
            var principal = tokenService.GetPrincipalFromExpiredToken(tokenApiDto.AccessToken);
            if (principal.Identities == null)
            {
                http.Response.StatusCode = 521;
                return;
            }
            var claims = principal.Identities.First().Claims.ToList();

            var user = await userRepositoryService.GetByIdAsync(claims.First(c => c.Type.Equals("Id")).Value);
            if (user == null)
            {
                http.Response.StatusCode = 522;
                return;
            }

            if (user.RefreshToken != tokenApiDto.RefreshToken || !user.Verified)
            {
                http.Response.StatusCode = 523;
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
)
    .Accepts<TokenApiDto>("application/json")
    .Produces<TokenApiDto>(StatusCodes.Status200OK);

app.MapGet("/verify", 
    [SwaggerOperation(
        Summary = "Verify user (from email)",
        Description = "Not requires login")]
    [SwaggerResponse(520, "No user with such email")]
    [SwaggerResponse(521, "Incorrect verify code")]
    [SwaggerResponse(500, "Some failure")]
    [AllowAnonymous] async (HttpContext http,
        IUserRepositoryService userRepositoryService,
        [SwaggerParameter("email", Required = true)] string email,
        [SwaggerParameter("code", Required = true)] string code) => {
            var user = await userRepositoryService.GetByEmailAsync(email);
            if (user == null)
            {
                http.Response.StatusCode = 520; 
                return;
            }

            if (user.VerificationCode != code)
            {
                http.Response.StatusCode = 521; 
                return;;
            }

            user.Verified = true;

            await userRepositoryService.UpdateAsync(user);

            http.Response.Redirect(frontUrl);  
            return;
        }
)
    .Produces(StatusCodes.Status200OK);

app.MapGet("/getUsersByIds", (
    [SwaggerOperation(
        Summary = "Map user ids to emails",
        Description = "Requires login. Parameter 'ids' - array of strings")]
    [SwaggerResponse(520, "No user with such id")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http,
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
)
    .Produces<List<UserDto>>(StatusCodes.Status200OK);

app.MapGet("/getId", (
    [SwaggerOperation(
        Summary = "Returns id by email",
        Description = "Not requires login")]
    [SwaggerResponse(500, "Some failure")]
        [AllowAnonymous] async (HttpContext http,
        IUserRepositoryService userRepositoryService,
        [SwaggerParameter("mail", Required = true)] string mail) => {
            var user = await userRepositoryService.GetByEmailAsync(mail);
            if (user == null)
            {
                return "";
            }
            return user!.Id;
        })
)
    .Produces<string>(StatusCodes.Status200OK);

app.MapGet("/getName", (
    [SwaggerOperation(
        Summary = "Returns email by id",
        Description = "Not requires login")]
    [SwaggerResponse(500, "Some failure")]
    [AllowAnonymous] async (HttpContext http,
        IUserRepositoryService userRepositoryService,
        [SwaggerParameter("id", Required = true)] string id) => {
            // var userId = http.Request.Query["id"];
            var user = await userRepositoryService.GetByIdAsync(id);
            if (user == null)
            {
                return "";
            }
            return user!.Name;
        })
)
    .Produces<string>(StatusCodes.Status200OK);

app.MapPost("/changeName", (
    [SwaggerOperation(
        Summary = "Change username",
        Description = "Requires login")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http,
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
)
    .Accepts<UserNameDto>("application/json")
    .Produces(StatusCodes.Status200OK);

app.MapPost("/changeAvatar", (
    [SwaggerOperation(
        Summary = "Change avatar",
        Description = "Requires login")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http,
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
)
    .Accepts<UserAvatarDto>("application/json")
    .Produces(StatusCodes.Status200OK);

app.MapPost("/changeTimeZone", (
    [SwaggerOperation(
        Summary = "Change timezone",
        Description = "Requires login")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http,
        ITokenService tokenService,
        IUserRepositoryService userRepositoryService) => {
            var newTimezoneDto = await http.Request.ReadFromJsonAsync<UserTimeZoneDto>();

            var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var userId = tokenService.GetUserIdFromToken(token);

            var user = await userRepositoryService.GetByIdAsync(userId);
            user!.TimeZone = newTimezoneDto!.timeZoneId;
            await userRepositoryService.UpdateAsync(user);

            http.Response.StatusCode = 200;
            return;
        })
)
    .Accepts<UserTimeZoneDto>("application/json")
    .Produces(StatusCodes.Status200OK);

app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Project Microservice API V1");
    c.RoutePrefix = "swagger/ui";
});

await app.RunAsync();