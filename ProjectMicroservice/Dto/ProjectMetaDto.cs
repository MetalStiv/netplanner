namespace ProjectMicroservice.Dto;
public record ProjectMetaDto(string Id, string Name, string OwnerId, string GroupId, DateTime CreationTime, 
    DateTime LastModifyTime, bool IsGroup, List<Invite> invites);