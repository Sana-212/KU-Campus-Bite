const BACKEND_BASE_URL = "https://ku-campus-bite-i82kfe4eb-sanas-projects-0847f4e8.vercel.app"

function goBack() {
  window.history.back();
}

// ==========================
// Fetch Orders from API
// ==========================
async function fetchOrdersFromAPI(search = "") {
  try {
const res = await fetch(`${BACKEND_BASE_URL}/api/dashboard/order?search=${encodeURIComponent(search)}`);

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
