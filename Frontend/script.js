const API_BASE_URL = "https://localhost:7151/api";
const ACTIVE_USER_HANDLE = "@kabanata_reader";

async function syncWithBackend() {
  try {
    // 1. Load books & persisted reviews from SQLite
    const booksRes = await fetch(`${API_BASE_URL}/books`);
    if (booksRes.ok) {
      const dbBooks = await booksRes.json();
      dbBooks.forEach(dbBook => {
        const formattedReviews = (dbBook.reviews || []).map(r => {
          const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
          return `"${r.comment}" — ${r.handle} (${stars})`;
        });

        const existing = booksData.find(b => b.id === dbBook.slug);
        if (existing) {
          if (formattedReviews.length > 0) existing.reviews = formattedReviews;
        } else {
          booksData.push({
            id: dbBook.slug,
            title: dbBook.title,
            author: dbBook.author,
            publisher: dbBook.publisher,
            language: dbBook.language,
            format: dbBook.format,
            trope: dbBook.trope,
            rating: dbBook.rating,
            trending: dbBook.trending,
            marketType: dbBook.marketType,
            price: dbBook.price,
            condition: dbBook.condition,
            seller: dbBook.seller,
            image: dbBook.image,
            fallbackBg: dbBook.fallbackBg,
            synopsis: dbBook.synopsis,
            reviews: formattedReviews
          });
        }
      });
    }

    // 2. Load saved TBR shelf items from SQLite
    const shelfRes = await fetch(`${API_BASE_URL}/shelf?handle=${encodeURIComponent(ACTIVE_USER_HANDLE)}`);
    if (shelfRes.ok) {
      const shelfItems = await shelfRes.json();
      tbrSet = new Set(shelfItems.map(item => item.book?.slug).filter(Boolean));
    }

    renderTrendingMarquee();
    filterBooks();
    updateShelfCounter();
  } catch {
    console.warn("Backend offline — running with local starter data.");
  }
}


/* ==================== BOOK DATABASE (WITH YOUR ASSETS + CATALOG) ==================== */
const booksData = [
  {
    id: "gasp",
    title: "The End Comes Without a Gasp",
    author: "Trish Shishikura",
    publisher: "Penguin SEA",
    language: "English",
    format: "Novel",
    trope: "Campus Life",
    rating: 4.8,
    trending: 1,
    marketType: "sale",
    price: 495,
    seller: "Fully Booked Official",
    image: "assets/book1.jpg",
    fallbackBg: "linear-gradient(145deg, #2C3E50, #5E2724)",
    synopsis: "An atmospheric contemporary novel tracing memory, quiet heartbreak, and the unspoken distance between people navigating life in Manila and beyond.",
    reviews: [
      '"Lyrical, haunting, and impossible to put down." — @sinta_reads',
      '"One of the strongest Filipino debut voices in recent memory." — @manila_lit'
    ]
  },
  {
    id: "ella",
    title: "Ella Arcangel: Lupa at Dugo",
    author: "Julius Villanueva",
    publisher: "Komiket",
    language: "Tagalog",
    format: "Komiks",
    trope: "Mythology",
    rating: 4.9,
    trending: 2,
    marketType: "sale",
    price: 380,
    seller: "Komiket Store",
    image: "assets/book2.png",
    fallbackBg: "linear-gradient(145deg, #5E2724, #23120B)",
    synopsis: "In the slums of Barangay Masikap, young mambabarang Ella Arcangel protects her community from engkantos, aswang, and corrupt forces lurking in the shadows.",
    reviews: [
      '"Raw, socially grounded, and visually stunning Pinoy komiks." — @komiks_ph',
      '"Ella is an unforgettable heroine!" — @juan_reads'
    ]
  },
  {
    id: "mamasusan",
    title: "Ang mga Kaibigan ni Mama Susan",
    author: "Bob Ong",
    publisher: "Visprint",
    language: "Tagalog",
    format: "Novel",
    trope: "Horror",
    rating: 4.9,
    trending: 3,
    marketType: "swap",
    condition: "Pre-Loved (Like New)",
    seller: "@pup_bibliophile",
    image: "assets/book3.jpg",
    fallbackBg: "linear-gradient(145deg, #23120B, #76332F)",
    synopsis: "Told through the diary entries of college student Galo, a routine trip back to his grandmother's provincial home spirals into creeping dread and occult ritual.",
    reviews: [
      '"The ending gave me chills for days. Peak Pinoy folk horror." — @gabi_ng_lagim',
      '"Classic Bob Ong humor slowly turning into pure terror." — @bookworm_mnl'
    ]
  },
  {
    id: "ground",
    title: "A View from the Ground",
    author: "Atom Araullo",
    publisher: "Anvil",
    language: "English",
    format: "Non-Fiction",
    trope: "Non-Fiction",
    rating: 4.8,
    trending: 4,
    marketType: "sale",
    price: 425,
    seller: "Anvil Publishing Official",
    image: "assets/book4.jpg",
    fallbackBg: "linear-gradient(145deg, #4E5438, #23120B)",
    synopsis: "A gripping collection of field dispatches, essays, and behind-the-scenes reflections from frontlines, disaster zones, and marginalized Filipino communities.",
    reviews: [
      '"Compassion and journalism woven together seamlessly." — @journ_student',
      '"Essential reading to understand contemporary Philippine realities." — @kabanata_club'
    ]
  },
  {
    id: "trese",
    title: "Trese Vol. 1: Murder on Balete Drive",
    author: "Budjette Tan & Kajo Baldisimo",
    publisher: "Visprint",
    language: "English",
    format: "Komiks",
    trope: "Mythology",
    rating: 4.9,
    trending: 5,
    marketType: "sale",
    price: 350,
    seller: "Avenida Books Official",
    image: "assets/book5.jpg",
    fallbackBg: "linear-gradient(145deg, #23120B, #5E2724)",
    synopsis: "When the police are baffled by supernatural crimes in Manila, they call Alexandra Trese—a detective navigating deals with tikbalang, aswang, and elemental clans.",
    reviews: [
      '"The gold standard of modern Philippine urban fantasy." — @balete_watch',
      '"Every case feels steeped in authentic Manila street lore." — @trese_fan'
    ]
  },
  {
    id: "janus",
    title: "Si Janus Sílang at ang Tiyanak ng Tábon",
    author: "Edgar Calabia Samar",
    publisher: "Adarna",
    language: "Tagalog",
    format: "Novel",
    trope: "Mythology",
    rating: 4.8,
    trending: 6,
    marketType: "swap",
    condition: "Pre-Loved",
    seller: "@sitio_badua",
    image: "assets/book6.jpg",
    fallbackBg: "linear-gradient(145deg, #8C583A, #23120B)",
    synopsis: "After every other player in an online RPG tournament dies mysteriously, teenager Janus discovers that ancient Philippine mythological beings are hunting him in the real world.",
    reviews: [
      '"A masterclass in blending gaming culture with Pinoy folklore!" — @cs_reader',
      '"Couldn\'t stop turning the pages until 3 AM." — @tala_reads'
    ]
  },
  {
    id: "dekada",
    title: "Dekada '70",
    author: "Lualhati Bautista",
    publisher: "Anvil",
    language: "Tagalog",
    format: "Novel",
    trope: "Historical",
    rating: 4.9,
    trending: 7,
    marketType: "library",
    seller: "Community Archive",
    image: "assets/book7.jpg",
    fallbackBg: "linear-gradient(145deg, #76332F, #23120B)",
    synopsis: "Amanda Bartolome navigates motherhood, marriage, and political awakening as her five sons come of age during the turbulent Martial Law years in the Philippines.",
    reviews: [
      '"Timeless, courageous, and deeply moving." — @history_ph',
      '"Every Filipino student should read this at least once." — @lit_major'
    ]
  },
  {
    id: "abnkkbsnplako",
    title: "ABNKKBSNPLAko?!",
    author: "Bob Ong",
    publisher: "Visprint",
    language: "Taglish",
    format: "Novel",
    trope: "Campus Life",
    rating: 4.7,
    trending: 8,
    marketType: "sale",
    price: 295,
    seller: "Visprint Archive Partner",
    image: "assets/book8.jpg",
    fallbackBg: "linear-gradient(145deg, #8C583A, #5E2724)",
    synopsis: "A hilarious and nostalgic look back at Filipino public school life—from terror teachers and cafeteria chaos to college survival.",
    reviews: [
      '"Pure nostalgia from elementary to college days." — @iskolar_reads',
      '"Still makes me laugh out loud on every reread." — @pinoy_humor'
    ]
  },
  {
    id: "mythologyclass",
    title: "The Mythology Class",
    author: "Arnold Arre",
    publisher: "Adarna",
    language: "English",
    format: "Komiks",
    trope: "Mythology",
    rating: 4.9,
    trending: 9,
    marketType: "swap",
    condition: "Collector's Paperback",
    seller: "@upd_komiks",
    image: "assets/book9.jpg",
    fallbackBg: "linear-gradient(145deg, #4E5438, #342113)",
    synopsis: "UP Diliman student Nicole Lacson answers a mysterious summons and teams up with fellow students to capture escaped engkantos roaming Metro Manila.",
    reviews: [
      '"A landmark graphic novel that inspired a generation of creators." — @komiket_fan',
      '"Warm, adventurous, and proudly Filipino." — @diliman_reader'
    ]
  }
];

/* Extra author spotlight mini-works for hover popover support */
const extraSpotlightBooks = {
  bata: {
    id: "bata",
    title: "Bata, Bata... Pa'no Ka Ginawa?",
    author: "Lualhati Bautista",
    publisher: "Anvil",
    language: "Tagalog",
    format: "Novel",
    rating: 4.9,
    marketType: "library",
    synopsis: "Lea Bustamante balances single motherhood, career, and activism while challenging traditional expectations placed on Filipino women.",
    reviews: ['"A feminist classic in Philippine literature." — @lit_ph']
  },
  gapo: {
    id: "gapo",
    title: "GAPÔ",
    author: "Lualhati Bautista",
    publisher: "Anvil",
    language: "Tagalog",
    format: "Novel",
    rating: 4.8,
    marketType: "library",
    synopsis: "Set in Olongapo near the former US naval base, Michael Taylor Jr. confronts identity, colonial legacy, and dignity.",
    reviews: ['"Sharp, poignant, and unforgettable." — @pinoy_classics']
  },
  desaparesidos: {
    id: "desaparesidos",
    title: "Desaparesidos",
    author: "Lualhati Bautista",
    publisher: "Anvil",
    language: "Tagalog",
    format: "Novel",
    rating: 4.9,
    marketType: "library",
    synopsis: "A gripping story of activists searching for their missing loved ones and reckoning with the personal cost of resistance.",
    reviews: ['"Heart-wrenching and masterfully written." — @manila_reads']
  }
};

/* ==================== STATE (TBR & CART) ==================== */

// Retrieve previously saved data from localStorage
function loadStoredData(key, fallback) {
  try {
    const savedData = localStorage.getItem(key);
    return savedData !== null ? JSON.parse(savedData) : fallback;
  } catch (error) {
    console.warn(`Could not load ${key}:`, error);
    return fallback;
  }
}

// Save data to localStorage
function saveStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Could not save ${key}:`, error);
  }
}


// Restore TBR shelf and cart, or use defaults for first-time visitors
const savedTBR = loadStoredData("kabanata_tbr", ["ella", "mamasusan"]);

const savedCart = loadStoredData("kabanata_cart", [
  { id: "gasp", title: "The End Comes Without a Gasp", price: 495 }
]);

let tbrSet = new Set(
  Array.isArray(savedTBR) ? savedTBR : ["ella", "mamasusan"]
);

let cartList = Array.isArray(savedCart) ? savedCart : [
  { id: "gasp", title: "The End Comes Without a Gasp", price: 495 }
];

// Restore previously posted book reviews
const storedReviews = loadStoredData("kabanata_reviews", {});

let savedBookReviews =
  storedReviews && typeof storedReviews === "object" && !Array.isArray(storedReviews)
    ? storedReviews
    : {};

// Apply saved reviews to a book when it becomes available
function applySavedReviews(book) {
  if (Array.isArray(savedBookReviews[book.id])) {
    book.reviews = [...savedBookReviews[book.id]];
  }
}

// Restore reviews for existing books
booksData.forEach(applySavedReviews);
Object.values(extraSpotlightBooks).forEach(applySavedReviews);

let currentPopoverBookId = null;
let hidePopoverTimer = null;

function updateShelfCounter() {
  const total = tbrSet.size + cartList.length;
  document.getElementById("shelfCount").textContent = total;
}
/* ==================== TAB SWITCHING ==================== */
function switchTab(tab) {
  const homeView = document.getElementById("view-home");
  const exploreView = document.getElementById("view-explore");
  const navHome = document.getElementById("nav-home");
  const navExplore = document.getElementById("nav-explore");

  forceHidePopover();

  if (tab === "explore") {
    homeView.classList.add("hidden");
    exploreView.classList.remove("hidden");
    navHome.classList.remove("active");
    navExplore.classList.add("active");
    filterBooks();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    exploreView.classList.add("hidden");
    homeView.classList.remove("hidden");
    navExplore.classList.remove("active");
    navHome.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* ==================== RENDER TRENDING INFINITE MARQUEE ==================== */
function renderTrendingMarquee() {
  const track = document.getElementById("trendingTrack");
  const trendingBooks = booksData.slice(0, 6);

  const buildGroupHTML = (isDuplicate) => {
    return `<ul class="group" ${isDuplicate ? 'aria-hidden="true"' : ''}>` +
      trendingBooks.map(b => `
        <li class="card-item">
          <a href="#" class="card-link" ${isDuplicate ? 'tabindex="-1"' : ''}
             onmouseenter="showBookPopover(event, '${b.id}')"
             onmouseleave="scheduleHidePopover()"
             onclick="openBookModal('${b.id}'); return false;">
            <div class="cover-frame" style="background: ${b.fallbackBg};">
              ${b.image ? `<img src="${b.image}" alt="${b.title} book cover" class="card-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
              <div class="cover-fallback" style="display: ${b.image ? 'none' : 'flex'};">
                <span class="fallback-pub">${b.publisher}</span>
                <span class="fallback-title">${b.title}</span>
              </div>
            </div>
            <p class="book-title">"${b.title}"</p>
            <p class="book-author">${b.author}</p>
          </a>
        </li>
      `).join('') +
    `</ul>`;
  };

  track.innerHTML = buildGroupHTML(false) + buildGroupHTML(true);
}

/* ==================== GLIDE-IN BOOK POPOVER LOGIC ==================== */
function getBookById(id) {
  return booksData.find(b => b.id === id) ||
         searchedBooks.find(b => b.id === id) ||
         extraSpotlightBooks[id];
}

function formatBookSynopsisHTML(rawText) {
  if (!rawText || rawText === "No available synopsis.") {
    return "No available synopsis.";
  }

  // Decode HTML entities if double-encoded by the API
  const decoder = document.createElement("textarea");
  decoder.innerHTML = rawText;
  let cleaned = decoder.value;

  // Convert block tags and double newlines into paragraph boundaries
  cleaned = cleaned
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?p[^>]*>/gi, "\n\n");

  // Strip all HTML tags except safe inline emphasis (<b>, <strong>, <i>, <em>)
  cleaned = cleaned.replace(/<(?!\/?(?:b|strong|i|em)\b)[^>]+>/gi, "");

  // Split into clean paragraphs
  const paragraphs = cleaned
    .split(/\n{2,}/)
    .map(p => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return "No available synopsis.";

  return paragraphs.map(p => `<p>${p}</p>`).join("");
}

function renderSynopsisText(element, text) {
  const isMissing = !text || text === "No available synopsis.";
  element.classList.toggle("empty-synopsis", isMissing);

  if (isMissing) {
    element.textContent = "No available synopsis.";
    return;
  }

  if (element.id === "modalBookSynopsis") {
    element.innerHTML = formatBookSynopsisHTML(text);
  } else {
    // Keep hover popover compact as plain text
    const temp = document.createElement("div");
    temp.innerHTML = formatBookSynopsisHTML(text);
    element.textContent = temp.textContent.replace(/\s+/g, " ").trim();
  }
}

function showBookPopover(event, bookId) {
  cancelHidePopover();
  const book = getBookById(bookId);
  if (!book) return;

  currentPopoverBookId = bookId;
  const popover = document.getElementById("book-hover-popover");

  document.getElementById("popTags").innerHTML = `
    <span class="pop-tag">${book.publisher}</span>
    <span class="pop-tag format">${book.format}</span>
  `;
  document.getElementById("popLang").textContent = book.language;
  document.getElementById("popTitle").textContent = book.title;
  document.getElementById("popAuthor").textContent = `by ${book.author}`;
  document.getElementById("popRating").textContent = `★★★★★ (${book.rating})`;
  renderSynopsisText(document.getElementById("popSynopsis"), book.synopsis);
  document.getElementById("popReviews").innerHTML = book.reviews.map(r => `<div class="pop-review-item">${r}</div>`).join('');

  const tbrBtn = document.getElementById("popTbrBtn");
  if (tbrSet.has(book.id)) {
    tbrBtn.textContent = "✓ Saved on TBR Shelf";
    tbrBtn.classList.add("added");
  } else {
    tbrBtn.textContent = "+ Add to TBR Shelf";
    tbrBtn.classList.remove("added");
  }

  const shopBtn = document.getElementById("popShopBtn");
  if (book.marketType === "sale") {
    shopBtn.textContent = `Buy ₱${book.price}`;
    shopBtn.style.display = "inline-block";
  } else if (book.marketType === "swap") {
    shopBtn.textContent = "Propose Swap";
    shopBtn.style.display = "inline-block";
  } else {
    shopBtn.style.display = "none";
  }

  // Smart positioning near hovered element
  const targetRect = event.currentTarget.getBoundingClientRect();
  popover.classList.add("visible");

  const popWidth = 320;
  const popHeight = popover.offsetHeight || 340;
  const margin = 14;

  let left = targetRect.right + margin;
  if (left + popWidth > window.innerWidth - margin) {
    left = targetRect.left - popWidth - margin;
  }
  if (left < margin) {
    left = Math.max(margin, Math.min(window.innerWidth - popWidth - margin, targetRect.left));
  }

  let top = targetRect.top;
  if (top + popHeight > window.innerHeight - margin) {
    top = window.innerHeight - popHeight - margin;
  }
  if (top < 76) top = 76;

  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
}

function scheduleHidePopover() {
  hidePopoverTimer = setTimeout(() => {
    forceHidePopover();
  }, 220);
}

function cancelHidePopover() {
  if (hidePopoverTimer) {
    clearTimeout(hidePopoverTimer);
    hidePopoverTimer = null;
  }
}

function forceHidePopover() {
  const popover = document.getElementById("book-hover-popover");
  popover.classList.remove("visible");
}

function toggleCurrentPopoverTBR() {
  if (!currentPopoverBookId) return;
  toggleTBR(currentPopoverBookId);
  const tbrBtn = document.getElementById("popTbrBtn");
  if (tbrSet.has(currentPopoverBookId)) {
    tbrBtn.textContent = "✓ Saved on TBR Shelf";
    tbrBtn.classList.add("added");
  } else {
    tbrBtn.textContent = "+ Add to TBR Shelf";
    tbrBtn.classList.remove("added");
  }
}

function handlePopoverShopAction() {
  if (!currentPopoverBookId) return;
  const book = getBookById(currentPopoverBookId);
  if (!book) return;
  if (book.marketType === "sale") {
    addToCart(book.id);
  } else if (book.marketType === "swap") {
    showToast(`Swap request draft opened for "${book.title}"!`);
  }
}

/* ==================== TBR & CART ACTIONS ==================== */
async function toggleTBR(bookId) {
  const book = getBookById(bookId);
  if (!book) return;

  if (tbrSet.has(bookId)) {
    tbrSet.delete(bookId);
    showToast(`Removed "${book.title}" from TBR Shelf`);
  } else {
    tbrSet.add(bookId);
    showToast(`Added "${book.title}" to your TBR Shelf!`);
  }

  // Save the updated TBR shelf
  saveStoredData("kabanata_tbr", [...tbrSet]);

  updateShelfCounter();
  filterBooks();

  // Persist to SQLite backend
  try {
    await fetch(`${API_BASE_URL}/shelf/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userHandle: ACTIVE_USER_HANDLE,
        bookSlug: book.id,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        image: book.image || ""
      })
    });
  } catch {
    console.warn("TBR saved locally only (backend offline).");
  }
}

function addToCart(bookId) {
  const book = getBookById(bookId);
  if (!book) return;

  if (!cartList.some(item => item.id === bookId)) {
    cartList.push({ id: book.id, title: book.title, price: book.price });
    showToast(`Added "${book.title}" (₱${book.price}) to Cart!`);
  } else {
    showToast(`"${book.title}" is already in your Cart.`);
  }

  // Save the updated cart
  saveStoredData("kabanata_cart", cartList);

  updateShelfCounter();
}

function openShelfDrawer() {
  const body = document.getElementById("shelfDrawerBody");
  const tbrBooks = Array.from(tbrSet).map(id => getBookById(id)).filter(Boolean);
  const cartTotal = cartList.reduce((sum, item) => sum + item.price, 0);

  body.innerHTML = `
    <h3 style="font-size: 1rem; color: var(--spiced-wine); margin-bottom: 0.65rem;">🛒 Shopping Cart (${cartList.length})</h3>
    ${cartList.length === 0 ? '<p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem;">No items in cart yet.</p>' : `
      <div style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1rem;">
        ${cartList.map(item => `
          <div class="drawer-item">
            <div>
              <div style="font-weight:700; font-size:0.88rem;">${item.title}</div>
              <div style="font-size:0.8rem; color:var(--spiced-wine);">₱${item.price}.00</div>
            </div>
            <button class="mini-remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
          </div>
        `).join('')}
      </div>
      <div style="font-weight:700; font-size:0.95rem; margin-bottom:1.5rem; text-align:right;">Total: ₱${cartTotal}.00</div>
    `}

    <h3 style="font-size: 1rem; color: var(--spiced-wine); margin-bottom: 0.65rem; border-top: 1px solid var(--border-soft); padding-top: 1rem;">🔖 To-Be-Read (TBR) Shelf (${tbrBooks.length})</h3>
    ${tbrBooks.length === 0 ? '<p style="font-size:0.85rem; color:var(--text-muted);">Your TBR shelf is empty.</p>' : `
      <div style="display:flex; flex-direction:column; gap:0.6rem;">
        ${tbrBooks.map(b => `
          <div class="drawer-item">
            <div>
              <div style="font-weight:700; font-size:0.88rem;">${b.title}</div>
              <div style="font-size:0.78rem; color:var(--text-muted);">by ${b.author}</div>
            </div>
            <button class="mini-remove-btn" onclick="toggleTBR('${b.id}'); openShelfDrawer();">Remove</button>
          </div>
        `).join('')}
      </div>
    `}
  `;

  document.getElementById("shelfOverlay").classList.add("active");
}

function removeFromCart(id) {
  cartList = cartList.filter(i => i.id !== id);

  // Save the updated cart
  saveStoredData("kabanata_cart", cartList);

  updateShelfCounter();
  openShelfDrawer();
}

function closeShelfDrawer(e) {
  if (e.target.id === "shelfOverlay") forceCloseShelfDrawer();
}

function forceCloseShelfDrawer() {
  document.getElementById("shelfOverlay").classList.remove("active");
}

/* ==================== EXPLORE & SHOP FILTERING ==================== */
let activeQuickTag = "All";
let searchedBooks = [];
let exploreSearchTimer;

/* ==================== POPULAR TAGS + LIVE API FETCH ==================== */
const tagSearchQueries = {
  "Mythology": "Philippine mythology folklore",
  "Horror": "Philippine horror ghost stories",
  "Komiks": "Filipino comics graphic novel",
  "Non-Fiction": "Philippines history essays journalism",
  "Historical": "Philippine historical fiction",
  "Romance": "Filipino romance contemporary novel",
  "Poetry": "Philippine poetry anthology"
};

async function setQuickTag(tag, btn) {
  activeQuickTag = tag;
  document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
  if (btn) btn.classList.add("active");

  if (tag === "All") {
    document.getElementById("searchInput").value = "";
    filterBooks();
    return;
  }

  // Use a tailored search query if mapped, otherwise search the tag name directly
  const apiQuery = tagSearchQueries[tag] || `${tag} Philippines`;
  await fetchBooksFromAPI(apiQuery);
}

function getCheckedValues(selector) {
  return Array.from(document.querySelectorAll(selector + ":checked")).map(cb => cb.value);
}

function handleExploreSearch(searchNow = false) {
  const input = document.getElementById("searchInput");
  const query = input.value.trim();

  activeQuickTag = "All";
  document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
  document.querySelector('.pill[onclick*="All"]')?.classList.add("active");


  clearTimeout(exploreSearchTimer);

  if (!query) {
    searchedBooks = [];
    filterBooks();
    return;
  }

  filterBooks();

  if (searchNow) {
    fetchBooksFromAPI(query);
    return;
  }

  exploreSearchTimer = setTimeout(() => {
    fetchBooksFromAPI(query);
  }, 500);
}

function filterBooks() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const markets = getCheckedValues(".market-filter");
  const pubs = getCheckedValues(".pub-filter");
  const langs = getCheckedValues(".lang-filter");
  const fmts = getCheckedValues(".fmt-filter");
  const sort = document.getElementById("sortSelect").value;

  let filtered = [...booksData, ...searchedBooks].filter(b => {const matchesQuery =
  String(b.title || "").toLowerCase().includes(query) ||
  String(b.author || "").toLowerCase().includes(query) ||
  String(b.publisher || "").toLowerCase().includes(query) ||
  String(b.trope || "").toLowerCase().includes(query);
    
    const matchesMarket = markets.length === 0 || markets.includes(b.marketType);
    const matchesPub = pubs.length === 0 || pubs.includes(b.publisher);
    const matchesLang = langs.length === 0 || langs.includes(b.language);
    const matchesFmt = fmts.length === 0 || fmts.includes(b.format);
    const matchesTag =
      activeQuickTag === "All" ||
      b.trope === activeQuickTag ||
      b.format === activeQuickTag ||
      b.matchedQuickTag === activeQuickTag;
    return matchesQuery && matchesMarket && matchesPub && matchesLang && matchesFmt && matchesTag;
  });

  if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === "title") filtered.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === "price-low") filtered.sort((a, b) => (a.price || 9999) - (b.price || 9999));
  else filtered.sort((a, b) => a.trending - b.trending);

  renderExploreGrid(filtered);
}

function renderExploreGrid(list) {
  const grid = document.getElementById("bookGrid");
  document.getElementById("bookCount").textContent = `Showing ${list.length} book${list.length === 1 ? "" : "s"}`;

  grid.innerHTML = list.map(b => {
    const isAdded = tbrSet.has(b.id);
    let marketBadge = "";
    let priceLine = "";
    let primaryBtn = "";

    if (b.marketType === "sale") {
      marketBadge = `<span class="market-badge sale">For Sale</span>`;
      priceLine = `<div class="price-tag">₱ ${b.price}.00</div>`;
      primaryBtn = `<button class="shop-action-btn" onclick="addToCart('${b.id}')">Add to Cart</button>`;
    } else if (b.marketType === "swap") {
      marketBadge = `<span class="market-badge swap">Open for Swap</span>`;
      priceLine = `<div class="swap-tag">🔄 ${b.condition}</div>`;
      primaryBtn = `<button class="shop-action-btn swap" onclick="showToast('Swap proposal sent to ${b.seller}!')">Propose Swap</button>`;
    } else {
      marketBadge = `<span class="market-badge library">Library Archive</span>`;
      priceLine = `<div class="library-tag">Digital TBR Tracking</div>`;
    }

    return `
      <article class="book-card" onclick="openBookModal('${b.id}')" onmouseenter="showBookPopover(event, '${b.id}')" onmouseleave="scheduleHidePopover()">
        <div class="book-cover" style="background: ${b.fallbackBg}">
          <div class="cover-top-row">
            <span class="cover-tag">${b.publisher}</span>
            ${marketBadge}
          </div>
          ${b.image ? `<img src="${b.image}" alt="${b.title}" class="grid-cover-img" onerror="this.style.display='none'">` : ''}
          <div class="cover-title-art">${b.title}</div>
          <span style="font-size:0.75rem; opacity:0.88; position:relative; z-index:2;">${b.author}</span>
        </div>
        ${priceLine}
        <div class="stars">★★★★★ <span style="color:var(--text-muted); font-size:0.78rem;">(${b.rating})</span></div>
        <div class="book-title">${b.title}</div>
        <div class="book-author">by ${b.author}</div>
        <div class="book-meta">
          <span class="meta-chip">${b.language}</span>
          <span class="meta-chip">${b.format}</span>
        </div>
        <div class="card-btn-row" onclick="event.stopPropagation()">
          ${primaryBtn}
          <button class="tbr-btn ${isAdded ? 'added' : ''}" onclick="toggleTBR('${b.id}')">
            ${isAdded ? '✓ On TBR' : '+ TBR'}
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function resetFilters() {
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.getElementById("searchInput").value = "";
  activeQuickTag = "All";
  document.querySelectorAll(".pill").forEach((p, idx) => p.classList.toggle("active", idx === 0));
  filterBooks();
}

/* ==================== SHOWCASE CAROUSEL & TRIVIA ==================== */
/* ==================== SHOWCASE CAROUSEL & TRIVIA ==================== */
function filterShowcase(pub, btn) {
  document.querySelectorAll(".pub-pill").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  // Use all 9 starter Pinoy Lit entries instead of just the first 4
  const showcasePool = booksData.slice(0, 9);
  const list = pub === "All"
    ? showcasePool
    : showcasePool.filter(i => i.publisher.toLowerCase().includes(pub.toLowerCase()));

  const row = document.getElementById("showcaseRow");
  row.scrollLeft = 0;

  row.innerHTML = list.map(i => `
    <div class="showcase-card"
         onclick="openBookModal('${i.id}')"
         onmouseenter="showBookPopover(event, '${i.id}')"
         onmouseleave="scheduleHidePopover()">
      <div class="showcase-cover" style="background: ${i.fallbackBg}">
        ${i.image ? `<img src="${i.image}" alt="${i.title}" class="showcase-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
        <div class="cover-fallback" style="position:relative; z-index:2; display:${i.image ? 'none' : 'flex'}; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:0.75rem; text-align:center;">
          <span class="fallback-pub">${i.publisher}</span>
          <span class="fallback-title">${i.title}</span>
        </div>
      </div>
      <div style="font-weight:700; font-size:0.85rem; margin-top:0.5rem;">${i.title}</div>
      <div style="font-size:0.75rem; color:var(--text-muted);">${i.publisher}</div>
    </div>
  `).join("");

  updateShowcaseArrows();
}

function scrollShowcase(direction) {
  const row = document.getElementById("showcaseRow");
  if (!row) return;
  const scrollAmount = row.clientWidth * 0.85;
  row.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  setTimeout(updateShowcaseArrows, 350);
}

function updateShowcaseArrows() {
  const row = document.getElementById("showcaseRow");
  const prevBtn = document.getElementById("showcasePrevBtn");
  const nextBtn = document.getElementById("showcaseNextBtn");
  if (!row || !prevBtn || !nextBtn) return;

  const canScroll = row.scrollWidth > row.clientWidth + 8;
  prevBtn.classList.toggle("hidden", !canScroll || row.scrollLeft <= 5);
  nextBtn.classList.toggle("hidden", !canScroll || row.scrollLeft + row.clientWidth >= row.scrollWidth - 5);
}

document.addEventListener("DOMContentLoaded", () => {
  const showcaseRow = document.getElementById("showcaseRow");
  if (showcaseRow) {
    showcaseRow.addEventListener("scroll", updateShowcaseArrows);
  }
});

const triviaFacts = [
  "Jose Rizal's original manuscript of Noli Me Tangere was printed in Berlin in 1887 with financial help from Dr. Maximo Viola.",
  "Doctrina Christiana (1593) was the earliest printed book in the Philippines, written in Spanish and Tagalog (both Latin script and Baybayin).",
  "Filipino Komiks pioneer Tony Velasquez created 'Kenkoy' in 1929, earning him the title Father of Tagalog Komiks.",
  "Budjette Tan and Kajo Baldisimo's 'Trese' started as an indie photocopied komik before becoming an international animated series!"
];
let triviaIdx = 0;

function nextHomeTrivia() {
  triviaIdx = (triviaIdx + 1) % triviaFacts.length;
  document.getElementById("homeTriviaText").textContent = triviaFacts[triviaIdx];
}


function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ==================== LIVE BOOK API FETCHER (ASP.NET CORE PROXY -> OPEN LIBRARY) ==================== */
const fallbackGradients = [
  "linear-gradient(145deg, #2C3E50, #5E2724)",
  "linear-gradient(145deg, #5E2724, #23120B)",
  "linear-gradient(145deg, #4E5438, #23120B)",
  "linear-gradient(145deg, #8C583A, #23120B)"
];



function mapOpenLibraryDocs(docs) {
  return (docs || []).map((doc, index) => {
    const cleanId = (doc.key || `book_${index}`).replace("/works/", "ol_");
    const mappedLang = doc.language?.[0] === "tgl" ? "Tagalog" : "English";
    const marketModes = ["sale", "swap", "library"];
    const marketType = marketModes[index % 3];

    const coverUrl = doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : "";

    const parsedRating = doc.ratings_average
      ? Number(Number(doc.ratings_average).toFixed(1))
      : 4.7;

    return {
      id: cleanId,
      workKey: doc.key,
      title: doc.title || "Untitled Work",
      author: Array.isArray(doc.author_name) && doc.author_name.length > 0
        ? doc.author_name.slice(0, 2).join(", ")
        : "Unknown Author",
      publisher: Array.isArray(doc.publisher) && doc.publisher.length > 0
        ? doc.publisher[0]
        : "Indie Press",
      language: mappedLang,
      format: "Novel",
      trope: "All",
      matchedQuickTag: activeQuickTag === "All" ? "" : activeQuickTag,
      rating: parsedRating,
      trending: booksData.length + index + 1,
      marketType: marketType,
      price: marketType === "sale" ? 350 + (index * 35) : undefined,
      condition: marketType === "swap" ? "Pre-Loved (Good)" : undefined,
      seller: marketType === "sale" ? "Partner Bookstore" : "@kabanata_reader",
      gallery: coverUrl ? [coverUrl] : [],
      image: coverUrl,
      fallbackBg: fallbackGradients[index % fallbackGradients.length],
      synopsis: "Loading full synopsis...",
      reviews: [
        doc.ratings_average
          ? `"Rated ${parsedRating}/5 by readers on Open Library."`
          : '"Verified edition via Kabanata Global Catalog." — @kabanata_reads'
      ]
    };
  });
}


async function fetchBooksFromAPI(searchTerm) {
  try {
    const url = `${API_BASE_URL}/books/search?q=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Backend request failed");
    }

    const data = await response.json();
    const apiBooks = mapOpenLibraryDocs(data.docs || []);

    apiBooks.forEach(applySavedReviews);

    searchedBooks = apiBooks;

    appendDynamicTags(data.docs || []);
    filterBooks();

  } catch (error) {
    console.error("Backend API error:", error);
    await fetchFromOpenLibraryFallback(searchTerm);
  }
}


function appendDynamicTags(docs) {
  const pillContainer = document.querySelector(".quick-pills");
  if (!pillContainer) return;

  const discoveredSubjects = new Set();
  docs.forEach(doc => {
    const subjects = doc.subject || [];
    subjects.slice(0, 3).forEach(rawSubject => {
      const cleanTag = rawSubject.split("/")[0].trim();
      if (cleanTag && cleanTag.length <= 22) {
        discoveredSubjects.add(cleanTag);
      }
    });
  });

  discoveredSubjects.forEach(tag => {
    const alreadyExists = Array.from(pillContainer.querySelectorAll(".pill"))
      .some(p => p.textContent.trim().toLowerCase() === tag.toLowerCase());

    if (!alreadyExists && pillContainer.querySelectorAll(".pill").length < 20) {
      const newPill = document.createElement("button");
      newPill.className = "pill";
      newPill.textContent = tag;
      newPill.onclick = function () {
        setQuickTag(tag, this);
      };
      pillContainer.appendChild(newPill);
    }
  });
}

async function fetchFromOpenLibraryFallback(searchTerm) {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}&limit=12&fields=key,title,author_name,publisher,language,cover_i,ratings_average,subject`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Open Library HTTP ${response.status}`);
    }

    const data = await response.json();

    const apiBooks = mapOpenLibraryDocs(data.docs || []);

    // Restore previously saved reviews for fetched books
    apiBooks.forEach(applySavedReviews);

    searchedBooks = apiBooks;

    appendDynamicTags(data.docs || []);
    filterBooks();

  } catch (fallbackErr) {
    console.error("Open Library fallback failed:", fallbackErr);
    filterBooks();
  }
}


/* ==================== BOOK DETAIL MODAL & INTERACTIVE CAROUSEL ==================== */
let currentModalBookId = null;
let modalSlides = [];
let modalSlideIdx = 0;

function openBookModal(bookId) {
  const book = getBookById(bookId);
  if (!book) return;

  forceHidePopover();
  currentModalBookId = bookId;

  // Build carousel slides: use API gallery if available, plus styled edition card
  modalSlides = [];
  const imageSources = (book.gallery && book.gallery.length > 0)
    ? book.gallery
    : (book.image ? [book.image] : []);

  imageSources.forEach((src, i) => {
    modalSlides.push({
      type: "image",
      src,
      caption: i === 0 ? "Primary Cover Edition" : `Alternate Edition / Scan ${i + 1}`
    });
  });

  // Always include a Kabanata typography/edition card as a slide (or primary slide if no image exists)
  modalSlides.push({
    type: "card",
    caption: `${book.publisher} • ${book.format}`
  });

  modalSlideIdx = 0;
  renderModalCarousel(book);

  // Populate metadata, synopsis, and reviews
  document.getElementById("modalBadges").innerHTML = `
    <span class="pop-tag">${book.publisher}</span>
    <span class="pop-tag format">${book.format}</span>
    <span class="meta-chip">${book.language}</span>
  `;
  document.getElementById("modalBookTitle").textContent = book.title;
  document.getElementById("modalBookAuthor").textContent = `by ${book.author}`;
  document.getElementById("modalRatingRow").textContent = `★★★★★ (${book.rating})`;
  renderSynopsisText(document.getElementById("modalBookSynopsis"), book.synopsis);

  syncModalActionButtons(book);
  renderModalReviews(book);

  document.getElementById("bookModalOverlay").classList.add("active");

  // If this book came from Open Library and hasn't loaded its full work description yet, fetch it now
  if (book.workKey && book.synopsis === "Loading full synopsis...") {
    fetch(`https://openlibrary.org${book.workKey}.json`)
      .then(res => res.json())
      .then(workData => {
        const rawDesc = typeof workData.description === "string"
          ? workData.description
          : workData.description?.value;

       book.synopsis = rawDesc && rawDesc.trim()
          ? rawDesc.split("([source]")[0].trim()
          : "No available synopsis.";

        if (currentModalBookId === book.id) {
          renderSynopsisText(
            document.getElementById("modalBookSynopsis"),
            book.synopsis
          );
        }
      })
      .catch(() => {
        book.synopsis = "No available synopsis.";
        if (currentModalBookId === book.id) {
          renderSynopsisText(document.getElementById("modalBookSynopsis"), book.synopsis);
        }
      });
  }
}

function renderModalCarousel(book) {
  const viewport = document.getElementById("modalSlideViewport");
  const dotsContainer = document.getElementById("modalCarouselDots");
  const captionEl = document.getElementById("modalCarouselCaption");
  const prevBtn = document.getElementById("modalPrevBtn");
  const nextBtn = document.getElementById("modalNextBtn");

  const currentSlide = modalSlides[modalSlideIdx];

  if (currentSlide.type === "image") {
    viewport.innerHTML = `<img src="${currentSlide.src}" alt="${book.title}" onerror="modalSlides.splice(${modalSlideIdx}, 1); modalSlideIdx = 0; renderModalCarousel(getBookById('${book.id}'));">`;
  } else {
    viewport.innerHTML = `
      <div class="modal-slide-fallback" style="background: ${book.fallbackBg || 'linear-gradient(145deg, #5E2724, #23120B)'};">
        <span class="fallback-pub">${book.publisher}</span>
        <div>
          <div class="fallback-title" style="margin-bottom:0.4rem;">${book.title}</div>
          <div style="font-size:0.82rem; opacity:0.85;">by ${book.author}</div>
        </div>
      </div>
    `;
  }

  captionEl.textContent = `${currentSlide.caption} (${modalSlideIdx + 1}/${modalSlides.length})`;

  const hasMultiple = modalSlides.length > 1;
  prevBtn.classList.toggle("hidden", !hasMultiple);
  nextBtn.classList.toggle("hidden", !hasMultiple);

  dotsContainer.innerHTML = hasMultiple
    ? modalSlides.map((_, idx) => `
        <button class="carousel-dot ${idx === modalSlideIdx ? 'active' : ''}"
                onclick="goToModalSlide(${idx})"
                aria-label="Slide ${idx + 1}"></button>
      `).join("")
    : "";
}

function stepModalCarousel(delta) {
  if (!currentModalBookId || modalSlides.length <= 1) return;
  modalSlideIdx = (modalSlideIdx + delta + modalSlides.length) % modalSlides.length;
  renderModalCarousel(getBookById(currentModalBookId));
}

function goToModalSlide(index) {
  if (!currentModalBookId) return;
  modalSlideIdx = index;
  renderModalCarousel(getBookById(currentModalBookId));
}

function syncModalActionButtons(book) {
  const tbrBtn = document.getElementById("modalTbrBtn");
  if (tbrSet.has(book.id)) {
    tbrBtn.textContent = "✓ Saved on TBR Shelf";
    tbrBtn.classList.add("added");
  } else {
    tbrBtn.textContent = "+ Add to TBR Shelf";
    tbrBtn.classList.remove("added");
  }

  const shopBtn = document.getElementById("modalShopBtn");
  if (book.marketType === "sale") {
    shopBtn.textContent = `Buy ₱${book.price}`;
    shopBtn.style.display = "inline-block";
  } else if (book.marketType === "swap") {
    shopBtn.textContent = "Propose Swap";
    shopBtn.style.display = "inline-block";
  } else {
    shopBtn.style.display = "none";
  }
}

function toggleCurrentModalTBR() {
  if (!currentModalBookId) return;
  toggleTBR(currentModalBookId);
  const book = getBookById(currentModalBookId);
  if (book) syncModalActionButtons(book);
}

function handleModalShopAction() {
  if (!currentModalBookId) return;
  const book = getBookById(currentModalBookId);
  if (!book) return;
  if (book.marketType === "sale") {
    addToCart(book.id);
  } else if (book.marketType === "swap") {
    showToast(`Swap request draft opened for "${book.title}"!`);
  }
}

function renderModalReviews(book) {
  const listEl = document.getElementById("modalReviewsList");
  const countEl = document.getElementById("modalReviewCount");
  const reviews = book.reviews || [];
  countEl.textContent = reviews.length;

  listEl.innerHTML = reviews.length === 0
    ? `<p style="font-size:0.82rem; color:var(--text-muted);">No community reviews yet—be the first to share your thoughts!</p>`
    : reviews.map(r => `<div class="modal-review-item">${r}</div>`).join("");
}

async function submitBookReview(event) {
  event.preventDefault();
  if (!currentModalBookId) return;
  const book = getBookById(currentModalBookId);
  if (!book) return;

  const rawHandle = document.getElementById("reviewHandleInput").value.trim();
  const handle = rawHandle ? (rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`) : "@kabanata_reader";
  const starsCount = Number(document.getElementById("reviewRatingSelect").value);
  const comment = document.getElementById("reviewTextInput").value.trim();
  if (!comment) return;

  const starsStr = "★".repeat(starsCount) + "☆".repeat(5 - starsCount);
  book.reviews.unshift(`"${comment}" — ${handle} (${starsStr})`);

  try {
  await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bookSlug: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      image: book.image || "",
      handle: handle,
      rating: starsCount,
      comment: comment
    })
  });
} catch {
  console.warn("Review saved locally only (backend offline).");
}
  // Save this book's updated reviews
  savedBookReviews[book.id] = [...book.reviews];
  saveStoredData("kabanata_reviews", savedBookReviews);

  document.getElementById("reviewTextInput").value = "";
  renderModalReviews(book);
  showToast(`Review posted for "${book.title}"!`);
}

function closeBookModal(event) {
  if (event.target.id === "bookModalOverlay") forceCloseBookModal();
}

function forceCloseBookModal() {
  document.getElementById("bookModalOverlay").classList.remove("active");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") forceCloseBookModal();
});

/* Initialize */
document.addEventListener("DOMContentLoaded", () => {
  renderTrendingMarquee();
  const firstPubPill = document.querySelector(".pub-pill");
  if (firstPubPill) filterShowcase("All", firstPubPill);
  filterBooks();
  updateShelfCounter();
  syncWithBackend(); 
});