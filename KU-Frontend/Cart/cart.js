const BACKEND_BASE_URL = "https://ku-campus-bite-i82kfe4eb-sanas-projects-0847f4e8.vercel.app/"

function getIdentifier() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user._id) {
    console.log("Logged-in user ID:", user._id);
    return { type: "user", id: user._id };
  }

  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = crypto.randomUUID();
    console.log("Logged-in user ID:", guestId);
    localStorage.setItem("guestId", guestId);
  }
  return { type: "guest", id: guestId };
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function showToast(message, type) {
  // You MUST have a <div id="toast-container"></div> in your HTML body
  const container = document.getElementById("toast-container");
  if (!container) {
    console.error(
      "Toast container not found. Add <div id='toast-container'></div> to your HTML."
    );
    return;
  }

  const toast = document.createElement("div");
  let iconHtml;
  let toastClass;

  if (type === "success") {
    iconHtml = "&#10003;";
    toastClass = "toast--success";
  } else if (type === "error") {
    iconHtml = "&#10005;";
    toastClass = "toast--error";
  } else {
    iconHtml = "i";
    toastClass = "toast--info";
  }

  toast.className = `toast ${toastClass} show`;
  toast.innerHTML = `
        <div class="toast__icon">${iconHtml}</div>
        <div class="toast__text">${message}</div>
    `;

  container.appendChild(toast);

  const DURATION = 4000;

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");

    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, DURATION);
}

async function fetchCart() {
  try {
    const { type, id } = getIdentifier();
    const headers = { ...getAuthHeaders() };

    const response = await fetch(
      `${BACKEND_BASE_URL}/api/cart?${type}Id=${id}`,
      { headers }
    );

    const data = await response.json();

    if (data.success) {
      displayCart(data.cart);
    } else {
      console.log("No items in cart.");
      displayCart([]);

      if (data.cart.length === 0) {
        showToast("Your cart is empty.", "info");
      }
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}

async function updateCartItem(itemId, action) {
  try {
    const { type, id } = getIdentifier();
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    };

    const response = await fetch(`${BACKEND_BASE_URL}/api/cart/update`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ [`${type}Id`]: id, itemId, action }),
    });

    const data = await response.json();
    if (data.success) {
      fetchCart();
    } else {
      console.log("Failed to update cart:", data.msg);
    }
  } catch (error) {
    console.error("Error updating cart:", error);
  }
}

export async function clearCart() {
  try {
    const { type, id } = getIdentifier();
    const headers = { ...getAuthHeaders() };

    const response = await fetch(
      `${BACKEND_BASE_URL}/api/cart/clear?${type}Id=${id}`,
      {
        method: "DELETE",
        headers,
      }
    );

    const data = await response.json();
    if (data.success) {
      fetchCart();
    } else {
      console.log("Failed to clear cart:", data.msg);
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
}

function displayCart(cartItems = []) {
  const tbody = document.getElementById("cart-table-body");
  const subtotalEl = document.getElementById("subtotal");
  const grandTotalEl = document.getElementById("grand-total");

  if (!tbody) return;

  tbody.innerHTML = "";
  let subtotal = 0;

  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const relativeImagePath =
      item.menuItemId?.image ||
      item.menuItemId?.img ||
      "/images/placeholder.png";

    let imageSrc = relativeImagePath;
    if (imageSrc.startsWith("/")) {
      imageSrc = `${BACKEND_BASE_URL}${imageSrc}`;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="item-details-cell"> 
                <img src="${imageSrc}" alt="${item.name}" class="food-image">
                ${item.name}
            </td>
            <td>Rs. ${item.price}</td>
            <td>
                <button class="decrease-btn" data-id="${item._id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-btn" data-id="${item._id}">+</button>
            </td>
            <td>Rs. ${itemTotal.toFixed(2)}</td>
            <td>
                <button class="remove-btn" data-id="${item._id}">❌</button>
            </td>
        `;
    tbody.appendChild(row);
  });

  subtotalEl.textContent = subtotal.toFixed(2);
  grandTotalEl.textContent = subtotal.toFixed(2);
}

function isLoggedIn() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  return !!(token && user && user._id);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchCart();

  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("increase-btn")) {
      updateCartItem(e.target.dataset.id, "increase");
    }
    if (e.target.classList.contains("decrease-btn")) {
      updateCartItem(e.target.dataset.id, "decrease");
    }
    if (e.target.classList.contains("remove-btn")) {
      updateCartItem(e.target.dataset.id, "remove");
    }
  });

  const shopBtn = document.getElementById("shop-btn");
  if (shopBtn)
    shopBtn.addEventListener(
      "click",
      () => (window.location.href = "../AllMenuPage/menu.html")
    );

  const clearBtn = document.getElementById("clear-btn");
  if (clearBtn) clearBtn.addEventListener("click", clearCart);

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cartTableBody = document.getElementById("cart-table-body");
      if (cartTableBody && cartTableBody.children.length === 0) {
        showToast("Your cart is empty. Please add items before checking out.","info");
        return;
      }

      if (isLoggedIn()) {
        window.location.href = "../Checkout/checkout.html";
      } else {
        showToast("Please log in first to proceed to checkout.", "error");
        setTimeout(() => {
          window.location.href = "../Authentication/login.html";
        }, 1500);
      }
    });
  }
});
