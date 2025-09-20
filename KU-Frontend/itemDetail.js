import { addToCart } from "./addToCart.js";

const ITEM = {
  id: "burger-01",
  name: "Spicy Chicken Burger",
  canteen: "Neelum Canteen",
  price: 260,
  image: "../images/foodItem.jpg",
  link: "../canteens/neelum_canteen.html",
};

const $ = (id) => document.getElementById(id);

const qInput = $("quantity");
const decBtn = $("decrement");
const incBtn = $("increment");
const addBtn = $("addToCart");
const reviewBtn = $("reviewBtn");
const toggleReview = $("toggleReview");
const reviewForm = $("reviewForm");
const chev = $("chev");
const starsBox = $("stars");
const reviewer = $("reviewer");
const reviewText = $("reviewText");
const submitReview = $("submitReview");
const cancelReview = $("cancelReview");
const reviewsList = $("reviewsList");
const reviewContainer = document.querySelector(".review-container");

// ---------------- INIT ----------------
(function initItem() {
  if ($("foodName")) $("foodName").textContent = ITEM.name;
  if ($("canteenName")) $("canteenName").textContent = ITEM.canteen;
  if ($("priceValue")) $("priceValue").textContent = ITEM.price;
  if ($("foodImage")) {
    $("foodImage").src = ITEM.image;
    $("foodImage").alt = ITEM.name;
  }
  loadReviews();
})();

// ---------------- QUANTITY ----------------
const clampQty = (v) => Math.max(1, Math.min(99, v | 0));

if (incBtn && qInput) {
  incBtn.addEventListener("click", () => {
    qInput.value = clampQty(+qInput.value + 1);
  });
}
if (decBtn && qInput) {
  decBtn.addEventListener("click", () => {
    qInput.value = clampQty(+qInput.value - 1);
  });
}
if (qInput) {
  qInput.addEventListener("input", () => {
    qInput.value = qInput.value.replace(/[^\d]/g, "");
  });
  qInput.addEventListener("blur", () => {
    qInput.value = clampQty(+qInput.value);
  });
}

// ---------------- REVIEWS TOGGLE ----------------
if (toggleReview) {
  toggleReview.addEventListener("click", () => {
    reviewForm.classList.toggle("open");
    chev.classList.toggle("open");
    toggleReview.setAttribute(
      "aria-expanded",
      String(reviewForm.classList.contains("open"))
    );
  });
}

// ---------------- REVIEW FORM OPEN/CLOSE ----------------
if (reviewBtn) {
  reviewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    reviewContainer.classList.add("open");
    if (reviewText) reviewText.focus();
  });
}

if (cancelReview) {
  cancelReview.addEventListener("click", () => {
    reviewContainer.classList.remove("open");
  });
}

// ---------------- STAR RATING ----------------
let currentRating = 0;

if (starsBox) {
  starsBox.addEventListener("mouseover", (e) => {
    if (!e.target.classList.contains("star")) return;
    const v = +e.target.dataset.v;
    colorStars(v);
  });

  starsBox.addEventListener("mouseleave", () => colorStars(currentRating));

  starsBox.addEventListener("click", (e) => {
    if (!e.target.classList.contains("star")) return;
    currentRating = +e.target.dataset.v;
    colorStars(currentRating);
  });
}

function colorStars(val) {
  if (!starsBox) return;
  [...starsBox.children].forEach((s) => {
    s.classList.toggle("active", +s.dataset.v <= val);
  });
}

// ---------------- CART ----------------
if (addBtn) {
  addBtn.addEventListener("click", () => {
    const qty = clampQty(+qInput.value);
    const itemToAdd = {
      id: ITEM.id,
      name: ITEM.name,
      canteen: ITEM.canteen,
      price: ITEM.price,
      image: ITEM.image,
      link: ITEM.link,
      quantity: qty
    };
    addToCart(itemToAdd);

    const total = qty * ITEM.price;
    toast(`Added ${qty} × ${ITEM.name} — Rs ${total}`);
  });
}

submitReview.addEventListener("click", () => {
  const name = reviewer?.value.trim() || "Anonymous";
  const text = reviewText?.value.trim();

  if (currentRating === 0) {
    toast("Please select a rating ★", true);
    return;
  }
  if (!text || text.length < 8) {
    toast("Review is too short.", true);
    return;
  }

  customConfirm("Are you sure you want to submit your review?", (confirmed) => {
    if (!confirmed) return;

    const review = {
      for: ITEM.id,
      name,
      text,
      rating: currentRating,
      at: new Date().toISOString(),
    };

    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    reviews.unshift(review);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    toast("Thanks for your review!");
    if (reviewer) reviewer.value = "";
    if (reviewText) reviewText.value = "";
    currentRating = 0;
    colorStars(0);
    reviewContainer.classList.remove("open");
    loadReviews();
  });
});

// ---------------- CUSTOM CONFIRM ----------------
function customConfirm(message, callback) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(196, 188, 188, 0.6)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = 9999;

  // Create modal box
  const box = document.createElement("div");
  box.style.background = "#ad6074ff";
  box.style.color = "#fff";
  box.style.padding = "24px";
  box.style.borderRadius = "12px";
  box.style.boxShadow = "0 10px 24px rgba(0,0,0,0.5)";
  box.style.textAlign = "center";
  box.innerHTML = `<p style="margin-bottom:16px;">${message}</p>`;

  // Buttons
  const yesBtn = document.createElement("button");
  yesBtn.textContent = "Yes";
  yesBtn.style.margin = "0 10px";
  yesBtn.style.padding = "8px 16px";
  yesBtn.style.background = "rgba(99, 192, 118, 1)";
  yesBtn.style.border = "1px solid rgba(99, 192, 118, 1)";
  yesBtn.style.color = "#fff";
  yesBtn.style.borderRadius = "8px";
  yesBtn.style.cursor = "pointer";

  const noBtn = document.createElement("button");
  noBtn.textContent = "No";
  noBtn.style.margin = "0 10px";
  noBtn.style.padding = "8px 16px";
  noBtn.style.background = "#a22";
  noBtn.style.border = "1px solid #a22";
  noBtn.style.color = "#fff";
  noBtn.style.borderRadius = "8px";
  noBtn.style.cursor = "pointer";

  box.appendChild(yesBtn);
  box.appendChild(noBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  yesBtn.addEventListener("click", () => {
    callback(true);
    overlay.remove();
  });
  noBtn.addEventListener("click", () => {
    callback(false);
    overlay.remove();
  });
}

// ---------------- SHOW REVIEWS ----------------
function loadReviews() {
  if (!reviewsList) return;
  const allReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  const reviews = allReviews.filter((r) => r.for === ITEM.id);

  reviewsList.innerHTML = "<h3>Reviews</h3>";

  if (reviews.length === 0) {
    reviewsList.innerHTML += "<p>No reviews yet. Be the first!</p>";
    return;
  }

  reviews.forEach((r) => {
    const div = document.createElement("div");
    div.className = "review-card";
    div.innerHTML = `
      <strong>${r.name}</strong>
      <span>${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
      <p>${r.text}</p>
      <small>${new Date(r.at).toLocaleString()}</small>
      <button class="delete-review" data-at="${r.at}">🗑️ Delete</button>
    `;
    reviewsList.appendChild(div);
  });

  // Attach delete listeners
  reviewsList.querySelectorAll(".delete-review").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const at = e.target.dataset.at; // use the timestamp instead of index
      let updated = allReviews.filter(
        (r) => !(r.for === ITEM.id && r.at === at)
      );
      localStorage.setItem("reviews", JSON.stringify(updated));
      toast("Review deleted");
      loadReviews(); // refresh the list
    });
  });
}

// ---------------- TOAST ----------------
function toast(msg, danger = false) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.position = "fixed";
  el.style.left = "50%";
  el.style.bottom = "26px";
  el.style.transform = "translateX(-50%)";
  el.style.padding = "12px 16px";
  el.style.background = danger ? "#7a1f2a" : "#1d2a1d";
  el.style.border = "1px solid " + (danger ? "#a22" : "#2c4");
  el.style.color = "#fff";
  el.style.borderRadius = "10px";
  el.style.boxShadow = "0 10px 24px rgba(0,0,0,.35)";
  el.style.zIndex = "9999";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1700);
}
const data = {
  food: [
    {
      name: "Biryani",
      price: "2200",
      img: "../images/signup.jpg",
      canteen: "Al-Qasmia Canteen",
    },
    {
      name: "Tikka Biryani",
      price: "1000",
      img: "../images/canteen_img/TikkaBiryani.jpeg",
      canteen: "Neelum Canteen",
    },
    {
      name: "Fried Rice",
      price: "759",
      img: "../images/canteen_img/Fried Rice.jpg",
      canteen: "Central Cafe",
    },
    {
      name: "Chicken Chowmien",
      price: "1000",
      img: "../images/canteen_img/HakaNoodles.jpg",
      canteen: "Student Point",
    },
    {
      name: "Shaslik",
      price: "759",
      img: "../images/canteen_img/CheesyRll.jpg",
      canteen: "Science Canteen",
    },
    {
      name: "Creamy Pasta",
      price: "1700",
      img: "../images/canteen_img/Macroni.jpg",
      canteen: "Arts Canteen",
    },
    {
      name: "Burger",
      price: "500",
      img: "../images/canteen_img/Burger.png",
      canteen: "Sports Cafe",
    },
    {
      name: "Wings",
      price: "700",
      img: "../images/canteen_img/Wings.jpg",
      canteen: "Student Lounge",
    },
    {
      name: "Sandwich",
      price: "1200",
      img: "../images/canteen_img/Sandwich1.jpg",
      canteen: "Main Cafe",
    },
    {
      name: "Pizza Fries",
      price: "650",
      img: "../images/canteen_img/Pizza Fries.jpg",
      canteen: "Fast Food Corner",
    },
  ],
};

// ===== FUNCTION TO GENERATE FOOD CARDS =====
function generateFoodCards(containerId, items, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const list = limit ? items.slice(0, limit) : items;

  list.forEach((item) => {
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
  document.querySelectorAll(".add-btn").forEach((btn) => {
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

const grid = document.getElementById("food-grid");
document.getElementById("slide-left").addEventListener("click", () => {
  grid.scrollBy({ left: -300, behavior: "smooth" });
});
document.getElementById("slide-right").addEventListener("click", () => {
  grid.scrollBy({ left: 300, behavior: "smooth" });
});
