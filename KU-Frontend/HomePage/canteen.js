const BACKEND_BASE_URL = "http://localhost:5000";

async function fetchCanteens() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/canteen`); // Ensure API call uses the base URL
    const data = await res.json();

    if (data.success) {
      return data.canteens.map((c) => {
        let relativeImagePath = c.image || "../images/canteen_img/default.jpg";
        let absoluteImageUrl = relativeImagePath;

        if (
          relativeImagePath &&
          !relativeImagePath.startsWith("http") &&
          !relativeImagePath.startsWith("data:") &&
          !relativeImagePath.startsWith("../")
        ) {
          absoluteImageUrl = `${BACKEND_BASE_URL}/${
            relativeImagePath.startsWith("/")
              ? relativeImagePath.substring(1)
              : relativeImagePath
          }`;
        }

        return {
          _id: c._id,
          name: c.name,
          img: absoluteImageUrl, 
          rating: Math.floor(Math.random() * 3) + 3,
          location: c.location,
          link: `../canteens/${c.slug}.html`,
        };
      });
    } else {
      console.error("API returned error:", data.msg);
      return [];
    }
  } catch (err) {
    console.error("Error fetching canteens:", err);
    return [];
  }
}

async function renderCanteens() {
  const grid = document.getElementById("canteen-grid");
  const canteens = await fetchCanteens();

  grid.innerHTML = canteens
    .map(
      (c) => `
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-side flip-front">
          <img src="${c.img}" alt="${c.name}">
          <h3>${c.name}</h3>
          <div class="stars">${stars(c.rating)}</div>
        </div>
        <div class="flip-side flip-back">
          <p class="pin"><i class="fa fa-location-dot" id="pin"></i> ${
            c.location
          }</p>
          <img src="${c.img}" alt="${c.name}" class="mobile-img">
          <h3 class="mobile-title">${c.name}</h3>
          <div class="stars mobile-stars">${stars(c.rating)}</div>
         
           <div class="btn-row">
  <a href="../CanteenDetail/CanteenDetail.html?canteenId=${
    c._id
  }&canteenName=${encodeURIComponent(c.name)}&location=${encodeURIComponent(
        c.location
      )}&image=${encodeURIComponent(c.img)}">View Menu</a>
  <a href="https://maps.google.com/?q=${encodeURIComponent(
    c.name + " Karachi University"
  )}" target="_blank">Map</a>
</div>

        
        </div>
      </div>
    </div>
  `
    )
    .join("");

  setupFlipBehavior();
  mergeFlipCardsForMobile();
}

document.addEventListener("DOMContentLoaded", renderCanteens);
function stars(r) {
  const full = Math.floor(r);
  const half = r % 1 >= 0.5 ? 1 : 0;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - half);
}

function setupFlipBehavior() {
  const grid = document.getElementById("canteen-grid");
  const isDesktop = window.matchMedia(
    "(hover:hover) and (pointer:fine)"
  ).matches;

  grid.querySelectorAll(".flip-card").forEach((card) => {
    card.onclick = (e) => {
      if (e.target.tagName.toLowerCase() === "a") return;
      if (isDesktop) card.classList.toggle("flipped");
    };
  });
}

function mergeFlipCardsForMobile() {
  const isMobile = window.innerWidth <= 700;
  document.querySelectorAll(".flip-card").forEach((card) => {
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
function setupSlider() {
  const grid = document.getElementById("canteen-grid");
  const leftBtn = document.getElementById("slide-left");
  const rightBtn = document.getElementById("slide-right");

  if (!grid || !leftBtn || !rightBtn) return;
  const scrollAmount = grid.clientWidth * 0.8;

  leftBtn.addEventListener("click", () => {
    grid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    grid.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCanteens().then(setupSlider);
});

document.addEventListener("DOMContentLoaded", renderCanteens);
window.addEventListener("resize", mergeFlipCardsForMobile);
