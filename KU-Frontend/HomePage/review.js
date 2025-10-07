function $(id) {
  return document.getElementById(id);
}

const toggleReview = $("toggleReview");
const reviewForm = $("reviewForm");
const chev = $("chev");
const reviewsList = $("reviewsList");

function loadReviews() {
  if (!reviewsList) return;

  const canteenName = $("canteenName")?.textContent || "Unknown Canteen";
  const allReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  const reviews = allReviews.filter(r => r.canteen === canteenName);

  reviewsList.innerHTML = "<h3>Reviews</h3>";

  if (reviews.length === 0) {
    reviewsList.innerHTML += "<p>No reviews yet. Be the first!</p>";
    return;
  }

  reviews.forEach(r => {
    const div = document.createElement("div");
    div.className = "review-card";
    div.innerHTML = `
      <strong>${r.name}</strong>
      <span>${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
      <p>${r.text}</p>
      <small>${new Date(r.at).toLocaleString()}</small>
    `;
    reviewsList.appendChild(div);
  });
}
if (toggleReview) {
  toggleReview.addEventListener("click", () => {
    reviewForm.classList.toggle("open");
    chev.classList.toggle("open");
    toggleReview.setAttribute(
      "aria-expanded",
      String(reviewForm.classList.contains("open"))
    );

    loadReviews();
  });
}
const reviewBtn = $("reviewBtn");
const reviewContainer = document.querySelector(".review-container");
const starsBox = $("stars");
const reviewer = $("reviewer");
const reviewText = $("reviewText");
const submitReview = $("submitReview");
const cancelReview = $("cancelReview");

let currentRating = 0;

if (starsBox) {
  starsBox.addEventListener("mouseover", e => {
    if (!e.target.classList.contains("star")) return;
    [...starsBox.children].forEach(s => {
      s.classList.toggle("active", +s.dataset.v <= +e.target.dataset.v);
    });
  });

  starsBox.addEventListener("mouseleave", () => {
    [...starsBox.children].forEach(s => {
      s.classList.toggle("active", +s.dataset.v <= currentRating);
    });
  });

  starsBox.addEventListener("click", e => {
    if (!e.target.classList.contains("star")) return;
    currentRating = +e.target.dataset.v;
    [...starsBox.children].forEach(s => {
      s.classList.toggle("active", +s.dataset.v <= currentRating);
    });
  });
}

if (reviewBtn) {
  reviewBtn.addEventListener("click", e => {
    e.preventDefault();
    reviewContainer.classList.add("open");
    reviewText?.focus();
  });
}

if (cancelReview) {
  cancelReview.addEventListener("click", () => {
    reviewContainer.classList.remove("open");
  });
}

if (submitReview) {
  submitReview.addEventListener("click", () => {
    const name = reviewer?.value.trim() || "Anonymous";
    const text = reviewText?.value.trim();
    if (!text || text.length < 8) return alert("Review too short.");
    if (currentRating === 0) return alert("Please select a rating.");

    const canteenName = $("canteenName")?.textContent || "Unknown Canteen";

    const review = {
      canteen: canteenName,
      name,
      text,
      rating: currentRating,
      at: new Date().toISOString()
    };

    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    reviews.unshift(review);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    reviewer.value = "";
    reviewText.value = "";
    currentRating = 0;
    [...starsBox.children].forEach(s => s.classList.remove("active"));
    reviewContainer.classList.remove("open");

    loadReviews();
  });
}

loadReviews();
