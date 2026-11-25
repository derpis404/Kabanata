using Kabanata.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Kabanata.Api.Data;

public class KabanataDbContext : DbContext
{
    public KabanataDbContext(DbContextOptions<KabanataDbContext> options) : base(options) { }

    public DbSet<Book> Books => Set<Book>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<TbrItem> TbrItems => Set<TbrItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>().HasData(
            new Book
            {
                Id = 1,
                Slug = "gasp",
                Title = "The End Comes Without a Gasp",
                Author = "Trish Shishikura",
                Publisher = "Penguin SEA",
                Language = "English",
                Format = "Novel",
                Trope = "Campus Life",
                Rating = 4.8,
                Trending = 1,
                MarketType = "sale",
                Price = 495,
                Seller = "Fully Booked Official",
                Image = "assets/book1.jpg",
                FallbackBg = "linear-gradient(145deg, #2C3E50, #5E2724)",
                Synopsis = "An atmospheric contemporary novel tracing memory, quiet heartbreak, and the unspoken distance between people navigating life in Manila and beyond."
            },
            new Book
            {
                Id = 2,
                Slug = "ella",
                Title = "Ella Arcangel: Lupa at Dugo",
                Author = "Julius Villanueva",
                Publisher = "Komiket",
                Language = "Tagalog",
                Format = "Komiks",
                Trope = "Mythology",
                Rating = 4.9,
                Trending = 2,
                MarketType = "sale",
                Price = 380,
                Seller = "Komiket Store",
                Image = "assets/book2.png",
                FallbackBg = "linear-gradient(145deg, #5E2724, #23120B)",
                Synopsis = "In the slums of Barangay Masikap, young mambabarang Ella Arcangel protects her community from engkantos, aswang, and corrupt forces lurking in the shadows."
            },
            new Book
            {
                Id = 3,
                Slug = "mamasusan",
                Title = "Ang mga Kaibigan ni Mama Susan",
                Author = "Bob Ong",
                Publisher = "Visprint",
                Language = "Tagalog",
                Format = "Novel",
                Trope = "Horror",
                Rating = 4.9,
                Trending = 3,
                MarketType = "swap",
                Condition = "Pre-Loved (Like New)",
                Seller = "@pup_bibliophile",
                Image = "assets/book3.jpg",
                FallbackBg = "linear-gradient(145deg, #23120B, #76332F)",
                Synopsis = "Told through the diary entries of college student Galo, a routine trip back to his grandmother's provincial home spirals into creeping dread and occult ritual."
            },
            new Book
            {
                Id = 4,
                Slug = "ground",
                Title = "A View from the Ground",
                Author = "Atom Araullo",
                Publisher = "Anvil",
                Language = "English",
                Format = "Non-Fiction",
                Trope = "Non-Fiction",
                Rating = 4.8,
                Trending = 4,
                MarketType = "sale",
                Price = 425,
                Seller = "Anvil Publishing Official",
                Image = "assets/book4.jpg",
                FallbackBg = "linear-gradient(145deg, #4E5438, #23120B)",
                Synopsis = "A gripping collection of field dispatches, essays, and behind-the-scenes reflections from frontlines, disaster zones, and marginalized Filipino communities."
            },
            new Book
            {
                Id = 5,
                Slug = "trese",
                Title = "Trese Vol. 1: Murder on Balete Drive",
                Author = "Budjette Tan & Kajo Baldisimo",
                Publisher = "Visprint",
                Language = "English",
                Format = "Komiks",
                Trope = "Mythology",
                Rating = 4.9,
                Trending = 5,
                MarketType = "sale",
                Price = 350,
                Seller = "Avenida Books Official",
                Image = "",
                FallbackBg = "linear-gradient(145deg, #23120B, #5E2724)",
                Synopsis = "When the police are baffled by supernatural crimes in Manila, they call Alexandra Trese—a detective navigating deals with tikbalang, aswang, and elemental clans."
            }
        );

        modelBuilder.Entity<Review>().HasData(
            new Review { Id = 1, BookId = 1, Handle = "@sinta_reads", Rating = 5, Comment = "Lyrical, haunting, and impossible to put down." },
            new Review { Id = 2, BookId = 2, Handle = "@komiks_ph", Rating = 5, Comment = "Raw, socially grounded, and visually stunning Pinoy komiks." },
            new Review { Id = 3, BookId = 3, Handle = "@gabi_ng_lagim", Rating = 5, Comment = "The ending gave me chills for days. Peak Pinoy folk horror." }
        );
    }
}