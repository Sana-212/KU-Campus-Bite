import { addToCart } from "../Cart/addToCart.js";
import { generateFoodCards } from "./newhome.js";

 const BACKEND_BASE_URL ="https://ku-campus-bite-i82kfe4eb-sanas-projects-0847f4e8.vercel.app/";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");
  const foodGrid = document.querySelector("#food-grid");
  const canteenSection = document.querySelector(".canteen-section");
  const foodSectionHeading = document.getElementById("food-section-heading")


  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination";
  paginationContainer.style.textAlign = "center";
  paginationContainer.style.margin = "20px 0";
  paginationContainer.style.display = "none";
  foodGrid.parentNode.insertBefore(paginationContainer, foodGrid.nextSibling);


  const noResultMsg = document.createElement("p");
  noResultMsg.style.color = "red";
  noResultMsg.style.fontWeight = "bold";
  noResultMsg.style.fontSize = "20px";
  noResultMsg.style.textAlign = "center";
  noResultMsg.style.display = "none";
  paginationContainer.parentNode.insertBefore(noResultMsg, paginationContainer.nextSibling);

  let currentPage = 1;
  const limit = 20;
  let currentQuery = "";


  function renderPagination(totalItems) {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / limit);

    if (totalPages <= 1) {
      paginationContainer.style.display = "none";
      return;
    }

    paginationContainer.style.display = "block";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.style.width = "42px";
      btn.style.height = "42px";
      btn.style.borderRadius = "50%";
      btn.style.border = "none";
      btn.style.background = "#690316";
      btn.style.color = "#fff";
      btn.style.fontWeight = "500";
      btn.style.cursor = "pointer";
      btn.style.transition = "all 0.3s ease";
      btn.style.margin = "4px";
      btn.style.fontSize = "16px";

      if (i === currentPage) {
        btn.style.background = "black";
        btn.style.color = "white";
      }

      btn.addEventListener("click", () => {
        currentPage = i;
        loadMenu();
      });

      paginationContainer.appendChild(btn);
    }
  }


  async function loadMenu() {
    try {
      const url = currentQuery
        ? `${BACKEND_BASE_URL}/api/menu?search=${currentQuery}&page=${currentPage}&limit=${limit}`
        : `${BACKEND_BASE_URL}/api/menu`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.menuItems.length > 0) {
        noResultMsg.style.display = "none";
        generateFoodCards("food-grid", data.menuItems);

        if (currentQuery) {
          foodSectionHeading.textContent="Search Results"
          renderPagination(data.total || data.count || 0);
          canteenSection.style.display = "none";
          foodGrid.style.height = "100%";
        } else {
          paginationContainer.style.display = "none";
          canteenSection.style.display = "block";
          foodGrid.style.height = "auto";
        }
      } else {
        foodGrid.innerHTML = "";
        noResultMsg.textContent = `No food found for: "${currentQuery}"`;
        noResultMsg.style.display = "block";
        paginationContainer.style.display = "none";
      }
    } catch (err) {
      console.error("Error loading menu:", err);
      foodGrid.innerHTML = "<p>Failed to load menu.</p>";
      paginationContainer.style.display = "none";
    }
  }


  function searchItems() {
    currentQuery = searchInput.value.toLowerCase().trim();
    currentPage = 1;
    foodGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    loadMenu();
  }

  searchBtn.addEventListener("click", searchItems);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchItems();
  });

  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      currentQuery = "";
      currentPage = 1;

      loadMenu();
    }
  });

  loadMenu();
});


