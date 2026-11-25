using Kabanata.Api.Data;
using Kabanata.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kabanata.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly KabanataDbContext _db;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;

    public BooksController(KabanataDbContext db, IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _db = db;
        _httpClientFactory = httpClientFactory;
        _config = config;
    }

    // GET: api/books
    // Returns all seeded/saved books with their reader reviews
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    {
        return await _db.Books
            .Include(b => b.Reviews)
            .OrderBy(b => b.Trending)
            .ToListAsync();
    }

    // GET: api/books/{slug}
    // Returns a single book by its slug (e.g., "gasp", "ella") or numeric ID
    [HttpGet("{slug}")]
    public async Task<ActionResult<Book>> GetBook(string slug)
    {
        var book = await _db.Books
            .Include(b => b.Reviews)
            .FirstOrDefaultAsync(b => b.Slug == slug || b.Id.ToString() == slug);

        if (book == null) return NotFound();
        return book;
    }

    // GET: api/books/search?q=Philippine+literature
    // Proxies search requests to Google Books using the hidden server-side API key
    [HttpGet("search")]
    public async Task<IActionResult> SearchGoogleBooks([FromQuery] string q = "Philippine literature")
    {
        var apiKey = _config["GoogleBooks:ApiKey"];
        var keyParam = string.IsNullOrWhiteSpace(apiKey) ? "" : $"&key={apiKey}";
        var url = $"https://www.googleapis.com/books/v1/volumes?q={Uri.EscapeDataString(q)}&maxResults=12&printType=books{keyParam}";

        var client = _httpClientFactory.CreateClient();
        var response = await client.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode, "Failed to reach Google Books API.");
        }

        var json = await response.Content.ReadAsStringAsync();
        return Content(json, "application/json");
    }
}