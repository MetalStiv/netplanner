var builder = WebApplication.CreateBuilder(args);

var dbSettings = new ProjectDBSettings(
    Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? "",
    Environment.GetEnvironmentVariable("DB_NAME") ?? "",
    Environment.GetEnvironmentVariable("DB_PROJECT_META_COLLECTION_NAME") ?? "",
    Environment.GetEnvironmentVariable("DB_PROJECT_COLLECTION_NAME") ?? ""
);

var jwtSettings = new JwtSettings(
    Environment.GetEnvironmentVariable("JWT_PUBLIC_KEY") ?? "",
    Environment.GetEnvironmentVariable("JWT_ISSUER") ?? ""
);

builder.Services.AddSingleton<ITokenService>(new RsaTokenService(jwtSettings));
builder.Services.AddSingleton<IProjectRepositoryService>(new MongoDBProjectRepositoryService(dbSettings));

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new ()
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        // ValidAudience = jwtSettings.Audience,
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

app.MapPost("/addProject", [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);
        var projectCreationDto = await http.Request.ReadFromJsonAsync<ProjectCreationDto>();

        ProjectMeta newProjectMeta;
        if (projectCreationDto!.isGroup)
        {
            newProjectMeta = ProjectMeta.CreateProjectMetaGroup(projectCreationDto.Name, 
                userId,projectCreationDto.GroupId);
        }
        else
        {
            newProjectMeta = ProjectMeta.CreateProjectMeta(projectCreationDto.Name, 
                userId,projectCreationDto.GroupId);
        }
        await projectRepositoryService.AddAsync(newProjectMeta);

        await http.Response.WriteAsJsonAsync(newProjectMeta);
        return;
    }
);

app.MapGet("/getProjects", [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var projects = await projectRepositoryService.GetProjectsAsync(userId);
        await http.Response.WriteAsJsonAsync(projects);
        return;
    }
);

app.MapPost("/removeProject", [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var projectIdDto = await http.Request.ReadFromJsonAsync<ProjectIdDto>();
        var project = await projectRepositoryService.GetProjectByIdAsync(projectIdDto!.Id);

        if (project.OwnerId != userId)
        {
            http.Response.StatusCode = 401;
            return;
        }

        await projectRepositoryService.RemoveAsync(projectIdDto!.Id);
        http.Response.StatusCode = 200;
        return;
    }
);

app.MapPost("/renameProject", [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var renameProjectDto = await http.Request.ReadFromJsonAsync<RenameProjectDto>();
        var project = await projectRepositoryService.GetProjectByIdAsync(renameProjectDto!.Id);

        if (project.OwnerId != userId)
        {
            http.Response.StatusCode = 401;
            return;
        }

        project.Name = renameProjectDto.Name;
        await projectRepositoryService.UpdateAsync(project);
        
        http.Response.StatusCode = 200;
        return;
    }
);

app.MapGet("/getProjectContent", [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);
        var projectId = http.Request.Query["id"];

        if (projectId == "")
        {
            http.Response.StatusCode = 500;
            return;
        }

        ProjectMeta project;
        try
        {
            project = await projectRepositoryService.GetProjectByIdAsync(projectId);
        }
        catch(Exception){
            http.Response.StatusCode = 520;
            return;
        }

        var isSubscriber = false;
        if (project.SubscriberIds != null){
            isSubscriber = project.SubscriberIds.Contains(userId);
        }

        if (project == null || (project.OwnerId != userId && !isSubscriber))
        {
            http.Response.StatusCode = 520;
            return;
        }

        // await http.Response.WriteAsJsonAsync(projects);
        http.Response.StatusCode = 200;
        return;
    }
);
 
await app.RunAsync();