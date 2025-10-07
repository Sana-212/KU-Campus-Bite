let canteens = [];
let currentPage = 1;
const itemsPerPage = 10;

async function fetchCanteens() {
  try {
    const res = await fetch("http://localhost:5000/api/canteen");
    const data = await res.json();

    if (data.success) {
      canteens = data.canteens.map(c => ({
        _id: c._id,
        name: c.name,
        img: c.image || "../images/canteen_img/default.jpg",
        rating: Math.floor(Math.random() * 3) + 3,
        location: c.location || "Not provided",
        link: `../canteens/${c.slug || c._id}.html`
      }));

      renderCanteens();
      renderPagination();
    } else {
      console.error("API returned error:", data.msg);
      const grid = document.getElementById("canteen-grid");
      grid.innerHTML = `<p class="error">Unable to load canteens.</p>`;
    }
  } catch (err) {
    console.error("Error fetching canteens:", err);
    const grid = document.getElementById("canteen-grid");
    grid.innerHTML = `<p class="error">Unable to load canteens. (${err.message})</p>`;
  }
}

function stars(r) {
  const full = Math.floor(r);
  const half = (r % 1 >= 0.5) ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

function renderCanteens() {
  const grid = document.getElementById("canteen-grid");
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const canteensToShow = canteens.slice(startIndex, endIndex);

  grid.innerHTML = canteensToShow.map(c => `
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-side flip-front">
          <img src="${c.img}" alt="${c.name}">
          <h3>${c.name}</h3>
          <div class="stars">${stars(c.rating)}</div>
        </div>
        <div class="flip-side flip-back">
          <p class="pin"><i class="fa fa-location-dot" id="pin"></i> ${c.location || ""}</p>
          <img src="${c.img}" alt="${c.name}" class="mobile-img">
          <h3 class="mobile-title">${c.name}</h3>
          <div class="stars mobile-stars">${stars(c.rating)}</div>
          <div class="btn-row">
            <a href="../CanteenDetail/CanteenDetail.html?canteenId=${c._id}&canteenName=${encodeURIComponent(c.name)}&location=${encodeURIComponent(c.location)}&image=${encodeURIComponent(c.img)}">View Menu</a>
            <a href="https://maps.google.com/?q=${encodeURIComponent(c.name + ' Karachi University')}" target="_blank">Map</a>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  setupFlipBehavior();
  mergeFlipCardsForMobile();
}

function renderPagination() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const pageNumbersContainer = document.getElementById("page-numbers");

  pageNumbersContainer.innerHTML = "";
  const totalPages = Math.ceil(canteens.length / itemsPerPage) || 1;

  if (totalPages <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    pageNumbersContainer.style.display = "none";
    return;
  } else {
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
    pageNumbersContainer.style.display = "flex";
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("span");
    pageBtn.classList.add("page-number");
    if (i === currentPage) pageBtn.classList.add("active");
    pageBtn.textContent = i;
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderCanteens();
      renderPagination();
    });
    pageNumbersContainer.appendChild(pageBtn);
  }

  prevBtn.disabled = (currentPage === 1);
  nextBtn.disabled = (currentPage === totalPages);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchCanteens();
});

window.addEventListener("resize", mergeFlipCardsForMobile);

function setupFlipBehavior() {
  const grid = document.getElementById("canteen-grid");
  const isDesktop = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  grid.querySelectorAll(".flip-card").forEach(card => {
    card.onclick = e => {
      if (e.target.tagName.toLowerCase() === "a") return;
      if (isDesktop) card.classList.toggle("flipped");
    };
  });
}

function mergeFlipCardsForMobile() {
  const isMobile = window.innerWidth <= 700;
  document.querySelectorAll(".flip-card").forEach(card => {
    const front = card.querySelector(".flip-front");
    const back = card.querySelector(".flip-back");

    if (isMobile) {
      if (!back.querySelector(".merged-content")) {
        const merged = document.createElement("div");
        merged.classList.add("merged-content");
        merged.innerHTML = front.innerHTML;
        back.prepend(merged);
      }
      front.style.display = "none";
      card.querySelector(".flip-card-inner").style.transform = "none";
      card.querySelector(".flip-card-inner").style.transition = "none";
      card.style.cursor = "default";
    } else {
      front.style.display = "";
      const merged = back.querySelector(".merged-content");
      if (merged) merged.remove();
      card.querySelector(".flip-card-inner").style.transform = "";
      card.querySelector(".flip-card-inner").style.transition = "";
      card.style.cursor = "pointer";
    }
  });
}

