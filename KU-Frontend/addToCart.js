// This file contains the core functions for managing the cart in localStorage.

// Function to add an item to the cart
export const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(cartItem => cartItem.name === item.name);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.name} added to cart!`);
};


//Clear cart functionality 
export const clearCart = () => {
    localStorage.removeItem("cart");
};