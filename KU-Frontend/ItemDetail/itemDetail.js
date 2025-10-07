import { addToCart } from "../Cart/addToCart.js";

const $ = id => document.getElementById(id);

let qInput, decBtn, incBtn, addBtn;
let currentItem = null;

function toast(msg, danger = false) {
    const el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText = `
        position: fixed;
        left: 50%;
        bottom: 26px;
        transform: translateX(-50%);
        padding: 12px 16px;
        background: ${danger ? "#7a1f2a" : "#1d2a1d"};
        border: 1px solid ${danger ? "#a22" : "#2c4"};
        color: #fff;
        border-radius: 10px;
        box-shadow: 0 10px 24px rgba(0,0,0,.35);
        z-index: 9999;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1700);
}

function initElements() {
    qInput = $("quantity");
    decBtn = $("decrement");
    incBtn = $("increment");
    addBtn = $("addToCart");
}

function initItemDetails() {
    
    const storedItem = JSON.parse(localStorage.getItem("currentItem") || "{}");
    if (!storedItem || !storedItem._id) {
        document.body.innerHTML = "<h1>Item not found.</h1><p>Please go back to the menu and select an item.</p>";
        return;
    }
console.log(storedItem)
    currentItem = {
        ...storedItem,
        canteen: storedItem.canteenName|| "Unknown Canteen"
    };

    $("foodImage") && ($("foodImage").src = currentItem.image || '../images/placeholder.png');
    $("foodImage") && ($("foodImage").alt = currentItem.name);
    $("foodName") && ($("foodName").textContent = currentItem.name);
    $("canteenName") && ($("canteenName").textContent = currentItem.canteen);
    $("priceValue") && ($("priceValue").textContent = currentItem.price);



    fetchRecommendedItems(storedItem.canteenId?._id);
}

function initQuantityButtons() {
    if (incBtn && qInput) incBtn.addEventListener("click", () => qInput.value = Math.min(99, (+qInput.value || 1) + 1));
    if (decBtn && qInput) decBtn.addEventListener("click", () => qInput.value = Math.max(1, (+qInput.value || 1) - 1));
    if (qInput) {
        qInput.addEventListener("input", () => qInput.value = qInput.value.replace(/[^\d]/g, ""));
        qInput.addEventListener("blur", () => qInput.value = Math.max(1, Math.min(99, +qInput.value || 1)));
    }
}

async function fetchRecommendedItems(canteenId) {
    const grid = $("food-grid");
    if (!grid) return;

    try {
        const res = await fetch(`http://localhost:5000/api/menu?limit=10000`);
        const data = await res.json();

        if (data.success && data.menuItems.length > 0) {
            const recommended = data.menuItems.filter(i =>
                i.canteenId?._id === canteenId && i._id !== currentItem._id
            );
            if (recommended.length > 0) {
                generateFoodCards("food-grid", recommended);
            } else {
                grid.innerHTML = "<p>No other items found.</p>";
            }
        } else {
            grid.innerHTML = "<p>No other items found.</p>";
        }
    } catch (err) {
        console.error("Error fetching recommendations:", err);
        grid.innerHTML = "<p>Failed to load recommendations.</p>";
    }
}

function generateFoodCards(containerId, items) {
    const container = $(containerId);
    if (!container) return;
    container.innerHTML = "";

    items.forEach(item => {
        const canteenName = item.canteenId?.name || item.canteenName ||
      item.canteenSlug || "Unknown Canteen";

        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
            <img src="${item.image || '../images/placeholder.png'}" alt="${item.name}">
            <h3 class="food-name">${item.name}</h3>
            <p class="canteen-name">${canteenName}</p>
            <div class="price-row">
                <span class="price">Rs. ${item.price}</span>
                <button class="add-btn">Add</button>
            </div>
        `;

        card.querySelector(".add-btn").addEventListener("click", () => {
            addToCart(item);
        });

        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("add-btn")) return;
            localStorage.setItem("currentItemId", item._id);
            localStorage.setItem("currentItem", JSON.stringify(item));
            window.location.href = "../ItemDetail/itemDetail.html";
        });

        container.appendChild(card);
    });
}
function initMainAddToCart() {
    const btn = $("addToCart");
    if (btn && currentItem) {
        btn.addEventListener("click", () => {
            const qty = +qInput.value || 1;
            addToCart({ ...currentItem, qty });

        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    initElements();
    initItemDetails();
    initQuantityButtons();
    initMainAddToCart();
});
