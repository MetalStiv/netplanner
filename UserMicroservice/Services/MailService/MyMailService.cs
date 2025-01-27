namespace UserMicroservice.Services.MailService;

public class MyMailService : UserMicroservice.Services.MailService.IMailService
{
    private readonly MailSettings _mailSettings;
    private static string _templateDirectory = "./Resources/Templates/";
    private static string _imageDirectory = "./Resources/Images/";
    private static string _userMicroserviceUrl = "http://d829aea8686a.vps.myjino.ru:49275/verify";

    public MyMailService(MailSettings mailSettings)
    {
        _mailSettings = mailSettings;
    }
    public async Task SendAuthMailAsync(User user, CancellationToken ct)
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
                MyMailService._userMicroserviceUrl, 
                "?code=" + user.VerificationCode + "&email=" + user.Email,
                image.ContentId
            );
        }

        email.Body = bodyBuilder.ToMessageBody();

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.Auto, ct);
        await smtp.AuthenticateAsync(_mailSettings.Mail, _mailSettings.Password, ct);
        smtp.Timeout = 3000;
        var res = smtp.Send(email);
        Console.WriteLine(res);
        await smtp.DisconnectAsync(true, ct);
    }
}
