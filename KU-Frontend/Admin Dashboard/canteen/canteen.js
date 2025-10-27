const BACKEND_BASE_URL = "https://ku-campus-bite-i82kfe4eb-sanas-projects-0847f4e8.vercel.app"

document.addEventListener("DOMContentLoaded", () => {
  const dashboardDiv = document.getElementById("");
  const manageDiv = document.getElementById("manageContainer");
  const ordersDiv = document.getElementById("canteenCards");

  const editModal = document.getElementById("editCanteenModal");
  const editMenuModal = document.getElementById("editMenuModal");

  let currentMenuItems = [];
  let currentPage = 1;
  const itemsPerPage = 20;

  // -------------------------
  // FETCH CANTEENS
  // -------------------------
  async function fetchCanteens() {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/dashboard/canteen`);
      const data = await res.json();
      console.log("Fetched Canteens:", data);

      if (data.success) {
        renderDashboard(data.canteensWithMenus);
        renderManage(data.canteensWithMenus);
      }
    } catch (err) {
      console.error("Error fetching canteens:", err);
    }
  }

  // -------------------------
  // FETCH ORDERS
  // -------------------------
  async function fetchOrders() {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/dashboard/canteen/orders`);
      const data = await res.json();
      if (data.success) {
        console.log("Orders Summary:", data.results);
        renderOrdersSummary(data.results);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }

  // -------------------------
  // RENDER DASHBOARD
  // -------------------------
  function renderDashboard(canteens) {
    if (!dashboardDiv) return;
    dashboardDiv.innerHTML = "";
    canteens.forEach(c => {
      const div = document.createElement("div");
      div.classList.add("canteen-card");
      div.innerHTML = `
        <h3>${c.name}</h3>
        <p>Today's Orders: ${c.todayOrders || 0}</p>
        <p>Revenue: Rs ${c.todayRevenue || 0}</p>
      `;
      dashboardDiv.appendChild(div);
    });
  }

  // -------------------------
  // RENDER MANAGE SECTION
  // -------------------------
  function renderManage(canteens) {
    if (!manageDiv) return;
    manageDiv.innerHTML = "";

    canteens.forEach(canteen => {
      const div = document.createElement("div");
      div.classList.add("canteen-item");
      div.innerHTML = `
        <h3>${canteen.name}</h3>
        <p>Menu Items: ${canteen.menuItems.length}</p>
        <button class="btn canteen-item-button" onclick="openEditCanteen('${canteen._id}')">Edit</button>
        <button class="btn canteen-item-button" onclick="deleteCanteen('${canteen._id}')">Delete</button>
      `;
      manageDiv.appendChild(div);
    });
  }

  // -------------------------
  // RENDER ORDERS SUMMARY
  // -------------------------
  function renderOrdersSummary(orders) {
    if (!ordersDiv) return;
    ordersDiv.innerHTML = "";

    orders.forEach(order => {
      const div = document.createElement("div");
      div.classList.add("canteen-card");
      div.innerHTML = `
        <h4>${order.canteenName}</h4>
        <p>Total Orders: ${order.totalOrders}</p>
        <p>Total Revenue: Rs ${order.totalRevenue}</p>
      `;
      ordersDiv.appendChild(div);
    });
  }

  // -------------------------
  // ADD CANTEEN
  // -------------------------
  window.addCanteenPrompt = async () => {
    const name = prompt("Canteen Name:");
    const location = prompt("Location:");
    const contactNumber = prompt("Contact Number:");
    if (!name || !location || !contactNumber) return alert("All fields required!");

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/dashboard/canteen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, contactNumber })
      });
      const data = await res.json();
      if (data.success) alert("Canteen added!");
      fetchCanteens();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------
  // DELETE CANTEEN
  // -------------------------
  window.deleteCanteen = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/dashboard/canteen/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchCanteens();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------
  // EDIT CANTEEN & MENU ITEMS
  // -------------------------
  window.openEditCanteen = async (canteenId) => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/dashboard/canteen`);
      const data = await res.json();
      if (!data.success) return alert("Failed to load data");

      const canteen = data.canteensWithMenus.find(c => c._id === canteenId);
      if (!canteen) return alert("Canteen not found");

      document.getElementById("canteenId").value = canteen._id;
      document.getElementById("canteenName").value = canteen.name;
      document.getElementById("canteenLocation").value = canteen.location || "";
      document.getElementById("canteenContact").value = canteen.contactNumber || "";

      const menuContainer = document.getElementById("menuItemsContainer");
      menuContainer.innerHTML = "";

      const actionsDiv = document.createElement("div");
      actionsDiv.classList.add("canteen-card");
      actionsDiv.innerHTML = `
        <button type="button" onclick="openEditMenu('${canteenId}')">Edit Menu Items</button>
      `;
      menuContainer.appendChild(actionsDiv);

      editModal.style.display = "block";
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------
  // OPEN MENU EDIT MODAL
  // -------------------------
  window.openEditMenu = async (canteenId) => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/dashboard/canteen`);
      const data = await res.json();
      if (!data.success) return alert("Failed to load menu");

      const canteen = data.canteensWithMenus.find(c => c._id === canteenId);
      if (!canteen) return alert("Canteen not found");

      currentMenuItems = canteen.menuItems;
      currentPage = 1;
      renderMenuPage();
      editMenuModal.style.display = "block";
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------
  // PAGINATED MENU RENDER
  // -------------------------
  function renderMenuPage() {
    const container = document.getElementById("menuPaginationContainer");
    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = currentMenuItems.slice(start, start + itemsPerPage);

    pageItems.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("menu-item");
      div.innerHTML = `
        <input type="hidden" class="menuId" value="${item._id}">
        <input type="text" class="menuName" value="${item.name}" placeholder="Menu Name">
        <input type="number" class="menuPrice" value="${item.price}" placeholder="Price">
        <input type="text" class="menuCategory" value="${item.category || ''}" placeholder="Category">
        <select class="menuAvailable">
          <option value="true" ${item.available ? "selected" : ""}>Available</option>
          <option value="false" ${!item.available ? "selected" : ""}>Unavailable</option>
        </select>
      `;
      container.appendChild(div);
    });

    const totalPages = Math.ceil(currentMenuItems.length / itemsPerPage);
    const paginationDiv = document.createElement("div");
    paginationDiv.innerHTML = `
      <button ${currentPage === 1 ? "disabled" : ""} onclick="prevPage()">Prev</button>
      Page ${currentPage} of ${totalPages}
      <button ${currentPage === totalPages ? "disabled" : ""} onclick="nextPage()">Next</button>
      <button onclick="addMenuItem()">Add New Item</button>
      <button onclick="saveMenuPage()">Save Changes</button>
    `;
    container.appendChild(paginationDiv);
  }

  window.nextPage = () => {
    if ((currentPage * itemsPerPage) < currentMenuItems.length) {
      currentPage++;
      renderMenuPage();
    }
  };

  window.prevPage = () => {
    if (currentPage > 1) {
      currentPage--;
      renderMenuPage();
    }
  };

  // -------------------------
  // ADD MENU ITEM INPUT
  // -------------------------
  window.addMenuItem = () => {
    const container = document.getElementById("menuPaginationContainer");
    const div = document.createElement("div");
    div.classList.add("menu-item");
    div.innerHTML = `
      <input type="hidden" class="menuId" value="">
      <input type="text" class="menuName" placeholder="Menu Name">
      <input type="number" class="menuPrice" placeholder="Price">
      <input type="text" class="menuCategory" placeholder="Category">
      <select class="menuAvailable">
        <option value="true" selected>Available</option>
        <option value="false">Unavailable</option>
      </select>
      <button type="button" onclick="removeMenuItemInput(this)">Remove</button>
    `;
    container.appendChild(div);
  };

  window.removeMenuItemInput = (btn) => btn.parentElement.remove();
  window.closeEditModal = () => (editModal.style.display = "none");
  window.closeEditMenu = () => (editMenuModal.style.display = "none");


window.saveMenuPage = async () => {
  const canteenId = document.getElementById("canteenId").value;
  if (!canteenId) return alert("Canteen ID missing!");

  const menuDivs = Array.from(document.querySelectorAll("#menuPaginationContainer .menu-item"));
  let hasError = false;

  for (let div of menuDivs) {
    const menuId = div.querySelector(".menuId")?.value || null;
    const menuName = div.querySelector(".menuName")?.value.trim();
    const menuPrice = parseFloat(div.querySelector(".menuPrice")?.value);
    const menuCategory = div.querySelector(".menuCategory")?.value.trim() || "";

    // Fix 1️⃣ — ensure boolean not string
    const availableValue = div.querySelector(".menuAvailable")?.value;
    const available = availableValue === "true" || availableValue === true;

    if (!menuName || isNaN(menuPrice)) continue;

    try {
      const url = menuId
        ? `${BACKEND_BASE_URL}/api/dashboard/canteen/${canteenId}/menuItems/${menuId}`
        : `${BACKEND_BASE_URL}/api/dashboard/canteen/${canteenId}/menuItems`;

      const method = menuId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: menuName, price: menuPrice, category: menuCategory, available })
      });

      const data = await res.json();

      if (!data.success) {
        console.error("Failed to save menu item:", data);
        hasError = true;
      } else {
        // Fix 2️⃣ — handle any backend key name
        // const savedItem = data.menuItem || data.menu || data.item || data.data || null;

        const savedItem = data.menuItem || data.menu || data.item || data.data || data.updatedMenuItem || null;

        if (savedItem && savedItem._id) {
          div.querySelector(".menuId").value = savedItem._id;
        } else {
          console.warn("No _id returned for menu item:", data);
        }
      }
    } catch (err) {
      console.error("Error saving menu item:", err);
      hasError = true;
    }
  }

  if (hasError) alert("Some menu items could not be saved. Check console.");
  else alert("All menu items saved successfully!");

  await openEditMenu(canteenId);
  fetchCanteens();
  fetchOrders();
};


  // -------------------------
  // MANAGE SECTION TOGGLE
  // -------------------------
  window.goBack = () => {
    document.getElementById("canteenCards").style.display = "grid";
    document.getElementById("manageSection").style.display = "none";
  };
  window.openManage = () => {
    document.getElementById("canteenCards").style.display = "none";
    document.getElementById("manageSection").style.display = "block";
  };

  // -------------------------
  // INITIAL LOAD
  // -------------------------
  fetchCanteens();
  fetchOrders();
});
