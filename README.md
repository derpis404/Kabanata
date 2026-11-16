# 📖 Kabanata — Read, Connect and Discover

**Kabanata** is a Filipino literary discovery, community, and book marketplace platform built to celebrate Philippine literature, independent komiks, and local reading communities.

---

## 📁 Project Structure

```text
Kabanata/
├── Frontend/
│   ├── index.html      # Unified single-page layout (Home & Explore/Shop views + Modals)
│   ├── style.css       # Cherry Velvet literary theme, responsive grids, sticky sidebar & modals
│   ├── script.js       # Catalog state, Google Books + Open Library APIs, carousel & reviews
│   └── assets/         # Cover art and banner assets
└── README.md           # Project documentation, sprint progress & team roadmap
```

---

## ✅ What Has Been Done

### 1. Core Layout, Navigation & State
* **Single-Page Tab Navigation:** Smooth switching between the **Home** page and **Explore & Shop** catalog (`switchTab()`) without losing shelf/cart state.
* **Cherry Velvet Literary Theme:** Cohesive warm palette (`#F5E6D3` Cream, `#5E2724` Spiced Wine, `#23120B` Dark Chocolate, `#9A9B73` Olive Harvest) with responsive Flexbox and CSS Grid layouts.
* **Slide-Out Shelf & Cart Drawer:** Persistent drawer tracking To-Be-Read (TBR) books and Shopping Cart items with a live header counter and automatic PHP subtotal calculation.
* **Toast Notification System:** Non-blocking status banners for TBR saves, cart additions, swap proposals, and review submissions.

### 2. Home Page (`#view-home`)
* **Hero Banner & Quick CTAs:** Full-width introduction with direct links to the catalog and trending titles.
* **Infinite Trending Marquee:** Seamlessly looping horizontal carousel (`renderTrendingMarquee()`) with local cover asset fallbacks.
* **Glide-In Hover Popovers:** Viewport-aware floating preview cards displaying publisher tags, ratings, summaries, reader snippets, and quick TBR/Buy actions.
* **3-Column Community & Author Spotlight:** Dedicated panels for *Author of the Day* (Lualhati Bautista), community discussion previews, and upcoming book releases.
* **Interactive Publisher Filter & Trivia Flashcard:** Filterable *Pinoy Lit Showcase* (`All`, `Anvil`, `Visprint`, `Komiket / Indie`) and a cycling *Did You Know?* Philippine literature trivia box.

### 3. Explore & Shop Catalog (`#view-explore`)
* **Dual-API Live Book Search:** Integrated **Google Books API** (`fetchBooksFromAPI()`) with an automatic **Open Library API** fallback (`fetchFromOpenLibraryFallback()`).
* **Dynamic Popular Tag Pills:** Automatically extracts book categories from live search results and appends clickable topic pills alongside curated Filipiniana tags.
* **Sticky Filter Sidebar & Sorting:** Left-hand filter sidebar (`position: sticky`) for Marketplace Listing (`For Sale`, `Open for Swap`, `Library Archive`), Publishers, Language (`Tagalog`, `Taglish`, `English`), and Format (`Novel`, `Komiks`, `Non-Fiction`), plus sorting by Trending, Rating, Price, and Title.
* **Click-to-Open Book Detail Modal:**
  * **Interactive Cover Carousel:** Arrows and dot indicators to cycle through multiple cover/edition images and publisher cards.
  * **Formatted Multi-Paragraph Synopsis:** Preserves paragraph breaks and safe inline emphasis (`<b>`, `<i>`) from API blurbs, fetches full `/works/*.json` summaries for Open Library books, and displays *"No available synopsis."* when none exists.
  * **Live Reader Reviews:** Displays community comments and lets users submit new star-rated reviews with custom handles.

---

## 🔧 Known Issues & What Needs to Be Fixed / Built Next

### Bug Fixes & Immediate Polish
1. **Unify Search Results with Sidebar Filters:** Currently, typing in the search bar or clicking a tag renders live API books directly, while the left-hand checkboxes only filter the starter `booksData` array. Update `filterBooks()` so checkboxes filter *both* starter and searched books.
2. **Persist User State (`localStorage`):** `tbrSet`, `cartList`, and newly posted book reviews reset when the browser is refreshed. Save them to `localStorage` until the backend database is connected.
3. **Complete Starter Cover Assets:** Add local cover images (`book5.jpg`–`book9.jpg`) for *Trese Vol. 1*, *Si Janus Sílang*, *Dekada '70*, *ABNKKBSNPLAko?!*, and *The Mythology Class* so every starter title has real cover art.
4. **Open Library Synopsis HTML Rendering:** Inside `openBookModal()` in `script.js`, replace `document.getElementById("modalBookSynopsis").textContent = book.synopsis;` inside the Open Library `.then()` callback with `renderSynopsisText(document.getElementById("modalBookSynopsis"), book.synopsis);` so fetched Open Library descriptions format paragraphs consistently.
5. **Protect the Google Books API Key:** Before publishing publicly (e.g., via GitHub Pages), restrict `GOOGLE_BOOKS_API_KEY` in Google Cloud Console to your live website domain—or move it to the ASP.NET Core backend proxy.

### Upcoming Frontend Features (Team Roadmap)
* **"Blind Date with a Book" Cards:** Mystery-wrapped listings showing trope clues, mood tags, condition, and price while hiding the cover/title until purchased.
* **"Looking For" (ISO) Wishlist Board:** A board in Explore & Shop where readers can post and browse requests for hard-to-find Filipiniana titles.
* **Interactive Checkout & Swap Modals:** Replace the swap proposal toast and cart checkout placeholder with step-by-step modals (book trade selector + Campus Meet-up / Courier options).
* **Working Notification Dropdown & Navbar Views:** Turn the `🔔 3` bell icon into an interactive dropdown and build out the `Events`, `My Communities`, and `My Blog` pages.
* **"Load More" Pagination & Mobile Filter Drawer:** Fetch additional batches of API results (`startIndex=12`, `24`, etc.) and collapse the filter sidebar into a toggleable drawer on mobile screens.

### Upcoming Backend Integration (ASP.NET Core Web API + SQLite)
* Scaffold `Kabanata.Api` with Entity Framework Core + SQLite (`users`, `books`, `listings`, `tbr_shelf`, `reviews`, `orders`, `order_items`, `iso_requests`).
* Expose REST endpoints (`GET /api/books`, `POST /api/reviews`, `POST /api/tbr/toggle`, `POST /api/orders`) and proxy Google Books searches through the C# server.

---

## 🚀 How to Run Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/derpis404/Kabanata.git
   ```
2. Open the project folder in **VS Code**.
3. Right-click `Frontend/index.html` and select **Open with Live Server** (or open directly in your browser).