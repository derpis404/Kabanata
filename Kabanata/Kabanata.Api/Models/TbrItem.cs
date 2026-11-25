namespace Kabanata.Api.Models;

public class TbrItem
{
    public int Id { get; set; }
    public string UserHandle { get; set; } = "@romar_reads";
    public int BookId { get; set; }
    public Book? Book { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}