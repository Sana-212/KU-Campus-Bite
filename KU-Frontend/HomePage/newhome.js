const BACKEND_BASE_URL ="https://ku-campus-bite-i82kfe4eb-sanas-projects-0847f4e8.vercel.app"; // 👈 Define your backend URL
import { addToCart } from "../Cart/addToCart.js";

export function generateFoodCards(containerId, items, limit = 20) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const list = limit ? items.slice(0, limit) : items;



  list.forEach(item => {
    const canteenDisplay =
      item.canteenId?.name ||
      item.canteenName ||
      item.canteenSlug ||
      "Unknown Canteen";

    // const image = item.image || "../images/placeholder.png";

  // 1. Get the relative path (e.g., /images/menu_items/chai.jfif)
        const relativeImagePath = item.image || "/images/placeholder.png"; 

        // 2. Construct the absolute URL
        const absoluteImageUrl = relativeImagePath.startsWith('http') 
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

      // Navigate to detail page
      window.location.href = "../ItemDetail/itemDetail.html";
    });
    
    card.querySelector(".add-btn").addEventListener("click", () => {
      addToCart(item);
    });


    container.appendChild(card);
  });
}

async function fetchMenu(search = "", page = 1, limit = 10) {
  try {
    const res = await fetch(
      `${BACKEND_BASE_URL}/api/menu?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
    );
    const data = await res.json();

    if (data.success && data.menuItems.length > 0) {
      generateFoodCards("food-grid", data.menuItems, limit);
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

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("food-grid")) {
    fetchMenu();
  }
});
