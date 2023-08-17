var builder = WebApplication.CreateBuilder(args);

var dbSettings = new ProjectDBSettings(
    Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? "",
    Environment.GetEnvironmentVariable("DB_NAME") ?? "",
    Environment.GetEnvironmentVariable("DB_PROJECT_META_COLLECTION_NAME") ?? "",
    Environment.GetEnvironmentVariable("DB_PAGE_COLLECTION_NAME") ?? "",
    Environment.GetEnvironmentVariable("DB_LAYER_COLLECTION_NAME") ?? "",
    Environment.GetEnvironmentVariable("DB_SHAPE_COLLECTION_NAME") ?? "",
    Environment.GetEnvironmentVariable("DB_INVITE_COLLECTION_NAME") ?? ""
);

var jwtSettings = new JwtSettings(
    Environment.GetEnvironmentVariable("JWT_PUBLIC_KEY") ?? "",
    Environment.GetEnvironmentVariable("JWT_ISSUER") ?? ""
);

var userMicroservice = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "";

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c => c.EnableAnnotations());

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

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy  =>
        {
            policy.WithOrigins("http://d829aea8686a.vps.myjino.ru",
                                "http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();;
        });
});

await using var app = builder.Build();
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();
 
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.MapPost("/addProject", 
[SwaggerOperation(
        Summary = "Add project",
        Description = "Requires login")]
    [SwaggerResponse(401, "Unauthorized")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http, 
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
        await projectRepositoryService.AddAsync(newProjectMeta, projectCreationDto.DefaultPageName,
            projectCreationDto.DefaultLayerName);

        await http.Response.WriteAsJsonAsync(newProjectMeta);
        return;
    }
)
    .Accepts<ProjectCreationDto>("application/json")
    .Produces<ProjectMeta>(StatusCodes.Status200OK);

app.MapGet("/getProjects",
[SwaggerOperation(
        Summary = "Get all user owned and shared project",
        Description = "Requires login")]
    [SwaggerResponse(401, "Unauthorized")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var projects = await projectRepositoryService.GetProjectsAsync(userId);
        if (projects == null)
        {
            return;
        }
        var result = new List<ProjectMetaDto>();
        foreach(var p in projects!)
        {
            var invites = await projectRepositoryService.GetProjectInvitesAsync(p.Id!);
            if (p.OwnerId == userId)
            {
                result.Add(new ProjectMetaDto(p.Id!, p.Name, p.OwnerId, p.GroupId!, p.CreationTime,
                    p.LastModifyTime, p.IsGroup, invites, 0));
            }
            else
            {
                var permission = await projectRepositoryService.CheckUserRight(userId, p.Id!);
                result.Add(new ProjectMetaDto(p.Id!, p.Name, p.OwnerId, p.GroupId!, p.CreationTime,
                    p.LastModifyTime, p.IsGroup, invites, permission));
            }
        }
        await http.Response.WriteAsJsonAsync(result);
        // await http.Response.WriteAsJsonAsync(projects);
        return;
    }
)
.Produces<List<ProjectMeta>>(StatusCodes.Status200OK);

app.MapDelete("/removeProject",
[SwaggerOperation(
        Summary = "Remove owned or shared with full grants user project",
        Description = "Requires login")]
    [SwaggerResponse(401, "Unauthorized")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var projectIdDto = await http.Request.ReadFromJsonAsync<ProjectIdDto>();
        var project = await projectRepositoryService.GetProjectByIdAsync(projectIdDto!.Id);

        if (await projectRepositoryService.CheckUserRight(userId, projectIdDto!.Id) != 2)
        {
            http.Response.StatusCode = 401;
            return;
        }

        await projectRepositoryService.RemoveAsync(projectIdDto!.Id);
        http.Response.StatusCode = 200;
        return;
    }
)
.Accepts<ProjectIdDto>("application/json")
    .Produces(StatusCodes.Status200OK);

app.MapPost("/renameProject",
[SwaggerOperation(
        Summary = "Rename owned or shared with full grants user project",
        Description = "Requires login")]
    [SwaggerResponse(401, "Unauthorized")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var renameProjectDto = await http.Request.ReadFromJsonAsync<RenameProjectDto>();
        var project = await projectRepositoryService.GetProjectByIdAsync(renameProjectDto!.Id);

        if (await projectRepositoryService.CheckUserRight(userId, renameProjectDto!.Id) != 2)
        {
            http.Response.StatusCode = 401;
            return;
        }

        project.Name = renameProjectDto.Name;
        await projectRepositoryService.UpdateAsync(project);
        
        http.Response.StatusCode = 200;
        return;
    }
)
    .Accepts<RenameProjectDto>("application/json")
    .Produces(StatusCodes.Status200OK);

app.MapPost("/moveProjectToGroup", 
    [SwaggerOperation(
        Summary = "Move owned or shared with full grants user project to group",
        Description = "Requires login")]
    [SwaggerResponse(401, "Unauthorized")]
    [SwaggerResponse(500, "Some failure")]
    [SwaggerResponse(501, "No group with such Id")]
    [Authorize] async (HttpContext http, 
        ITokenService tokenService,
        IProjectRepositoryService projectRepositoryService) => {
            var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var userId = tokenService.GetUserIdFromToken(token);

            var moveProjectDto = await http.Request.ReadFromJsonAsync<MoveProjectDto>();

            if (await projectRepositoryService.CheckUserRight(userId, moveProjectDto!.Id) != 2
                || await projectRepositoryService.CheckUserRight(userId, moveProjectDto!.GroupId) != 2)
            {
                http.Response.StatusCode = 401;
                return;
            }
            var group = await projectRepositoryService.GetProjectByIdAsync(moveProjectDto!.GroupId);
            if (!group.IsGroup)
            {
                http.Response.StatusCode = 501;
                return;
            }

            var project = await projectRepositoryService.GetProjectByIdAsync(moveProjectDto!.Id);
            project.GroupId = moveProjectDto!.GroupId;
            await projectRepositoryService.UpdateAsync(project);

            http.Response.StatusCode = 200;
            return;
        }
)
    .Accepts<MoveProjectDto>("application/json")
    .Produces<ProjectMeta>(StatusCodes.Status200OK);

app.MapPost("/sendInvite", 
    [SwaggerOperation(
        Summary = "Send invite to project or group by user with full grant",
        Description = "Requires login")]
    [SwaggerResponse(401, "Unauthorized")]
    [SwaggerResponse(500, "Some failure")]
    [SwaggerResponse(501, "No user with such Id")]
    [SwaggerResponse(502, "Attempt to invite owner or already invited user")]
    [Authorize] async (HttpContext http,
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var inviteDto = await http.Request.ReadFromJsonAsync<InviteDto>();
        var project = await projectRepositoryService.GetProjectByIdAsync(inviteDto!.ProjectId);

        if (await projectRepositoryService.CheckUserRight(userId, inviteDto!.ProjectId) != 2)
        {
            http.Response.StatusCode = 401;
            return;
        }

        var client = new HttpClient();
        // var subscriberId = await client.GetStringAsync(userMicroservice+"/getId?mail="+sendInviteDto.UserId);
        var subscriberId = await client.GetStringAsync("http://user-microservice:5108/getId?mail="+inviteDto.Email);
        if (subscriberId == "")
        {
            http.Response.StatusCode = 501;
            return;
        }
        if (subscriberId == project.OwnerId)
        {
            http.Response.StatusCode = 502;
            return;
        }

        var invite = new Invite(inviteDto.ProjectId, subscriberId, userId, inviteDto.Permission);
        await projectRepositoryService.AddInvite(invite);
        
        http.Response.StatusCode = 200;
        return;
    }
)
    .Accepts<InviteDto>("application/json")
    .Produces(StatusCodes.Status200OK);

app.MapDelete("/revokeInvite", 
[SwaggerOperation(
        Summary = "Revoke invite to project or group by full granted user",
        Description = "Requires login")]
    [SwaggerResponse(401, "Unauthorized")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var inviteId = (await http.Request.ReadFromJsonAsync<IdDto>())!.Id;
        var invite = await projectRepositoryService.GetInviteByIdAsync(inviteId);
        var project = await projectRepositoryService.GetProjectByIdAsync(invite.ProjectId);

        if (await projectRepositoryService.CheckUserRight(userId, invite.ProjectId) != 2)
        {
            http.Response.StatusCode = 401;
            return;
        }

        await projectRepositoryService.RemoveInviteAsync(inviteId);
        
        http.Response.StatusCode = 200;
        return;
    }
)
    .Accepts<IdDto>("application/json")
    .Produces(StatusCodes.Status200OK);

app.MapPost("/acceptInvite",
[SwaggerOperation(
        Summary = "Accept invite",
        Description = "Requires login")]
    [SwaggerResponse(401, "Unauthorized")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var inviteId = (await http.Request.ReadFromJsonAsync<IdDto>())!.Id;
        var invite = await projectRepositoryService.GetInviteByIdAsync(inviteId);

        if (invite.UserId != userId)
        {
            http.Response.StatusCode = 401;
            return; 
        }
        
        invite.State = 1;
        await projectRepositoryService.UpdateInviteAsync(invite);

        http.Response.StatusCode = 200;
        return;
    }
)
    .Accepts<IdDto>("application/json")
    .Produces(StatusCodes.Status200OK);

app.MapPost("/declineInvite",
[SwaggerOperation(
        Summary = "Decline invite",
        Description = "Requires login")]
    [SwaggerResponse(401, "Unauthorized")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var inviteId = (await http.Request.ReadFromJsonAsync<IdDto>())!.Id;
        var invite = await projectRepositoryService.GetInviteByIdAsync(inviteId);

        if (invite.UserId != userId)
        {
            http.Response.StatusCode = 401;
            return; 
        }
        
        invite.State = 2;
        await projectRepositoryService.UpdateInviteAsync(invite);

        http.Response.StatusCode = 200;
        return;
    }
)
    .Accepts<IdDto>("application/json")
    .Produces(StatusCodes.Status200OK);

app.MapGet("/getActiveInvites",
[SwaggerOperation(
        Summary = "Get all invites require user decision",
        Description = "Requires login")]
    [SwaggerResponse(401, "Unauthorized")]
    [SwaggerResponse(500, "Some failure")]
    [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var invites = (await projectRepositoryService.GetUserInvitesAsync(userId)).FindAll(i => i.State == 0);
        var client = new HttpClient();
        var inviteDtos = invites.Select(async (i) => {
            var project = await projectRepositoryService.GetProjectByIdAsync(i.ProjectId);
            var inviterName = await client.GetStringAsync("http://user-microservice:5108/getName?id="+i.InviterId);

            return new InviteDto(i.Id!, i.ProjectId, null, null, i.Permission, inviterName, 
                project.IsGroup, project.Name);
        })
            .Select(i => i.Result);
        await http.Response.WriteAsJsonAsync(inviteDtos);
        return;
    }
);

await app.RunAsync();