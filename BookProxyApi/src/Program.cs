var builder = WebApplication.CreateBuilder(args);

// Open Library recommends identifying your app with a User-Agent and contact email
builder.Services.AddHttpClient("OpenLibrary", client =>
{
    client.BaseAddress = new Uri("https://openlibrary.org/");
    client.DefaultRequestHeaders.UserAgent.ParseAdd("BookProxyApp/1.0 (your-email@example.com)");
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(
                "https://your-username.github.io",
                "http://localhost:5173"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors("FrontendPolicy");

app.MapGet("/api/books/search", async (
    string q,
    IHttpClientFactory httpClientFactory,
    CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(q))
        return Results.BadRequest(new { error = "Query parameter 'q' is required." });

    var client = httpClientFactory.CreateClient("OpenLibrary");

    // Request only the fields your UI needs for faster responses
    var requestUri = $"search.json?q={Uri.EscapeDataString(q)}&fields=key,title,author_name,first_publish_year,cover_i&limit=20";
    var response = await client.GetAsync(requestUri, ct);

    var json = await response.Content.ReadAsStringAsync(ct);
    return Results.Content(json, "application/json", statusCode: (int)response.StatusCode);
});

app.Run();