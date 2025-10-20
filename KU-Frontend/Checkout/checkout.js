import { clearCart } from "../Cart/addToCart.js";
console.log(
  "🚀 Checkout page started, deliveryTime in localStorage:",
  localStorage.getItem("deliveryTime")
);

const BACKEND_BASE_URL = "http://localhost:5000";

async function loadCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  let subtotal = 0;

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !user._id || !token) {
    cartItemsContainer.innerHTML =
      "<p style='text-align: center; color: red;'>Please log in to view your cart.</p>";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/cart?userId=${user._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch cart");

    const data = await response.json();
    const cart = data.cart || [];
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        "<p style='text-align: centFer; color: #777;'>Your cart is empty.</p>";
    } else {
      cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const relativeImagePath =
          item.menuItemId?.image || "/images/placeholder.png";

        let imageSrc = relativeImagePath;
        if (imageSrc.startsWith("/")) {
          imageSrc = `${BACKEND_BASE_URL}${imageSrc}`;
        }

        const div = document.createElement("div");
        div.classList.add("food-item");
        div.innerHTML = `
             <img src="${imageSrc}" alt="${item.name}" class="checkout-food-image">
                    <div class="food-info">
                        <h3>${item.name}</h3>
                        <p class="food-qty">Quantity: ${item.quantity}</p>
                        <p class="food-total">Total: Rs ${itemTotal}</p>
                    </div>
                `;
        cartItemsContainer.appendChild(div);
      });
    }

    const subtotalEl = document.getElementById("subtotal");
    const deliveryEl = document.getElementById("delivery-charge");
    const totalEl = document.getElementById("total-price");

    if (subtotalEl) subtotalEl.innerText = "Rs " + subtotal;
    if (deliveryEl) deliveryEl.innerText = "Rs " + (cart.length > 0 ? 50 : 0);
    if (totalEl)
      totalEl.innerText = "Rs " + (subtotal + (cart.length > 0 ? 50 : 0));
  } catch (error) {
    console.error("Error loading cart:", error);
    cartItemsContainer.innerHTML =
      "<p style='text-align: center; color: red;'>Failed to load cart.</p>";
  }
}

// 🕒 Show Pre-Order Time
function showPreOrderTime() {
  let deliveryTime = localStorage.getItem("deliveryTime");
  if (!deliveryTime) {
    deliveryTime = "ASAP";
    localStorage.setItem("deliveryTime", "ASAP");
  }
  console.log("🕒 showPreOrderTime() called, deliveryTime:", deliveryTime);

  const orderSummary = document.querySelector(".order-summary-container");
  if (!orderSummary) {
    console.warn("❌ .order-summary-container not found.");
    return;
  }

  // Remove previous time display to avoid duplicates
  const existingTime = orderSummary.querySelector(".summary-line.time");
  if (existingTime) existingTime.remove();

  // Format 24-hour to 12-hour
  let displayTime = deliveryTime;
  if (deliveryTime !== "ASAP" && /^\d{2}:\d{2}$/.test(deliveryTime)) {
    const [h, m] = deliveryTime.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    displayTime = `${hour}:${m} ${ampm}`;
  }

  // Create line for delivery time
  const timeDiv = document.createElement("div");
  timeDiv.classList.add("summary-line", "time");
  timeDiv.innerHTML = `
      <span><strong>Delivery Time:</strong></span>
      <span>${displayTime}</span>
  `;

  const totalLine = orderSummary.querySelector(".total-line");
  if (totalLine && totalLine.parentElement === orderSummary) {
    orderSummary.insertBefore(timeDiv, totalLine);
  } else {
    orderSummary.appendChild(timeDiv);
  }
}

// ✅ Custom success modal
function showOrderSuccess(name, dept) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
        <div class="modal-content">
            <div class="check-icon">✔️</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you, <strong>${name}</strong>!<br>We’ll deliver to: <strong>${dept}</strong></p>
            <button id="okButton">OK</button>
        </div>
    `;
  document.body.appendChild(modal);

  // Add styles dynamically
  const style = document.createElement("style");
  style.innerHTML = `
        .modal {
            display: flex; position: fixed; z-index: 9999;
            left: 0; top: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); justify-content: center; align-items: center;
        }
        .modal-content {
            background: white; border-radius: 15px; padding: 30px 40px; 
            text-align: center; box-shadow: 0 0 15px rgba(0,0,0,0.2);
            animation: fadeIn 0.4s ease;
        }
        .check-icon { font-size: 50px; color: #28a745; margin-bottom: 15px; }
        .modal-content h2 { margin-bottom: 10px; color: #333; }
        .modal-content p { color: #555; font-size: 16px; }
        #okButton {
            margin-top: 15px; background-color: #28a745; color: white;
            border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer;
        }
        #okButton:hover { background-color: #218838; }
        @keyframes fadeIn {
            from {opacity: 0; transform: scale(0.9);}
            to {opacity: 1; transform: scale(1);}
        }
    `;
  document.head.appendChild(style);

  // Close on OK
  modal.querySelector("#okButton").addEventListener("click", () => {
    modal.remove();
    window.location.href = "../HomePage/KUCampusBite.html";
  });
}

// ✅ Handle order form submission
document
  .getElementById("userForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const dept = document.getElementById("department").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !dept || !phone) {
      alert("Please fill in all fields before placing the order.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !user._id || !token) {
      alert("You must be logged in to place an order.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart?userId=${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();
      const cart = data.cart || [];

      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      const items = cart.map((item) => ({
        menuItemId: item.menuItemId,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      }));

      const totalAmount =
        items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 50;
      const deliveryTime = localStorage.getItem("deliveryTime") || "ASAP";
      console.log("🕒 Delivery Time from localStorage:", deliveryTime);
      console.log(
        "🧠 LocalStorage deliveryTime:",
        localStorage.getItem("deliveryTime")
      );

      const orderData = {
        userId: user._id,
        userName: name,
        items,
        totalAmount,
        deliveryAddress: dept,
        paymentMethod: "cash",
        deliveryTime: deliveryTime,
      };
      console.log("🕒 deliveryTime received from frontend:", deliveryTime);

      console.log("📦 Order Payload:", orderData);

      const orderResponse = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await orderResponse.json();

      if (orderResponse.ok) {
        // 🔹 Replace alert with modal
        showOrderSuccess(name, dept);

        clearCart();
        localStorage.removeItem("deliveryTime");
        loadCart();

        const orderSummary = document.getElementsByClassName(
          "order-summary-container card"
        )[0];
        if (orderSummary) {
          orderSummary.innerHTML =
            "<p style='text-align: center; color: #777;'>Your order summary is empty.</p>";
        }

        document.getElementById("userForm").reset();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Something went wrong while placing your order.");
    }
  });

window.onload = () => {
  loadCart();
  showPreOrderTime();
};
