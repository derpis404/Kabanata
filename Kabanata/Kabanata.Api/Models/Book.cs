namespace Kabanata.Api.Models;

public class Book
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty; // Matches frontend IDs like "gasp", "ella", "trese"
    public string? ExternalApiId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Publisher { get; set; } = "Indie Press";
    public string Language { get; set; } = "English";
    public string Format { get; set; } = "Novel";
    public string Trope { get; set; } = "All";
    public double Rating { get; set; } = 4.8;
    public int Trending { get; set; } = 99;
    public string MarketType { get; set; } = "sale"; // "sale", "swap", "library"
    public decimal? Price { get; set; }
    public string? Condition { get; set; }
    public string Seller { get; set; } = "Partner Bookstore";
    public string? Image { get; set; }
    public string FallbackBg { get; set; } = "linear-gradient(145deg, #5E2724, #23120B)";
    public string Synopsis { get; set; } = "No available synopsis.";

    public List<Review> Reviews { get; set; } = new();
}