// // =================== BACK BUTTON ===================
// function goBack() {
//   window.history.back();
// }

// // =================== SAMPLE DYNAMIC DATA ===================
// const reportData = [
//   { canteen: "Al-Qasmia", orders: 40, revenue: 15000 },
//   { canteen: "Science", orders: 30, revenue: 10500 },
//   { canteen: "Chemistry", orders: 25, revenue: 8000 },
//   { canteen: "Arts", orders: 25, revenue: 11500 },
//   { canteen: "Math", orders: 20, revenue: 9000 },
//   { canteen: "Engineering", orders: 15, revenue: 7500 },
//   { canteen: "Library", orders: 12, revenue: 6000 },
//   { canteen: "Medical", orders: 10, revenue: 5000 },
//   { canteen: "Cafe 1", orders: 8, revenue: 4000 },
//   { canteen: "Cafe 2", orders: 5, revenue: 3000 },
// ];

// // =================== DYNAMIC SUMMARY CARDS ===================
// function renderSummary() {
//   const summaryContainer = document.getElementById("summaryCards");
//   summaryContainer.innerHTML = "";

//   const totalOrders = reportData.reduce((sum, c) => sum + c.orders, 0);
//   const totalRevenue = reportData.reduce((sum, c) => sum + c.revenue, 0);

//   const topCanteen = reportData.reduce((prev, current) =>
//     current.orders > prev.orders ? current : prev
//   );

//   const summaries = [
//     { title: "Total Orders", value: totalOrders },
//     { title: "Total Revenue", value: `Rs ${totalRevenue.toLocaleString()}` },
//     { title: "Top Canteen", value: `${topCanteen.canteen} Canteen` },
//   ];

//   summaries.forEach(item => {
//     const card = document.createElement("div");
//     card.className = "summary-card";
//     card.innerHTML = `<h3>${item.title}</h3><p>${item.value}</p>`;
//     summaryContainer.appendChild(card);
//   });
// }

// // =================== DYNAMIC TABLE ===================
// function renderTable() {
//   const tbody = document.getElementById("salesTableBody");
//   tbody.innerHTML = "";

//   reportData.forEach((c, index) => {
//     const tr = document.createElement("tr");
//     tr.innerHTML = `
//       <td>${index + 1}</td>
//       <td>${c.canteen} Canteen</td>
//       <td>${c.orders}</td>
//       <td>Rs ${c.revenue.toLocaleString()}</td>
//     `;
//     tbody.appendChild(tr);
//   });
// }

// // =================== DYNAMIC CHARTS ===================
// function createBarChart(canvasId, label, data, color, stepSize) {
//   const ctx = document.getElementById(canvasId);
//   if (!ctx) return;

//   new Chart(ctx, {
//     type: "bar",
//     data: {
//       labels: reportData.map(c => c.canteen),
//       datasets: [{
//         label: label,
//         data: data,
//         backgroundColor: color
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       scales: {
//         y: {
//           beginAtZero: true,
//           ticks: { stepSize, color: "#000", font: { size: 9 } },
//           grid: { color: "#ddd" }
//         },
//         x: {
//           ticks: { autoSkip: false, maxRotation: 45, minRotation: 45, color: "#000", font: { size: 9 }, padding: 15 },
//           grid: { color: "#ddd" }
//         }
//       },
//       plugins: {
//         legend: { display: false },
//         tooltip: { titleColor: "#000", bodyColor: "#000" }
//       }
//     }
//   });
// }

// // =================== INITIALIZE PAGE ===================
// window.onload = () => {
//   renderSummary();
//   renderTable();
//   createBarChart("ordersChart", "Orders", reportData.map(c => c.orders), "#911120", 5);
//   createBarChart("revenueChart", "Revenue (Rs)", reportData.map(c => c.revenue), "#dcafac", 5000);
// };



// =================== BACK BUTTON ===================
function goBack() {
  window.history.back();
}

// =================== FETCH REPORT DATA ===================
async function fetchReportData(duration = 30) {
  try {
    const res = await fetch(`http://localhost:5000/api/dashboard/report?duration=${duration}`);
    const data = await res.json();

    if (data.success) {
      return data.finalData;
    } else {
      console.error("Failed to fetch report data:", data);
      return null;
    }
  } catch (err) {
    console.error("Error fetching report data:", err);
    return null;
  }
}

// =================== DYNAMIC SUMMARY CARDS ===================
function renderSummary(finalData) {
  const summaryContainer = document.getElementById("summaryCards");
  summaryContainer.innerHTML = "";

  const summaries = [
    { title: "Total Orders", value: finalData.totalOrders },
    { title: "Total Revenue", value: `Rs ${finalData.totalRevenue.toLocaleString()}` },
    { title: "Top Canteen", value: `${finalData.topCanteenName} Canteen` },
  ];

  summaries.forEach(item => {
    const card = document.createElement("div");
    card.className = "summary-card";
    card.innerHTML = `<h3>${item.title}</h3><p>${item.value}</p>`;
    summaryContainer.appendChild(card);
  });
}

// =================== DYNAMIC TABLE ===================
function renderTable(canteenSalesOverview) {
  const tbody = document.getElementById("salesTableBody");
  tbody.innerHTML = "";

  canteenSalesOverview.forEach((c, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${c.canteenName} Canteen</td>
      <td>${c.totalOrders}</td>
      <td>Rs ${c.totalRevenue.toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

function createBarChart(canvasId, label, data, color) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  // Dynamically determine max value for Y-axis
  const values = data.map(c => label.includes("Revenue") ? c.totalRevenue : c.totalOrders);
  const maxValue = Math.max(...values);

  // Calculate a reasonable step size (10% of maxValue rounded)
  const stepSize = Math.ceil(maxValue / 5 / 10) * 10; // e.g., max 43 → step 10

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(c => c.canteenName),
      datasets: [{
        label: label,
        data: values,
        backgroundColor: color
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: Math.ceil(maxValue / stepSize) * stepSize, // round max up to nearest step
          ticks: {
            stepSize: stepSize,
            color: "#000",
            font: { size: 12 }
          },
          grid: { color: "#ddd" }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            color: "#000",
            font: { size: 12 },
            padding: 10
          },
          grid: { color: "#ddd" }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { titleColor: "#000", bodyColor: "#000" }
      }
    }
  });
}


// =================== INITIALIZE PAGE ===================
window.onload = async () => {
  const finalData = await fetchReportData(); // fetch from API
  if (!finalData) return;

  renderSummary(finalData);
  renderTable(finalData.canteenSalesOverview);
  createBarChart("ordersChart", "Orders", finalData.canteenSalesOverview, "#911120");
  createBarChart("revenueChart", "Revenue (Rs)", finalData.canteenSalesOverview, "#dcafac");
};
