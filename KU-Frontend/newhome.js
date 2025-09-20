import { addToCart } from "./addToCart.js";

const data = {
  food: [
    { name: "Biryani", price: "2200", img: "../images/image.jpeg", canteen: "Al-Qasmia Canteen" },
    { name: "Tikka Biryani", price: "1000", img: "image.jpeg", canteen: "Neelum Canteen" },
    { name: "Fried Rice", price: "759", img: "image.jpeg", canteen: "Central Cafe" },
    { name: "Chicken Chowmien", price: "1000", img: "image.jpeg", canteen: "Student Point" },
    { name: "Shaslik", price: "759", img: "image.jpeg", canteen: "Science Canteen" },
    { name: "Creamy Pasta", price: "1700", img: "../images/canteen_img/Macroni.jpg", canteen: "Arts Canteen" },
    { name: "Burger", price: "500", img: "../images/canteen_img/Burger.png", canteen: "Sports Cafe" },
    { name: "Wings", price: "700", img: "../images/canteen_img/Wings.jpg", canteen: "Student Lounge" },
    { name: "Sandwich", price: "1200", img: "../images/canteen_img/Sandwich1.jpg", canteen: "Main Cafe" },
    { name: "Pizza Fries", price: "650", img: "../images/canteen_img/Pizza Fries.jpg", canteen: "Fast Food Corner" }
  ],
};

// ===== FUNCTION TO GENERATE FOOD CARDS =====
function generateFoodCards(containerId, items, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const list = limit ? items.slice(0, limit) : items;

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3 class="food-name">${item.name}</h3>
      <p class="canteen-name">${item.canteen}</p>
      <div class="price-row">
        <span class="price">Rs. ${item.price}</span>
       <button class="add-btn" data-name="${item.name}">Add</button>
      </div>
    `;
    container.appendChild(card);
  });

    // Attach event listeners after rendering
      document.querySelectorAll(".add-btn").forEach(btn => {
          btn.addEventListener("click", () => {
              const item = data.food.find(i => i.name === btn.dataset.name);
              addToCart(item);
          });
      });
}

// ===== INIT LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("food-grid")) {
    generateFoodCards("food-grid", data.food, 10);
  }
});