namespace Kabanata.Api.Models;

public class Review
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public string Handle { get; set; } = "@romar_reads";
    public int Rating { get; set; } = 5;
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}