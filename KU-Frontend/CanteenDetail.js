const ITEM = {
  canteen: "Neelum Canteen",
  image: "../images/signup.jpg",
  location: "Main Campus"
};

// INIT 
(function initItem() {
  const foodImage = document.getElementById("foodImage");
  const foodHeading = document.getElementById("foodHeading");
  const foodLocation = document.getElementById("foodLocation");
  

  if (foodImage) {
    foodImage.src = ITEM.image;
    foodImage.alt = ITEM.canteen;
  }
  if (foodHeading) {
    foodHeading.textContent = ITEM.canteen;
    foodLocation.innerHTML = `<i class="fa fa-location-dot"></i> ${ITEM.location}`;
  }
  
})();

const data = {
  food: [
    // Lunch 
    { name: "Beef Biryani", price: "2200", img: "../images/foodItem.jpg", canteen: "Neelum Canteen", category: "lunch" },
    { name: "Tikka Biryani", price: "1000", img: "../images/canteen_img/TikkaBiryani.jpeg", canteen: "Neelum Canteen", category: "lunch" },
    { name: "Fried Rice", price: "759", img: "../images/canteen_img/Fried Rice.jpg", canteen: "Neelum Canteen", category: "lunch" },
    { name: "Chicken Chowmien", price: "1000", img: "../images/canteen_img/HakaNoodles.jpg", canteen: "Neelum Canteen", category: "lunch" },
    { name: "Creamy Pasta", price: "1700", img: "../images/canteen_img/Macroni.jpg", canteen: "Neelum Canteen", category: "lunch" },
    { name: "Mutton Karahi", price: "3500", img: "../images/canteen_img/muttonkarahi.jpg", canteen: "Neelum Canteen", category: "lunch" },
    { name: "Chicken Handi", price: "2800", img: "../images/canteen_img/chickenhandi.jpg", canteen: "Neelum Canteen", category: "lunch" },
    { name: "Beef Nihari", price: "2000", img: "../images/canteen_img/nihari.jpg", canteen: "Neelum Canteen", category: "lunch" },
    { name: "Chicken Haleem", price: "1200", img: "../images/canteen_img/haleem.jpg", canteen: "Neelum Canteen", category: "lunch" },
    { name: "Seekh Kabab", price: "900", img: "../images/canteen_img/seekhkabab.jpg", canteen: "Neelum Canteen", category: "lunch" },

    // Snacks
    { name: "Shashlik Roll", price: "759", img: "../images/canteen_img/CheesyRll.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Burger", price: "500", img: "../images/canteen_img/Burger.png", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Zinger Burger", price: "700", img: "../images/canteen_img/zinger.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Chicken Wings", price: "700", img: "../images/canteen_img/Wings.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Grilled Sandwich", price: "1200", img: "../images/canteen_img/Sandwich1.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Club Sandwich", price: "1500", img: "../images/canteen_img/clubsandwich.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Pizza Fries", price: "650", img: "../images/canteen_img/Pizza Fries.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "French Fries", price: "400", img: "../images/canteen_img/fries.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Spring Rolls", price: "550", img: "../images/canteen_img/springroll.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Cheese Balls", price: "800", img: "../images/canteen_img/cheeseballs.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Pakora Plate", price: "300", img: "../images/canteen_img/pakora.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Chaat", price: "250", img: "../images/canteen_img/chaat.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Samosa", price: "100", img: "../images/canteen_img/samosa.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Nuggets", price: "600", img: "../images/canteen_img/nuggets.jpg", canteen: "Neelum Canteen", category: "snacks" },
    { name: "Shawarma", price: "750", img: "../images/canteen_img/shawarma.jpg", canteen: "Neelum Canteen", category: "snacks" },

    // Desserts
    { name: "Gulab Jamun", price: "500", img: "../images/canteen_img/gulabjamun.jpg", canteen: "Neelum Canteen", category: "desserts" },
    { name: "Ras Malai", price: "650", img: "../images/canteen_img/rasmalai.jpg", canteen: "Neelum Canteen", category: "desserts" },
    { name: "Kheer", price: "400", img: "../images/canteen_img/kheer.jpg", canteen: "Neelum Canteen", category: "desserts" },
    { name: "Ice Cream", price: "300", img: "../images/canteen_img/icecream.jpg", canteen: "Neelum Canteen", category: "desserts" },
    { name: "Chocolate Cake", price: "1200", img: "../images/canteen_img/chocolatecake.jpg", canteen: "Neelum Canteen", category: "desserts" },
    { name: "Brownie", price: "700", img: "../images/canteen_img/brownie.jpg", canteen: "Neelum Canteen", category: "desserts" },
    { name: "Cheesecake", price: "1000", img: "../images/canteen_img/cheesecake.jpg", canteen: "Neelum Canteen", category: "desserts" },
    { name: "Fruit Trifle", price: "800", img: "../images/canteen_img/trifle.jpg", canteen: "Neelum Canteen", category: "desserts" },
    { name: "Donut", price: "250", img: "../images/canteen_img/donut.jpg", canteen: "Neelum Canteen", category: "desserts" },
    { name: "Cupcake", price: "200", img: "../images/canteen_img/cupcake.jpg", canteen: "Neelum Canteen", category: "desserts" },

    // Drinks
    { name: "Cold Drink", price: "200", img: "../images/canteen_img/coke.jpg", canteen: "Neelum Canteen", category: "drinks" },
    { name: "Pepsi", price: "200", img: "../images/canteen_img/pepsi.jpg", canteen: "Neelum Canteen", category: "drinks" },
    { name: "Sprite", price: "200", img: "../images/canteen_img/sprite.jpg", canteen: "Neelum Canteen", category: "drinks" },
    { name: "Fanta", price: "200", img: "../images/canteen_img/fanta.jpg", canteen: "Neelum Canteen", category: "drinks" },
    { name: "Lassi", price: "250", img: "../images/canteen_img/lassi.jpg", canteen: "Neelum Canteen", category: "drinks" },
    { name: "Milkshake", price: "350", img: "../images/canteen_img/milkshake.jpg", canteen: "Neelum Canteen", category: "drinks" },
    { name: "Cold Coffee", price: "400", img: "../images/canteen_img/coldcoffee.jpg", canteen: "Neelum Canteen", category: "drinks" },
    { name: "Mineral Water", price: "100", img: "../images/canteen_img/water.jpg", canteen: "Neelum Canteen", category: "drinks" },
    { name: "Green Tea", price: "150", img: "../images/canteen_img/greentea.jpg", canteen: "Neelum Canteen", category: "drinks" },
    { name: "Lemonade", price: "200", img: "../images/canteen_img/lemonade.jpg", canteen: "Neelum Canteen", category: "drinks" },
    { name: "Energy Drink", price: "500", img: "../images/canteen_img/energydrink.jpg", canteen: "Neelum Canteen", category: "drinks" },
  ],
};

let currentCategory = "all";
let currentPage = 1;
const itemsPerPage = 20;

//FUNCTION TO GENERATE FOOD CARDS 
function generateFoodCards(containerId, items, page = 1) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";


  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = items.slice(start, end);

  paginatedItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3 class="food-name">${item.name}</h3>
      <p class="canteen-name">${item.canteen}</p>
      <div class="price-row">
        <span class="price">Rs. ${item.price}</span>
        <button class="add-btn">Add</button>
      </div>
    `;
    container.appendChild(card);
  });

  renderPagination(items.length, page);
}

//PAGINATION FUNCTION
function renderPagination(totalItems, currentPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "page-btn" + (i === currentPage ? " active" : "");
    btn.addEventListener("click", () => {
      currentPage = i;
      filterCategory(currentCategory, currentPage);
    });
    paginationContainer.appendChild(btn);
  }
}

//FILTER FUNCTION
function filterCategory(category, page = 1) {
  currentCategory = category;
  currentPage = page;

  let items;
  if (category === "all") {
    items = data.food;
  } else {
    items = data.food.filter(item => item.category === category);
  }
  generateFoodCards("food-grid", items, page);
}

// INIT LOAD
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("food-grid")) {
    filterCategory("all", 1);

   
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        filterCategory(btn.dataset.category, 1);

       
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }
});
