namespace ProjectMicroservice.Dto;
public record InviteDto(string Id, string ProjectId, string? InviterId, string? Email,
    int Permission, string? InviterName, bool? isGroup, string? projectName);