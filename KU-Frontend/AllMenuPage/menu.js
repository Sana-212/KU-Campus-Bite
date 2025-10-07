import { addToCart } from "../Cart/addToCart.js";


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

    const image = item.image || "../images/placeholder.png";
    const priceText =
      item.price !== undefined && item.price !== null
        ? `Rs. ${item.price}`
        : "Price N/A";

    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <img src="${image}" alt="${item.name}">
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

  if (totalPages <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    pageNumbersContainer.style.display = "none";
    return;
  }

  prevBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";
  pageNumbersContainer.style.display = "flex";

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("span");
    pageBtn.classList.add("page-number");
    if (i === currentPage) pageBtn.classList.add("active");

    pageBtn.textContent = i;
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

document.addEventListener("DOMContentLoaded", () => {
  fetchAllMenuItems();
});
