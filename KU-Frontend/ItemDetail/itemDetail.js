import { addToCart } from "../Cart/addToCart.js";

const BACKEND_BASE_URL = "http://localhost:5000"; // Define the base URL once

const $ = (id) => document.getElementById(id);

let qInput,
  decBtn,
  incBtn,
  addBtn,
  currentItem = null;
let isPreorderMode = false;
let deliveryTime = localStorage.getItem("deliveryTime") || "ASAP";

const preorderToggleBtn = $("preorderToggle");
const timeSelectionArea = $("timeSelectionArea");
const showTimePickerBtn = $("showTimePicker");
const timeInput = $("deliveryTimeInput");
const selectedTimeDisplay = $("selectedTimeDisplay");

// ✅ Toast
function toast(msg, danger = false) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText = `
    position: fixed;
    left: 50%; bottom: 26px; transform: translateX(-50%);
    padding: 12px 16px;
    background: ${danger ? "#a83d3d" : "#2b4a2b"};
    color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    z-index: 9999;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
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
    document.body.innerHTML =
      "<h1>Item not found.</h1><p>Please go back to the menu and select an item.</p>";
    return;
  }
  console.log(storedItem);
  currentItem = {
    ...storedItem,
    canteen: storedItem.canteenName || "Unknown Canteen",
  };

  let imageSrc = currentItem.image || "../images/placeholder.png";
  // If the path starts with '/', prepend the base URL
  if (imageSrc.startsWith("/")) {
    imageSrc = `${BACKEND_BASE_URL}${imageSrc}`;
  }

  $("foodImage") && ($("foodImage").src = imageSrc);
  $("foodImage") && ($("foodImage").alt = currentItem.name);
  $("foodName") && ($("foodName").textContent = currentItem.name);
  $("canteenName") && ($("canteenName").textContent = currentItem.canteen);
  $("priceValue") && ($("priceValue").textContent = currentItem.price);

  fetchRecommendedItems(storedItem.canteenId?._id);
}

function initQuantityButtons() {
  if (incBtn && qInput)
    incBtn.addEventListener(
      "click",
      () => (qInput.value = Math.min(99, (+qInput.value || 1) + 1))
    );
  if (decBtn && qInput)
    decBtn.addEventListener(
      "click",
      () => (qInput.value = Math.max(1, (+qInput.value || 1) - 1))
    );
  if (qInput) {
    qInput.addEventListener(
      "input",
      () => (qInput.value = qInput.value.replace(/[^\d]/g, ""))
    );
    qInput.addEventListener(
      "blur",
      () => (qInput.value = Math.max(1, Math.min(99, +qInput.value || 1)))
    );
  }
}

// ✅ Preorder toggle
if (preorderToggleBtn) {
  preorderToggleBtn.addEventListener("click", () => {
    isPreorderMode = !isPreorderMode;
    timeSelectionArea.style.display = isPreorderMode ? "block" : "none";
    preorderToggleBtn.textContent = isPreorderMode
      ? "Switch to Standard Order (ASAP)"
      : "Pre-Order: Select a Time";

    if (!isPreorderMode) {
      deliveryTime = "ASAP";
      localStorage.setItem("deliveryTime", "ASAP");
      selectedTimeDisplay.textContent = "Ordering for ASAP delivery.";
      showTimePickerBtn.textContent = "Select Time";
      timeInput.value = "";
    } else {
      const savedTime = localStorage.getItem("deliveryTime");
      if (savedTime && savedTime !== "ASAP") {
        timeInput.value = savedTime;
        selectedTimeDisplay.innerHTML = `Time Set: <strong>${formatTimeDisplay(
          savedTime
        )}</strong>`;
        showTimePickerBtn.textContent = "Change Time";
      } else {
        selectedTimeDisplay.textContent = "Please select your pre-order time.";
      }
    }
  });
}

// ✅ Show time picker
if (showTimePickerBtn && timeInput) {
  showTimePickerBtn.addEventListener("click", () => {
    timeInput.showPicker ? timeInput.showPicker() : timeInput.click();
  });
}

// ✅ Time selection + save
if (timeInput) {
  timeInput.addEventListener("change", () => {
    const selected = timeInput.value;
    if (!selected) return;

    if (selected < "09:00" || selected > "18:00") {
      toast("⚠️ Please select a time between 9:00 AM and 6:00 PM!", true);
      timeInput.value = "";
      selectedTimeDisplay.textContent = "Invalid time selected.";
      localStorage.removeItem("deliveryTime");
      return;
    }

    deliveryTime = selected;
    localStorage.setItem("deliveryTime", deliveryTime);
    selectedTimeDisplay.innerHTML = `Time Set: <strong>${formatTimeDisplay(
      selected
    )}</strong>`;
    showTimePickerBtn.textContent = "Change Time";
    console.log("✅ Saved deliveryTime:", selected);
  });
}

// ✅ Add to cart
function setupAddToCart() {
  if (!addBtn) return;

  addBtn.addEventListener("click", () => {
    const qty = Math.max(1, Math.min(99, +qInput.value || 1));

    // ⚙️ Always read the *latest* saved value
    deliveryTime = localStorage.getItem("deliveryTime") || "ASAP";

    if (isPreorderMode && deliveryTime === "ASAP") {
      toast("Please select a time for your pre-order!", true);
      return;
    }

    const itemToAdd = { ...currentItem, qty };
    addToCart(itemToAdd);

    const total = qty * currentItem.price;
    const timeMsg =
      deliveryTime === "ASAP" ? "" : ` for ${formatTimeDisplay(deliveryTime)}`;
    toast(`Added ${qty} × ${currentItem.name}${timeMsg} — Rs ${total}`);

    console.log("🧠 Final deliveryTime sent to checkout:", deliveryTime);
  });
}

// ✅ Format helper
function formatTimeDisplay(time24) {
  const [h, m] = time24.split(":");
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

async function fetchRecommendedItems(canteenId) {
  const grid = $("food-grid");
  if (!grid) return;

  try {
    const res = await fetch(`http://localhost:5000/api/menu?limit=10000`);
    const data = await res.json();

    if (data.success && data.menuItems.length > 0) {
      const recommended = data.menuItems.filter(
        (i) => i.canteenId?._id === canteenId && i._id !== currentItem._id
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

  items.forEach((item) => {
    const canteenName =
      item.canteenId?.name ||
      item.canteenName ||
      item.canteenSlug ||
      "Unknown Canteen";

    let imageSrc = item.image || "../images/placeholder.png";
    if (imageSrc.startsWith("/")) {
      imageSrc = `${BACKEND_BASE_URL}${imageSrc}`;
    }

    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
             <img src="${imageSrc}" alt="${item.name}">
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
      // 🎯 FIX: Create a clean item object for storage 🎯
      const itemToStore = {
        ...item,
        // Ensure only the relative path is stored, removing any accidental absolute paths
        image: item.image?.startsWith("/")
          ? item.image
          : "/images/placeholder.png",
        // This assumes the backend *should* only be sending the relative path starting with '/'
      };

      // localStorage.setItem("currentItemId", item._id); // You might not need this line if you use currentItem._id
      localStorage.setItem("currentItem", JSON.stringify(itemToStore));
      window.location.href = "../ItemDetail/itemDetail.html";
    });

    container.appendChild(card);
  });
}

// function showToast(message) {
//   const toast = document.getElementById("toast-notification");
//   const messageSpan = toast.querySelector(".toast-message");

//   messageSpan.textContent = message;
//   toast.classList.remove("hidden");
//   toast.classList.add("show");

//   // Hide after 3 seconds
//   setTimeout(() => {
//     toast.classList.remove("show");
//     setTimeout(() => toast.classList.add("hidden"), 300); // hide after transition
//   }, 3000);
// }

// function initMainAddToCart() {
//     const btn = $("addToCart");
//     if (btn && currentItem) {
//         btn.addEventListener("click", () => {
//             const qty = +qInput.value || 1;
//             addToCart({ ...currentItem, qty });
//             showToast(`${currentItem.name} added to cart!`);
//         });
//     }
// }

document.addEventListener("DOMContentLoaded", () => {
  initElements();
  initItemDetails();
  initQuantityButtons();
  setupAddToCart();

  // Restore state
  const savedTime = localStorage.getItem("deliveryTime");
  if (savedTime && savedTime !== "ASAP") {
    isPreorderMode = true;
    timeSelectionArea.style.display = "block";
    timeInput.value = savedTime;
    selectedTimeDisplay.innerHTML = `Time Set: <strong>${formatTimeDisplay(
      savedTime
    )}</strong>`;
    preorderToggleBtn.textContent = "Switch to Standard Order (ASAP)";
  } else {
    selectedTimeDisplay.textContent = "Ordering for ASAP delivery.";
  }

  console.log(
    "🚀 Initialized with deliveryTime:",
    localStorage.getItem("deliveryTime")
  );
});
