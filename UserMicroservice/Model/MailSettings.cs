namespace UserMicroservice.Model;

public class MailSettings
{
    public string Mail { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; }

    public MailSettings(string mail, string displayName, string password,
        string host, int port)
    {
        Mail = mail;
        DisplayName = displayName;
        Password = password;
        Host = host;
        Port = port;
    }
}