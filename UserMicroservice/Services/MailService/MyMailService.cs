namespace UserMicroservice.Services.MailService;

public class MyMailService : UserMicroservice.Services.MailService.IMailService
{
    private readonly MailSettings _mailSettings;
    private static string _templateDirectory = "./Resources/Templates/";
    private static string _imageDirectory = "./Resources/Images/";

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

        var bodyBuilder = new BodyBuilder(); 
        var templatePath = MyMailService._templateDirectory + "registrationEmail.html";
        var image = bodyBuilder.LinkedResources.Add(_imageDirectory + "BMSTU.png");
        image.ContentId = MimeUtils.GenerateMessageId();
        using (var SourceReader = System.IO.File.OpenText(templatePath))
        {
            bodyBuilder.HtmlBody = string.Format(SourceReader.ReadToEnd(), 
                "http://localhost:5108/verify", 
                "?code=" + user.VerificationCode + "&email=" + user.Email,
                image.ContentId
            );
        }

        email.Body = bodyBuilder.ToMessageBody();

        using var smtp = new SmtpClient();
        smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.Auto);
        smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
        await smtp.SendAsync(email);
        smtp.Disconnect(true);
    }
}
