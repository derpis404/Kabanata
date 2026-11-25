using Kabanata.Api.Data;
using Kabanata.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kabanata.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly KabanataDbContext _db;

    public ReviewsController(KabanataDbContext db)
    {
        _db = db;
    }

    public record CreateReviewRequest(
        string BookSlug,
        string? Title,
        string? Author,
        string? Publisher,
        string? Image,
        string Handle,
        int Rating,
        string Comment
    );

    // POST: api/reviews
    [HttpPost]
    public async Task<ActionResult<Review>> PostReview([FromBody] CreateReviewRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Comment))
            return BadRequest("Review comment cannot be empty.");

        var book = await _db.Books.FirstOrDefaultAsync(b => b.Slug == req.BookSlug);
        if (book == null)
        {
            book = new Book
            {
                Slug = req.BookSlug,
                ExternalApiId = req.BookSlug,
                Title = string.IsNullOrWhiteSpace(req.Title) ? "Untitled Book" : req.Title,
                Author = string.IsNullOrWhiteSpace(req.Author) ? "Unknown Author" : req.Author,
                Publisher = string.IsNullOrWhiteSpace(req.Publisher) ? "Indie Press" : req.Publisher,
                Image = req.Image ?? "",
                MarketType = "library"
            };
            _db.Books.Add(book);
            await _db.SaveChangesAsync();
        }

        // General fallback handle if the user leaves the handle field blank
        var cleanHandle = string.IsNullOrWhiteSpace(req.Handle)
            ? "@kabanata_reader"
            : (req.Handle.StartsWith("@") ? req.Handle.Trim() : $"@{req.Handle.Trim()}");

        var review = new Review
        {
            BookId = book.Id,
            Handle = cleanHandle,
            Rating = Math.Clamp(req.Rating, 1, 5),
            Comment = req.Comment.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        return Ok(review);
    }
}