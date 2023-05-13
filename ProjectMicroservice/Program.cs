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
        await projectRepositoryService.AddAsync(newProjectMeta, projectCreationDto.DefaultPageName+" 1",
            projectCreationDto.DefaultLayerName+" 1");

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
        if (projects == null)
        {
            return;
        }
        var result = new List<ProjectMetaDto>();
        foreach(var p in projects!)
        {
            var invites = await projectRepositoryService.GetProjectInvitesAsync(p.Id!);
            result.Add(new ProjectMetaDto(p.Id!, p.Name, p.OwnerId, p.GroupId!, p.CreationTime,
                p.LastModifyTime, p.IsGroup, invites));
        }
        await http.Response.WriteAsJsonAsync(result);
        // await http.Response.WriteAsJsonAsync(projects);
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

        if (!await projectRepositoryService.CheckUserFullRight(userId, projectIdDto!.Id))
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

        if (!await projectRepositoryService.CheckUserFullRight(userId, renameProjectDto!.Id))
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

app.MapPost("/sendInvite", [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var inviteDto = await http.Request.ReadFromJsonAsync<InviteDto>();
        var project = await projectRepositoryService.GetProjectByIdAsync(inviteDto!.ProjectId);

        if (!await projectRepositoryService.CheckUserFullRight(userId, inviteDto!.ProjectId))
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
);

app.MapPost("/revokeInvite", [Authorize] async (HttpContext http, 
    ITokenService tokenService,
    IProjectRepositoryService projectRepositoryService) => {
        var token = http.Request.Headers["Authorization"].ToString().Split(" ")[1];
        var userId = tokenService.GetUserIdFromToken(token);

        var inviteId = (await http.Request.ReadFromJsonAsync<IdDto>())!.Id;
        var invite = await projectRepositoryService.GetInviteByIdAsync(inviteId);
        var project = await projectRepositoryService.GetProjectByIdAsync(invite.ProjectId);

        if (!await projectRepositoryService.CheckUserFullRight(userId, invite.ProjectId))
        {
            http.Response.StatusCode = 401;
            return;
        }

        await projectRepositoryService.RemoveInviteAsync(inviteId);
        
        http.Response.StatusCode = 200;
        return;
    }
);

app.MapPost("/acceptInvite", [Authorize] async (HttpContext http, 
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
);

app.MapPost("/declineInvite", [Authorize] async (HttpContext http, 
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
);

app.MapGet("/getActiveInvites", [Authorize] async (HttpContext http, 
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