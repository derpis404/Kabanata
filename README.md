# 📖 Kabanata — Read, Connect and Discover

**Kabanata** is a Filipino literary discovery, community, and book marketplace platform built to celebrate Philippine literature, independent komiks, and local reading communities.

---

## 📁 Project Structure

```text
Kabanata/
├── Frontend/
│   ├── index.html          # Unified single-page layout (Home & Explore/Shop views + Modals)
│   ├── style.css           # Cherry Velvet literary theme, vertical 2:3 cover grids, sticky sidebar & modals
│   ├── script.js           # Full-stack API sync, dual persistence, Open Library search, countdowns & reviews
│   └── assets/             # Book covers, author portraits, and banner assets
├── Kabanata/
│   ├── Kabanata.sln        # Visual Studio 2026 solution file
│   └── Kabanata.Api/       # Active ASP.NET Core Web API + SQLite backend
│       ├── Controllers/    # REST endpoints (/api/books, /api/shelf, /api/reviews)
│       ├── Data/           # EF Core DbContext and initial catalog seeding
│       ├── Models/         # Book, Review, and ShelfItem entities
│       ├── Properties/     # launchSettings.json (HTTPS port 7151)
│       ├── Program.cs      # CORS policy, SQLite configuration, and middleware pipeline
│       └── appsettings.json
├── BookProxyApi/           # Legacy prototype proxy (superseded by Kabanata/Kabanata.Api)
├── .gitignore              # Excludes local kabanata.db, bin/, obj/, and IDE build artifacts
└── README.md               # Project documentation, sprint progress & team roadmap
```

---

## ✅ What Has Been Done

### 1. Core Layout, Navigation & Full-Stack State
* **Single-Page Tab Navigation:** Smooth switching between the **Home** page and **Explore & Shop** catalog (`switchTab()`) without losing shelf/cart state.
* **Cherry Velvet Literary Theme:** Cohesive warm palette (`#F5E6D3` Cream, `#5E2724` Spiced Wine, `#23120B` Dark Chocolate, `#9A9B73` Olive Harvest) with responsive Flexbox and CSS Grid layouts.
* **Dual-Persistence TBR Shelf & Cart Drawer:** Persistent slide-out drawer tracking To-Be-Read (TBR) books and Shopping Cart items with a live header counter, automatic PHP subtotal calculation, real-time SQLite database synchronization (`Kabanata.Api`), and automatic `localStorage` fallback.
* **Toast Notification System:** Non-blocking status banners for TBR saves, cart additions, swap proposals, and review submissions.

### 2. Home Page (`#view-home`)
* **Hero Banner & Quick CTAs:** Full-width introduction with direct links to the catalog and trending titles.
* **Infinite Trending Marquee:** Seamlessly looping horizontal carousel (`renderTrendingMarquee()`) with local cover asset fallbacks.
* **Glide-In Hover Popovers:** Viewport-aware floating preview cards displaying publisher tags, ratings, summaries, reader snippets, and quick TBR/Buy actions.
* **3-Column Community & Editorial Spotlight:**
  * **Author of the Day (Lualhati Bautista):** Framed editorial portrait, metadata chips, *Dekada '70* quote card, direct Wikipedia biography link, catalog filter CTA (`exploreAuthorBooks()`), and unobstructed vertical `2:3` cover cards.
  * **Reading Communities:** Interactive preview threads for local book clubs and komik discussions.
  * **Upcoming Releases:** Vertical `2:3` cover showcase featuring Danton Remoto's *Landscapes of Feeling*, Julie Soto's *Vine of Hearts*, and Brandon Sanderson's *The Fires of December* with automated JavaScript day-countdown badges (`updateReleaseCountdowns()`).
* **Interactive Publisher Filter & Trivia Flashcard:** Filterable *Pinoy Lit Showcase* (`All`, `Anvil`, `Visprint`, `Komiket / Indie`) and a cycling *Did You Know?* Philippine literature trivia box.

### 3. Explore & Shop Catalog (`#view-explore`)
* **Live Book Search & Backend Proxy:** Integrated **Open Library API** search (`fetchBooksFromAPI()`) routed through `Kabanata.Api` alongside curated local Filipiniana titles.
* **Dynamic Popular Tag Pills:** Automatically extracts book categories from live search results and appends clickable topic pills alongside curated Filipiniana tags.
* **Sticky Filter Sidebar & Sorting:** Left-hand filter sidebar (`position: sticky`) for Marketplace Listing (`For Sale`, `Open for Swap`, `Library Archive`), Publishers, Language (`Tagalog`, `Taglish`, `English`), and Format (`Novel`, `Komiks`, `Non-Fiction`), plus sorting by Trending, Rating, Price, and Title.
* **Click-to-Open Book Detail Modal:**
  * **Interactive Cover Carousel:** Arrows and dot indicators to cycle through multiple cover/edition images and publisher cards.
  * **Formatted Multi-Paragraph Synopsis:** Preserves paragraph breaks and safe inline emphasis (`<b>`, `<i>`) from API blurbs, fetches full `/works/*.json` summaries for Open Library books, and displays *"No available synopsis."* when none exists.
  * **Persistent Reader Reviews:** Displays community comments and saves new star-rated reviews directly to SQLite (`POST /api/reviews`).

### 4. Backend API & Database (`Kabanata/Kabanata.Api`)
* **ASP.NET Core Web API + SQLite:** Scaffolded `Kabanata.Api` with Entity Framework Core (`kabanata.db`) and automatic database initialization on startup.
* **REST Endpoints & CORS:** Configured CORS for Live Server (`http://127.0.0.1:5500` / `http://localhost:5500`) and exposed endpoints for catalog retrieval (`GET /api/books`), Open Library search proxying (`GET /api/books/search`), TBR shelf toggling (`GET /api/shelf`, `POST /api/shelf/toggle`), and reader reviews (`POST /api/reviews`).

---

## 🔧 Known Issues & What Needs to Be Fixed / Built Next

### Bug Fixes & Immediate Polish
1. **Unify Search Results with Sidebar Filters:** Currently, typing in the search bar or clicking a tag renders live API books directly, while the left-hand checkboxes only filter the starter `booksData` array. Update `filterBooks()` so checkboxes filter *both* starter and searched books.
2. **Persist Shopping Cart Items in SQLite:** While the TBR Shelf and book reviews persist in `kabanata.db`, `cartList` currently relies on client-side state. Add a `CartItems` table and `/api/cart` endpoints so cart items survive across devices and sessions.
3. **Complete Remaining Starter Cover Assets:** Ensure every starter title in `booksData` has a dedicated high-resolution local cover image in `Frontend/assets/`.
4. **Clean Up Legacy `BookProxyApi` Folder:** Remove the superseded `BookProxyApi/` directory once all teammates have migrated to `Kabanata/Kabanata.Api`.

### Upcoming Frontend & Backend Features (Team Roadmap)
* **"Blind Date with a Book" Cards:** Mystery-wrapped listings showing trope clues, mood tags, condition, and price while hiding the cover/title until purchased.
* **"Looking For" (ISO) Wishlist Board:** A board in Explore & Shop backed by an `IsoRequests` SQLite table where readers can post and browse requests for hard-to-find Filipiniana titles.
* **Interactive Checkout & Swap Modals:** Replace the swap proposal toast and cart checkout placeholder with step-by-step modals (book trade selector + Campus Meet-up / Courier options) wired to an `Orders` endpoint.
* **Working Notification Dropdown & Navbar Views:** Turn the `🔔 3` bell icon into an interactive dropdown and build out the `Events`, `My Communities`, and `My Blog` pages.
* **"Load More" Pagination & Mobile Filter Drawer:** Fetch additional batches of API results (`page=2`, `3`, etc.) and collapse the filter sidebar into a toggleable drawer on mobile screens.

---

## 🚀 How to Run Locally

1. **Clone this repository:**
   ```bash
   git clone https://github.com/derpis404/Kabanata.git
   ```
2. **Start the ASP.NET Core Backend (`Kabanata.Api`):**
   * Open `Kabanata/Kabanata.sln` in **Visual Studio 2026**, select the **`https`** launch profile, and press **F5** (or run `dotnet run --launch-profile https` inside `Kabanata/Kabanata.Api`).
   * Confirm the API is listening on `https://localhost:7151` (Entity Framework Core will automatically create your local `kabanata.db` on first launch).
   * *(First-time HTTPS setup)* Visit `https://localhost:7151/api/books` in your browser once and accept the local development certificate if prompted.
3. **Start the Frontend (`Frontend/index.html`):**
   * Open the repository folder in **VS Code**.
   * Right-click `Frontend/index.html` and select **Open with Live Server** (or click **Go Live** in the bottom status bar) so it opens at `http://127.0.0.1:5500/Frontend/index.html`.