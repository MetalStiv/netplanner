namespace UserMicroservice.Services.MailService;

public interface IMailService
{
    Task SendAuthMailAsync(User user, CancellationToken ct);
}
