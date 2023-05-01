namespace ProjectMicroservice.Dto;
public record ProjectCreationDto(string Name, string DefaultPageName, 
    string DefaultLayerName, string GroupId, bool isGroup);