import { clearCart } from "./addToCart.js";

// ===== LOAD CART ITEMS =====
function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById("cart-items");
    let subtotal = 0;

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p style='text-align: center; color: #777;'>Your cart is empty.</p>";
    } else {
        cart.forEach(item => {
            let itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            let div = document.createElement("div");
            div.classList.add("food-item");
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="checkout-food-image">
                <div class="food-info">
                    <h3>${item.name}</h3>
                    <p class="food-qty">Quantity: ${item.quantity}</p>
                    <p class="food-total">Total: Rs ${itemTotal}</p>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    // Update totals in the new structure
    document.getElementById("subtotal").innerText = "Rs " + subtotal;
    let delivery = (cart.length > 0 ? 50 : 0);
    document.getElementById("delivery-charge").innerText = "Rs " + delivery;
    document.getElementById("total-price").innerText = "Rs " + (subtotal + delivery);
}

// ===== HANDLE ORDER SUBMISSION =====
document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim(); // Get email
    let dept = document.getElementById("department").value.trim();
    let phone = document.getElementById("phone").value.trim();

    if (!name || !email || !dept || !phone) { // Check for all fields
        alert("⚠️ Please fill in all fields before placing the order.");
        return;
    }

    alert("✅ Order placed successfully!\n\nThank you, " + name + "!\nWe’ll deliver to: " + dept);

    // clear cart
    clearCart();
    loadCart();
    document.getElementById("userForm").reset();
});

// ===== INIT LOAD =====
window.onload = loadCart;