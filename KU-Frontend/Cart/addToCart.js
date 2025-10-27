const BACKEND_BASE_URL = "https://ku-campus-bite-i82kfe4eb-sanas-projects-0847f4e8.vercel.app"

const API_URL = `${BACKEND_BASE_URL}/api/cart`;

function getIdentifier() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user._id) {
    return { type: "user", id: user._id };
  }

  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guestId", guestId);
  }
  return { type: "guest", id: guestId };
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ⭐ NEW: Toast Notification Function
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) {
        console.error("Toast notification element not found!");
        return;
    }
    
    const messageSpan = toast.querySelector('.toast-message');

    messageSpan.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        // Add hidden class after the fade-out transition 
        setTimeout(() => toast.classList.add('hidden'), 300); 
    }, 3000);
}


export const addToCart = async (item) => {
  const { type, id } = getIdentifier();

  try {
    const res = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        [`${type}Id`]: id,
        menuItemId: item._id,
        quantity: item.qty || 1,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Failed to add to cart");

    localStorage.setItem("cart", JSON.stringify(data.cart.items));

    // ⭐ SUCCESS TOAST
    showToast(`${item.name || 'Item'} added to cart!`);

  } catch (err) {
    console.error("Error adding to cart:", err);
    showToast("Failed to add item to cart."); // Using toast for error too
  }
};


export const getCart = async () => {
  const { type, id } = getIdentifier();
  try {
    const res = await fetch(`${API_URL}?${type}Id=${id}`, {
      headers: { ...getAuthHeaders() }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Failed to fetch cart");

    return data.cart;
  } catch (err) {
    console.error("Error fetching cart:", err);
    // Silent return for fetching, as cart might just be empty
    return []; 
  }
};


export const updateCart = async (menuItemId, actionOrQuantity) => {
  const { type, id } = getIdentifier();
  try {
    const res = await fetch(`${API_URL}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        [`${type}Id`]: id,
        menuItemId,
        ...(typeof actionOrQuantity === "number"
          ? { quantity: actionOrQuantity }
          : { action: actionOrQuantity })
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Failed to update cart");

    localStorage.setItem("cart", JSON.stringify(data.cart.items));
    
    // ⭐ SUCCESS TOAST
    showToast("Cart updated successfully!"); 
    return data.cart;
  } catch (err) {
    console.error("Error updating cart:", err);
    showToast("Failed to update cart."); // Using toast for error too
    return null;
  }
};


export const removeFromCart = async (menuItemId) => {
  const { type, id } = getIdentifier();
  try {
    const res = await fetch(`${API_URL}/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        [`${type}Id`]: id,
        menuItemId
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Failed to remove item");

    localStorage.setItem("cart", JSON.stringify(data.cart.items));
    
    // ⭐ SUCCESS TOAST
    showToast("Item removed from cart.");
    return data.cart;
  } catch (err) {
    console.error("Error removing item:", err);
    showToast("Failed to remove item."); // Using toast for error too
    return null;
  }
};


export const clearCart = async () => {
  const { type, id } = getIdentifier();
  try {
    const res = await fetch(`${API_URL}/clear?${type}Id=${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Failed to clear cart");

    localStorage.removeItem("cart");
    
    // ⭐ SUCCESS TOAST
    showToast("Your cart has been cleared.");
    return data.cart;
  } catch (err) {
    console.error("Error clearing cart:", err);
    showToast("Failed to clear cart."); // Using toast for error too
    return null;
  }
};