// // ==========================
// // Global Function: Go Back
// // ==========================
// function goBack() {
//   window.history.back();
// }

// // ==========================
// // Fetch Orders (Dynamic Source)
// // ==========================
// // In real case, replace this with a backend API call
// async function fetchOrders() {
//   try {
//     // Try to load orders from localStorage
//     let data = localStorage.getItem("orders");

//     if (data) {
//       return JSON.parse(data); // ✅ Load saved orders
//     } else {
//       // ✅ Dummy fallback orders
//       const defaultOrders = [
//         { id: "ORD001", customer: "Ali Khan", date: "2025-09-10", time: "12:30 PM", total: "Rs. 1200" },
//         { id: "ORD002", customer: "Sara Ahmed", date: "2025-09-11", time: "02:15 PM", total: "Rs. 800" },
//         { id: "ORD003", customer: "Bilal Hussain", date: "2025-09-12", time: "01:05 PM", total: "Rs. 1500" },
//         { id: "ORD004", customer: "Fatima Noor", date: "2025-09-12", time: "03:20 PM", total: "Rs. 600" },
//         { id: "ORD005", customer: "Hassan Raza", date: "2025-09-12", time: "04:00 PM", total: "Rs. 950" },
//         { id: "ORD006", customer: "Ayesha Malik", date: "2025-09-13", time: "10:45 AM", total: "Rs. 2200" },
//         { id: "ORD007", customer: "Usman Tariq", date: "2025-09-13", time: "01:30 PM", total: "Rs. 700" }
//       ];

//       // Save defaults into localStorage
//       localStorage.setItem("orders", JSON.stringify(defaultOrders));
//       return defaultOrders;
//     }
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return [];
//   }
// }

// // ==========================
// // Function: Load Orders into Table
// // ==========================
// function loadOrders(data) {
//   const orderBody = document.getElementById("orderBody");
//   orderBody.innerHTML = ""; // Clear old rows

//   if (data.length === 0) {
//     orderBody.innerHTML = `
//       <tr>
//         <td colspan="5" style="text-align:center; color:#999; padding: 15px;">
//           No orders found
//         </td>
//       </tr>`;
//     return;
//   }

//   data.forEach(order => {
//     const row = document.createElement("tr");
//     row.innerHTML = `
//       <td>${order.id}</td>
//       <td>${order.customer}</td>
//       <td>${order.date}</td>
//       <td>${order.time}</td>
//       <td>${order.total}</td>
//     `;
//     orderBody.appendChild(row);
//   });
// }

// // ==========================
// // Function: Search Orders
// // ==========================
// function searchOrders(allOrders) {
//   const query = document.getElementById("searchInput").value.toLowerCase();

//   const filtered = allOrders.filter(order =>
//     order.id.toLowerCase().includes(query) ||
//     order.customer.toLowerCase().includes(query) ||
//     order.date.toLowerCase().includes(query) ||
//     order.time.toLowerCase().includes(query) ||
//     order.total.toLowerCase().includes(query)
//   );

//   loadOrders(filtered);
// }

// // ==========================
// // Page Initialization
// // ==========================
// document.addEventListener("DOMContentLoaded", async () => {
//   const orders = await fetchOrders(); // ✅ load dynamically

//   loadOrders(orders);

//   // Search Button Click
//   document.getElementById("searchBtn").addEventListener("click", () => searchOrders(orders));

//   // Search on Enter Key
//   document.getElementById("searchInput").addEventListener("keyup", (e) => {
//     if (e.key === "Enter") {
//       searchOrders(orders);
//     }
//   });
// });





// ==========================
// Global Function: Go Back
// ==========================
function goBack() {
  window.history.back();
}

// ==========================
// Fetch Orders from API
// ==========================
async function fetchOrdersFromAPI(search = "") {
  try {
const res = await fetch(`http://localhost:5000/api/dashboard/order?search=${encodeURIComponent(search)}`);

    const data = await res.json();
console.log("Orders from API:", data.orders); // 👈 Add this
    if (data.success) {
      return data.orders || [];
    } else {
      console.error("Failed to fetch orders:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// ==========================
// Function: Load Orders into Table
// ==========================
function loadOrders(data) {
  const orderBody = document.getElementById("orderBody");
  orderBody.innerHTML = ""; // Clear old rows

  if (!data || data.length === 0) {
    orderBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color:#999; padding: 15px;">
          No orders found
        </td>
      </tr>`;
    return;
  }

  data.forEach(order => {
    const row = document.createElement("tr");
    row.innerHTML = `
  <td>${order._id}</td>
  <td>${order.userId}</td> <!-- replace with populated user name if backend supports -->
  <td>${order.placedAt ? new Date(order.placedAt).toLocaleDateString() : "N/A"}</td>
  <td>${order.placedAt ? new Date(order.placedAt).toLocaleTimeString() : "N/A"}</td>
  <td>${order.totalAmount || "N/A"}</td>
`;

    orderBody.appendChild(row);
  });
}

// ==========================
// Function: Search Orders
// ==========================
async function searchOrders() {
  const query = document.getElementById("searchInput").value.trim();
  const orders = await fetchOrdersFromAPI(query);
  loadOrders(orders);
}

// ==========================
// Page Initialization
// ==========================
document.addEventListener("DOMContentLoaded", async () => {
  const orders = await fetchOrdersFromAPI(); // initial load
  loadOrders(orders);

  // Search Button Click
  document.getElementById("searchBtn").addEventListener("click", searchOrders);

  // Search on Enter Key
  document.getElementById("searchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") searchOrders();
  });
});
