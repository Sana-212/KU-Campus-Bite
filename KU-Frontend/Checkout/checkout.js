import { clearCart } from "../Cart/addToCart.js";

async function loadCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    let subtotal = 0;

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !user._id || !token) {
        cartItemsContainer.innerHTML = "<p style='text-align: center; color: red;'>Please log in to view your cart.</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/cart?userId=${user._id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch cart");

        const data = await response.json();
        const cart = data.cart || [];

        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p style='text-align: center; color: #777;'>Your cart is empty.</p>";
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                const div = document.createElement("div");
                div.classList.add("food-item");
                div.innerHTML = `
                    <img src="${item.img || 'placeholder.jpg'}" alt="${item.name}" class="checkout-food-image">
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
        if (totalEl) totalEl.innerText = "Rs " + (subtotal + (cart.length > 0 ? 50 : 0));

    } catch (error) {
        console.error("Error loading cart:", error);
        cartItemsContainer.innerHTML = "<p style='text-align: center; color: red;'> Failed to load cart.</p>";
    }
}

// document.getElementById("userForm").addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const cart = JSON.parse(localStorage.getItem("cart")) || [];
//     if (cart.length === 0) {
//         alert("Your cart is empty.");
//         return;
//     }

//     const name = document.getElementById("name").value.trim();
//     const dept = document.getElementById("department").value.trim();
//     const phone = document.getElementById("phone").value.trim();

//     if (!name || !dept || !phone) {
//         alert("Please fill in all fields before placing the order.");
//         return;
//     }

//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = localStorage.getItem("token");

//     if (!user || !user._id || !token) {
//         alert("You must be logged in to place an order.");
//         return;
//     }

//     const items = cart.map(item => ({
//         menuItemId: item.menuItemId,
//         price: item.price,
//         quantity: item.quantity,
//         name: item.name
//     }));

//     const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 50;

//     const orderData = {
//         userId: user._id,
//         items,
//         totalAmount,
//         deliveryAddress: dept,
//         paymentMethod: "cash"
//     };

//     console.log("Order Payload:", orderData);

//     try {
//         const response = await fetch("http://localhost:5000/api/orders", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify(orderData)
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert(`Order placed successfully!\n\nThank you, ${name}!\nWe’ll deliver to: ${dept}`);

//             clearCart();
//             loadCart();
//             const orderSummary = document.getElementsByClassName("order-summary-container card")[0];
//             if (orderSummary) {
//                 orderSummary.innerHTML = "<p style='text-align: center; color: #777;'>Your order summary is empty.</p>";
//             }
//             document.getElementById("userForm").reset();
//         } else {
//             alert("" + result.message);
//         }
//     } catch (error) {
//         console.error("Order Error:", error);
//         alert("Something went wrong while placing your order.");
//     }
// });


document.getElementById("userForm").addEventListener("submit", async function (e) {
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
        // 🔹 Fetch fresh cart from backend (not localStorage)
        const response = await fetch(`http://localhost:5000/api/cart?userId=${user._id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch cart");

        const data = await response.json();
        const cart = data.cart || [];

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const items = cart.map(item => ({
            menuItemId: item.menuItemId,
            price: item.price,
            quantity: item.quantity,
            name: item.name
        }));

        const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 50;

        const orderData = {
            userId: user._id,
            items,
            totalAmount,
            deliveryAddress: dept,
            paymentMethod: "cash"
        };

        console.log("Order Payload:", orderData);

        // 🔹 Send order to backend
        const orderResponse = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        const result = await orderResponse.json();

        if (orderResponse.ok) {
            alert(`Order placed successfully!\n\nThank you, ${name}!\nWe’ll deliver to: ${dept}`);
            

            clearCart();  // clears frontend local cart if needed
            loadCart();   // reloads cart from backend

            const orderSummary = document.getElementsByClassName("order-summary-container card")[0];
            if (orderSummary) {
                orderSummary.innerHTML = "<p style='text-align: center; color: #777;'>Your order summary is empty.</p>";
            }

            document.getElementById("userForm").reset();
            window.location.href="../HomePage/KUCampusBite.html"

        } else {
            alert("" + result.message);
        }
    } catch (error) {
        console.error("Order Error:", error);
        alert("Something went wrong while placing your order.");
    }
});


window.onload = loadCart;
