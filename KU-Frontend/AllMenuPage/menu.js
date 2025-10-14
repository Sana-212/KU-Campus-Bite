import { addToCart } from "../Cart/addToCart.js";

  const BACKEND_BASE_URL = "http://localhost:5000";

let allItems = [];
let currentPage = 1;
const itemsPerPage = 20;

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageNumbersContainer = document.getElementById("page-numbers");

function generateFoodCards(containerId, items, limit = 1005) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const list = limit ? items.slice(0, limit) : items;

  list.forEach((item) => {
    const canteenDisplay =
      item.canteenId?.name ||
      item.canteenName ||
      item.canteenSlug ||
      "Unknown Canteen";

    // const image = item.image || "../images/placeholder.png";

    // 1. Get the relative path (e.g., /images/menu_items/chai.jfif)
    const relativeImagePath = item.image || "/images/placeholder.png";

    // 2. Construct the absolute URL
    const absoluteImageUrl = relativeImagePath.startsWith("http")
      ? relativeImagePath // If it's already a full URL, use it
      : `${BACKEND_BASE_URL}${relativeImagePath}`; // Prepend the backend URL

    const priceText =
      item.price !== undefined && item.price !== null
        ? `Rs. ${item.price}`
        : "Price N/A";

    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
  <img src="${absoluteImageUrl}" alt="${item.name}">
      <h3 class="food-name">${item.name}</h3>
      <p class="canteen-name">${canteenDisplay}</p>
      <div class="price-row">
        <span class="price">${priceText}</span>
        <button class="add-btn">Add</button>
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-btn")) return;

      localStorage.setItem("currentItemId", item._id);
      localStorage.setItem("currentItem", JSON.stringify(item));

      window.location.href = "../ItemDetail/itemDetail.html";
    });


    card.querySelector(".add-btn").addEventListener("click", () => {
      addToCart(item);
    });

    container.appendChild(card);
  });
}

async function fetchAllMenuItems() {
  try {
    const res = await fetch(`http://localhost:5000/api/menu?limit=10000`);
    const data = await res.json();

    if (data.success && data.menuItems.length > 0) {
      allItems = data.menuItems;
      renderMenu();
      renderPagination();
    } else {
      document.getElementById("food-grid").innerHTML =
        "<p>No food items found.</p>";
    }
  } catch (err) {
    console.error("Error fetching menu:", err);
    document.getElementById("food-grid").innerHTML =
      "<p>Failed to load menu.</p>";
  }
}

function renderMenu() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = allItems.slice(start, end);

  generateFoodCards("menu-container", paginatedItems);
}


function renderPagination() {
  pageNumbersContainer.innerHTML = "";
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const pagesPerSet = 5;

  // Calculate sliding window start page
  // Ensure startPage is at least 1 and max so that window fits in totalPages
  let startPage = currentPage;
  if (startPage + pagesPerSet - 1 > totalPages) {
    startPage = Math.max(totalPages - pagesPerSet + 1, 1);
  }
  const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("span");
    pageBtn.classList.add("page-number");
    pageBtn.textContent = i;

    if (i === currentPage) {
      pageBtn.classList.add("active");
    }

    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderMenu();
      renderPagination();
    });

    pageNumbersContainer.appendChild(pageBtn);
  }

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderMenu();
    renderPagination();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderMenu();
    renderPagination();
  }
});


function createPageButton(page) {
  const pageBtn = document.createElement("span");
  pageBtn.classList.add("page-number");
  pageBtn.textContent = page;

  if (page === currentPage) {
    pageBtn.classList.add("active");
  }

  pageBtn.addEventListener("click", () => {
    currentPage = page;
    renderMenu();
    renderPagination();
  });

  return pageBtn;
}


document.addEventListener("DOMContentLoaded", () => {
  fetchAllMenuItems();
});
