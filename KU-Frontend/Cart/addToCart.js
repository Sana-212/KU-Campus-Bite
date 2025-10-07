const API_URL = "http://localhost:5000/api/cart";

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

    alert(`${item.name} added to cart!`);
  } catch (err) {
    console.error("Error adding to cart:", err);
    alert("Failed to add item to cart.");
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
    return data.cart;
  } catch (err) {
    console.error("Error updating cart:", err);
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
    return data.cart;
  } catch (err) {
    console.error("Error removing item:", err);
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
    return data.cart;
  } catch (err) {
    console.error("Error clearing cart:", err);
    return null;
  }
};

