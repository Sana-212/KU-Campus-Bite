const canteens = [
  { name: "Al-Qasmia Shahid Canteen", img: "image.jpeg", rating: 4, link: "../canteens/al_qasima_shahid_canteen.html" },
  { name: "Neelum Canteen", img: "img1.jpg", rating: 5, link: "../canteens/neelum_canteen.html" },
  { name: "Safeer Canteen", img: "login-bg.jpeg", rating: 4, link: "../canteens/cafe_safeer.html" },
  { name: "Terminal Canteen", img: "medium-vecteezy_banner-with-fast-food-copy-space-background_22148349_medium.jpg", rating: 3, link: "../canteens/terminal_canteen.html" },
  { name: "MMS Canteen", img: "WhatsApp Image 2025-08-27 at 12.24.41 PM.jpeg", rating: 4, link: "../canteens/mms_canteen.html" },
   { name: "Mashallah Canteen", img: "../images/canteen_img/TikkaBiryani.jpeg", rating: 5, link: "../canteens/chemistry_canteen.html" },
  { name: "BS Food Center", img: "../images/canteen_img/Lasagna.jpg", rating: 4, link: "../canteens/bs_food_canteen.html" },
  { name: "Student Star Canteen", img: "../images/canteen_img/Pizza Fries.jpg", rating: 4, link: "../canteens/student_star_canteen.html" },
  { name: "Nizamiyan Canteen", img: "../images/canteen_img/Sandwich2.jpg", rating: 3, link: "../canteens/nizamiyan_canteen.html" },
  { name: "Kasim Samosa", img: "/images/canteen_img/Samosa.jpg", rating: 5, link: "../canteens/kasim_samosa_canteen.html" },
  { name: "Nazeer Chat House", img: "../images/canteen_img/chaat.jpeg", rating: 4, link: "../canteens/nazeer_chart_house.html" },
  { name: "Abdullah Canteen", img: "../images/canteen_img/Macroni.jpg", rating: 3, link: "../canteens/abdullah_canteen.html" },
  { name: "DMS Canteen", img: "../images/canteen_img/Fried Rice.jpg", rating: 4, link: "../canteens/cafe_jamia.html" },
  { name: "Taha Canteen", img: "../images/canteen_img/Kabab.jpg", rating: 4, link: "../canteens/taha_canteen_kubs.html" },
  { name: "Baba Khan Canteen", img: "../images/canteen_img/HakaNoodles.jpg", rating: 5, link: "../canteens/baba_khan_canteen.html" },
  { name: "Pharmacy Canteen", img: "../images/canteen_img/Spring Roll.jpg", rating: 4, link: "../canteens/pharmacy_canteen.html" },
  { name: "Cafe Safeer", img: "../images/canteen_img/Beef Biryani.jpeg", rating: 5, link: "../canteens/cafe_safeer.html" },
  { name: "RC Canteen", img: "../images/canteen_img/Pizza.jpg", rating: 3, link: "../canteens/rangers_canteen.html" },
  { name: "Café Ashna Raheel", img: "../images/canteen_img/Taco.jpeg", rating: 4, link: "../canteens/cafe_ashna_raheel.html" },
  { name: "Mass Communication Canteen", img: "../images/canteen_img/Roll.jpeg", rating: 5, link: "../canteens/mass_communication_canteen.html" }
  
];

function stars(r){
  const full = Math.floor(r);
  const half = (r % 1 >= 0.5) ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

function renderCanteens() {
  const grid = document.getElementById('canteen-grid');
  grid.innerHTML = canteens.map(c => `
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-side flip-front">
          <img src="${c.img}" alt="${c.name}">
          <h3>${c.name}</h3>
          <div class="stars">${stars(c.rating)}</div>
        </div>
        <div class="flip-side flip-back">
         <p class="pin"><i class="fa fa-location-dot" id="pin"></i> ${c.location}</p>
          <img src="${c.img}" alt="${c.name}" class="mobile-img">
          <h3 class="mobile-title">${c.name}</h3>
          <div class="stars mobile-stars">${stars(c.rating)}</div>
          <div class="btn-row">
            <a href="${c.link}">View Menu</a>
            <a href="https://maps.google.com/?q=${encodeURIComponent(c.name + ' Karachi University')}" target="_blank">Map</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  setupFlipBehavior();
  mergeFlipCardsForMobile();
}

function setupFlipBehavior() {
  const grid = document.getElementById('canteen-grid');
  const isDesktop = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  grid.querySelectorAll('.flip-card').forEach(card => {
    card.onclick = e => {
      if (e.target.tagName.toLowerCase() === 'a') return;
      if (isDesktop) card.classList.toggle('flipped');
    };
  });
}

function mergeFlipCardsForMobile() {
  const isMobile = window.innerWidth <= 700;
  document.querySelectorAll('.flip-card').forEach(card => {
    const front = card.querySelector('.flip-front');
    const back = card.querySelector('.flip-back');

    if (isMobile) {
      if (!back.querySelector('.merged-content')) {
        const merged = document.createElement('div');
        merged.classList.add('merged-content');
        merged.innerHTML = front.innerHTML;
        back.prepend(merged);
      }
      front.style.display = 'none';
      card.querySelector('.flip-card-inner').style.transform = 'none';
      card.querySelector('.flip-card-inner').style.transition = 'none';
      card.style.cursor = 'default';
    } else {
      front.style.display = '';
      const merged = back.querySelector('.merged-content');
      if (merged) merged.remove();
      card.querySelector('.flip-card-inner').style.transform = '';
      card.querySelector('.flip-card-inner').style.transition = '';
      card.style.cursor = 'pointer';
    }
  });
}


document.addEventListener('DOMContentLoaded', renderCanteens);
window.addEventListener('resize', mergeFlipCardsForMobile);


const grid = document.getElementById("canteen-grid");
document.getElementById("slide-left").addEventListener("click", () => {
  grid.scrollBy({ left: -300, behavior: "smooth" });
});
document.getElementById("slide-right").addEventListener("click", () => {
  grid.scrollBy({ left: 300, behavior: "smooth" });
});

