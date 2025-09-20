import { addToCart } from "./addToCart.js";


const menuData = {
  food: [
    { name: "Biryani", price: "2200", img: "https://i.pinimg.com/736x/57/58/8b/57588b32c55b721df9710bfe1093fe1f.jpg", canteen: "Al-Qasmia Canteen" },
    { name: "Tikka Biryani", price: "1000", img: "https://i.pinimg.com/1200x/60/4a/56/604a566bb0e3069da9c16899792ee343.jpg", canteen: "Neelum Canteen" },
    { name: "Fried Rice", price: "759", img: "https://i.pinimg.com/736x/a6/6d/e2/a66de266f733105e134702a9233fde1a.jpg", canteen: "Central Cafe" },
    { name: "Chicken Chowmien", price: "1000", img: "https://i.pinimg.com/1200x/4c/99/f1/4c99f1f241408bd112c14baf2a29ceba.jpg", canteen: "Student Point" },
    { name: "Shashlik", price: "759", img: "https://i.pinimg.com/736x/04/3c/46/043c46999db0b1ae2fe5e881cc94dddd.jpg", canteen: "Science Canteen" },
    { name: "Creamy Pasta", price: "1700", img: "https://i.pinimg.com/736x/1f/ef/bf/1fefbf85ad27400e312cfa92b0b046d3.jpg", canteen: "Arts Canteen" },
    { name: "Burger", price: "500", img: "https://i.pinimg.com/736x/89/f4/6f/89f46f58253df7110dc78086d7905759.jpg", canteen: "Sports Cafe" },
    { name: "Wings", price: "700", img: "https://i.pinimg.com/736x/e1/6c/6a/e16c6abdb9e04596239436e47178c1cc.jpg", canteen: "Student Lounge" },
    { name: "Sandwich", price: "1200", img: "https://i.pinimg.com/736x/f5/b6/0f/f5b60f67cb8bb076204eca1751fcd735.jpg", canteen: "Main Cafe" },
    { name: "Pizza Fries", price: "650", img: "https://i.pinimg.com/1200x/ac/a1/53/aca153e2645bba8012a100315f19c167.jpg", canteen: "Fast Food Corner" },
    { name: "Chicken Karahi", price: "2500", img: "https://i.pinimg.com/1200x/9a/bd/95/9abd95595f541b9a6cae5ca14ee7df8c.jpg", canteen: "Al-Qasmia Canteen" },
    { name: "Chicken Handi", price: "3800", img: "https://i.pinimg.com/736x/31/a0/89/31a08950a23cbbd84ca459956cb906fb.jpg", canteen: "Central Cafe" },
    { name: "Seekh Kabab", price: "900", img: "https://i.pinimg.com/736x/5a/70/2c/5a702c509b9622a795b3b1ed4c56cc59.jpg", canteen: "Science Canteen" },
    { name: "Chicken Chatni Roll", price: "450", img: "https://i.pinimg.com/736x/f0/77/e7/f077e70250805654b38a7dbcf74c8e74.jpg", canteen: "PG Canteen" },
    { name: "Limca", price: "200", img: "https://i.pinimg.com/1200x/65/26/cb/6526cbe31346339298d3536d5bd2207b.jpg", canteen: "Sports Cafe" },
    { name: "Mineral Water", price: "100", img: "https://i.pinimg.com/736x/86/4f/b7/864fb76a67b876647ec3cd01c1d04641.jpg", canteen: "All Canteens" },
    { name: "Ice Cream Cup", price: "250", img: "https://i.pinimg.com/736x/bf/7d/ca/bf7dca3ad4546e1d6fd6ae422d2a9500.jpg", canteen: "Student Lounge" },
    { name: "Chicken Handi", price: "3800", img: "https://i.pinimg.com/736x/31/a0/89/31a08950a23cbbd84ca459956cb906fb.jpg", canteen: "Central Cafe" }
  ]
};

const menuItems = menuData.food; 
const menuContainer = document.getElementById('menu-container');
const pageNumbersContainer = document.getElementById('page-numbers');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const itemsPerPage = 10; 
let currentPage = 1;

// ===== CART SYSTEM =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== RENDER MENU =====
function renderMenu() {
    menuContainer.innerHTML = ''; 

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = menuItems.slice(startIndex, endIndex);

    itemsToDisplay.forEach(item => {
        const itemHTML = `
            <div class="menu-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="menu-item-info">
                    <h3>${item.name}</h3>
                    <p class="canteen-info">${item.canteen}</p>
                    <div class="menu-item-price">
                        <span class="price">Rs. ${item.price}</span>
                        <button class="add-btn" data-name="${item.name}">Add</button>
                    </div>
                </div>
            </div>
        `;
        menuContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    // Attach event listeners after rendering
    document.querySelectorAll(".add-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const item = menuItems.find(i => i.name === btn.dataset.name);
            addToCart(item);
        });
    });
}

// ===== RENDER PAGINATION =====
function renderPagination() {
    pageNumbersContainer.innerHTML = ''; 
    const totalPages = Math.ceil(menuItems.length / itemsPerPage);
    
    if (totalPages <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        pageNumbersContainer.style.display = 'none';
        return;
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        pageNumbersContainer.style.display = 'flex';
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('span');
        pageBtn.classList.add('page-number');
        
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        
        pageBtn.textContent = i;
        
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderMenu();
            renderPagination();
        });
        
        pageNumbersContainer.appendChild(pageBtn);
    }
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderMenu();
        renderPagination();
    }
});

nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(menuItems.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderMenu();
        renderPagination();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    renderPagination();
});