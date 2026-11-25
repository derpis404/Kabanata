using Kabanata.Api.Data;
using Kabanata.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kabanata.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShelfController : ControllerBase
{
    private readonly KabanataDbContext _db;

    public ShelfController(KabanataDbContext db)
    {
        _db = db;
    }

    public record ToggleTbrRequest(
        string UserHandle,
        string BookSlug,
        string? Title,
        string? Author,
        string? Publisher,
        string? Image
    );

    // GET: api/shelf?handle=@kabanata_reader
    [HttpGet]
    public async Task<IActionResult> GetUserTbr([FromQuery] string handle = "@kabanata_reader")
    {
        var items = await _db.TbrItems
            .Include(t => t.Book)
            .Where(t => t.UserHandle == handle)
            .OrderByDescending(t => t.AddedAt)
            .Select(t => new
            {
                t.Id,
                t.UserHandle,
                t.AddedAt,
                Book = t.Book
            })
            .ToListAsync();

        return Ok(items);
    }

    // POST: api/shelf/toggle
    [HttpPost("toggle")]
    public async Task<IActionResult> ToggleTbr([FromBody] ToggleTbrRequest req)
    {
        var handle = string.IsNullOrWhiteSpace(req.UserHandle) ? "@kabanata_reader" : req.UserHandle.Trim();

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

        var existing = await _db.TbrItems
            .FirstOrDefaultAsync(t => t.UserHandle == handle && t.BookId == book.Id);

        if (existing != null)
        {
            _db.TbrItems.Remove(existing);
            await _db.SaveChangesAsync();
            return Ok(new { saved = false, bookSlug = req.BookSlug });
        }

        _db.TbrItems.Add(new TbrItem
        {
            UserHandle = handle,
            BookId = book.Id,
            AddedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();

        return Ok(new { saved = true, bookSlug = req.BookSlug });
    }
}