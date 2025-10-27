const BACKEND_BASE_URL = "https://ku-campus-bite-i82kfe4eb-sanas-projects-0847f4e8.vercel.app/"

function getToken() {
  const token = localStorage.getItem("token");
  return token ? token : null;
}

async function updateAdminName() {
  const token = getToken();
  const nameEl = document.getElementById("adminName");
  if (!nameEl || !token) return;

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Auth/me failed:", res.status, errorText);
      nameEl.textContent = "Admin";
      return;
    }

    const data = await res.json();
    nameEl.textContent = data.success ? data.user.name : "Admin";
  } catch (err) {
    console.error("Error fetching user profile", err);
    nameEl.textContent = "Admin";
  }
}


// ---------------- Fetch Dashboard Data ----------------
async function fetchDashboardData() {
  const token = getToken();
 // if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/dashboard`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // ✅ add token
      }
    });

    const data = await res.json();
    return data.success ? data.finalData : null;
  } catch (err) {
    console.error("Fetch Dashboard Error:", err);
    return null;
  }
}


// ---------------- Update Dashboard Cards ----------------
async function updateCards() {
  const data = await fetchDashboardData();
  if (!data) return;

  document.querySelector(".card.green p").textContent = `Rs ${data.todaysRevenue}`;
  document.querySelector(".card.blue p").textContent = data.todaysTotalOrders;
  document.querySelector(".card.purple p").textContent = `Rs ${data.monthlyRevenue}`;
  document.querySelector(".card.red p").textContent = data.monthlyOrders;
}

// ---------------- Charts ----------------
async function renderCharts() {
  const data = await fetchDashboardData();
  if (!data) return;

  // --- Donut Chart (Sales by Category) ---
  const categories = data.salesByCategories.map(c => c._id);
  const categoryRevenue = data.salesByCategories.map(c => c.totalRevenue);

  if (document.getElementById("donutChart")) {
    const ctxDonut = document.getElementById("donutChart").getContext("2d");
    new Chart(ctxDonut, {
      type: "doughnut",
      data: {
        labels: categories,
        datasets: [{
          data: categoryRevenue,
          backgroundColor: ["#690316", "#d4626fff", "#b3959cff", "#C41F32", "#dcafac", "#dcd3d6"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: { boxWidth: 15, padding: 15 }
          }
        }
      }
    });
  }

  // --- Bar Chart (Orders per day in last 7 days) ---
  const labels = data.ordersPerDayChart.map(d => d._id);
  const values = data.ordersPerDayChart.map(d => d.count);

  if (document.getElementById("barChart")) {
    const ctxBar = document.getElementById("barChart").getContext("2d");
    new Chart(ctxBar, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Orders",
          data: values,
          backgroundColor: "#911120"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

// ---------------- Initialize Dashboard ----------------
document.addEventListener("DOMContentLoaded", () => {
  updateAdminName();
  updateCards();
  renderCharts();
});
