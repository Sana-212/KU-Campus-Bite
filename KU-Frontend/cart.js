import { clearCart } from "./addToCart.js"


// ===== LOAD CART FROM LOCAL STORAGE =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== DISPLAY CART ITEMS IN TABLE =====
function displayCart() {
  const tbody = document.getElementById("cart-table-body");
  const subtotalEl = document.getElementById("subtotal");
  const grandTotalEl = document.getElementById("grand-total");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">Your cart is empty.</td></tr>`;
    subtotalEl.textContent = "₨ 0";
    grandTotalEl.textContent = "₨ 0";
    return;
  }

  let subtotal = 0;

  cart.forEach((item, i) => {
    const price = Number(item.price);
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="cart-item-info padding">
        <img src="${item.img}" alt="${item.name}" class="food-image">
        ${item.name}
      </td>
      <td>₨ ${price}</td>
      <td>
        <button class="decrease-btn" data-index="${i}">-</button>
        <span>${item.quantity}</span>
        <button class="increase-btn" data-index="${i}">+</button>
        </td>
        <td>₨ ${itemTotal}</td>
        <td><button class="remove-btn" data-index="${i}">X</button></td>
    `;
    tbody.appendChild(row);
  });

  // ===== Update Order Summary =====
  const tax = (subtotal * 0.01).toFixed(2); // 1% tax
  const grandTotal = (subtotal).toFixed(2);

  subtotalEl.textContent = `₨ ${subtotal}`;
  grandTotalEl.textContent = `₨ ${grandTotal}`;

  attachEvents();
}

// ===== ATTACH EVENTS TO BUTTONS =====
function attachEvents() {
  // Increase qty
  document.querySelectorAll(".increase-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = e.target.getAttribute("data-index");
      cart[i].quantity++;
      saveCart();
      displayCart();
    });
  });

  // Decrease qty
  document.querySelectorAll(".decrease-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = e.target.getAttribute("data-index");
      if (cart[i].quantity > 1) {
        cart[i].quantity--;
      } else {
        cart.splice(i, 1);
      }
      saveCart();
      displayCart();
    });
  });

  // Remove item
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = e.target.getAttribute("data-index");
      cart.splice(i, 1);
      saveCart();
      displayCart();
    });
  });
}

// ===== SAVE CART =====
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== INIT CART PAGE =====
document.addEventListener("DOMContentLoaded", () => {
  displayCart();

  // Back button
  const shopBtn = document.getElementById("shop-btn");
  if (shopBtn) {
    shopBtn.addEventListener("click", () => {
      window.location.href="menu.html"
    });
  }

  const clearBtn = document.getElementById("clear-btn")
  if(clearBtn){
    clearBtn.addEventListener("click", ()=>{
      console.log("clicked")
      clearCart()
      cart = JSON.parse(localStorage.getItem("cart")) || [];
      displayCart()
    })
  }

  // Checkout button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }
});

displayCart();