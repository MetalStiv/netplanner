namespace UserMicroservice.Services.MailService;

public class MyMailService : UserMicroservice.Services.MailService.IMailService
{
    private readonly MailSettings _mailSettings;

    public MyMailService(MailSettings mailSettings)
    {
        _mailSettings = mailSettings;
    }
    public async Task SendAuthMailAsync(User user)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
        email.To.Add(MailboxAddress.Parse(user.Email));
        email.Subject = "Netplanner email verification";

        var bodyBuilder = new BodyBuilder
        {
            TextBody = "Please confirm your account by clicking this link",
            HtmlBody = "Please confirm your account by clicking this link: " +
                "<a href='http://localhost:5108/verify?code=" + user.VerificationCode + 
                "&email=" + user.Email +
                "'>Link</a>"
        };
        email.Body = bodyBuilder.ToMessageBody();

        using var smtp = new SmtpClient();
        smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.Auto);
        smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
        await smtp.SendAsync(email);
        smtp.Disconnect(true);
    }
}
