import { addToCart } from "../Cart/addToCart.js";

const BACKEND_BASE_URL = "https://ku-campus-bite-i82kfe4eb-sanas-projects-0847f4e8.vercel.app"

// Read params from URL
const params = new URLSearchParams(window.location.search);
const ITEM = {
  canteenId: params.get("canteenId"),
  canteen: params.get("canteenName"),
  image: params.get("image") || "BannerImageCanteenDetail.jpg",
  location: params.get("location") || "Main Campus",
};

let currentCategory = "all";
let currentPage = 1;
const itemsPerPage = 20;
let allItems = [];

// Initialize header image + details
(function initItem() {
  const foodImage = document.getElementById("foodImage");
  const foodHeading = document.getElementById("foodHeading");
  const foodLocation = document.getElementById("foodLocation");

  let canteenImageUrl = ITEM.image;
  if (
    canteenImageUrl &&
    !canteenImageUrl.startsWith("http") &&
    !canteenImageUrl.startsWith("data:")
  ) {
    canteenImageUrl = `${BACKEND_BASE_URL}/${canteenImageUrl}`; 
  }

  if (foodImage) {
    foodImage.src = canteenImageUrl; // <-- Use the fully constructed URL
    foodImage.alt = ITEM.canteen;
  }
  if (foodHeading && foodLocation) {
    foodHeading.textContent = ITEM.canteen;
    foodLocation.innerHTML = `<i class="fa fa-location-dot"></i> ${ITEM.location}`;
  }
})();

// Fetch menu items for a given canteen
async function fetchFoodByCanteen(canteenId) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/menu?limit=10000`);
    const data = await res.json();

    console.log("API data:", data); // debug log

    if (data.success) {
      // filter items where canteenId._id matches given canteenId
      allItems = data.menuItems.filter(
        (item) => item.canteenId && String(item.canteenId) === String(canteenId)
      );

      console.log("Filtered items:", allItems); // debug log

      filterCategory("all", 1);
    } else {
      document.getElementById("food-grid").innerHTML =
        "<p>No food found for this canteen.</p>";
    }
  } catch (err) {
    console.error("Error fetching food:", err);
    document.getElementById("food-grid").innerHTML =
      "<p>Failed to load menu.</p>";
  }
}

// Generate food item cards
function generateFoodCards(containerId, items, page = 1) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = items.slice(start, end);

  if (paginatedItems.length === 0) {
    container.innerHTML = "<p>No items found in this category.</p>";
    const pagination = document.getElementById("pagination");
    if (pagination) pagination.style.display = "none";
    return;
  }

  paginatedItems.forEach((item) => {
    // 1. Get the image path from the item (or fallback to placeholder)
    const relativeImagePath =
      item.image || item.img || "../images/placeholder.png";

    const absoluteImageUrl = relativeImagePath.startsWith("/")
      ? `${BACKEND_BASE_URL}${relativeImagePath}`
      : relativeImagePath; // This handles the placeholder path '../*.*'

    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
<img src="${absoluteImageUrl}" alt="${item.name}">
      <h3 class="food-name">${item.name}</h3>
      <p class="canteen-name">${item.canteenName || ITEM.canteen}</p>
      <div class="price-row">
        <span class="price">Rs. ${item.price}</span>
        <button class="add-btn">Add</button>
      </div>
    `;

    // Navigate to detail page when card (not button) is clicked
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-btn")) return;
      localStorage.setItem("currentItemId", item._id);
      localStorage.setItem("currentItem", JSON.stringify(item));
      window.location.href = "../ItemDetail/itemDetail.html";
    });

    // ⭐ UPDATED: Use async handler for the button click
    card.querySelector(".add-btn").addEventListener("click", async () => {
      await addToCart(item);
    });

    container.appendChild(card);
  });

  renderPagination(items.length, page);
}

// Render pagination controls
function renderPagination(totalItems, currentPage) {
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  if (totalItems === 0) {
    paginationContainer.style.display = "none";
    return;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) {
    paginationContainer.style.display = "none";
    return;
  }

  paginationContainer.style.display = "block";

  const pagesPerSet = 5;

  // Calculate sliding window start page based on currentPage
  let startPage = currentPage;
  if (startPage + pagesPerSet - 1 > totalPages) {
    startPage = Math.max(totalPages - pagesPerSet + 1, 1);
  }
  const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);

  // Prev button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "<";
  prevBtn.classList.add("pagination-btn");
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      filterCategory(currentCategory, currentPage - 1);
    }
  });
  paginationContainer.appendChild(prevBtn);

  // Page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "page-btn" + (i === currentPage ? " active" : "");
    btn.addEventListener("click", () => {
      filterCategory(currentCategory, i);
    });
    paginationContainer.appendChild(btn);
  }

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = ">";
  nextBtn.classList.add("pagination-btn");
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      filterCategory(currentCategory, currentPage + 1);
    }
  });
  paginationContainer.appendChild(nextBtn);
}

// Filter items by category
function filterCategory(category, page = 1) {
  currentCategory = category;
  currentPage = page;

  let items;
  if (category === "all") {
    items = allItems;
  } else {
    items = allItems.filter(
      (item) => (item.category || "").toLowerCase() === category.toLowerCase()
    );
  }

  generateFoodCards("food-grid", items, page);
}

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("food-grid")) return;

  fetchFoodByCanteen(ITEM.canteenId);

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterCategory(btn.dataset.category, 1);
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});
