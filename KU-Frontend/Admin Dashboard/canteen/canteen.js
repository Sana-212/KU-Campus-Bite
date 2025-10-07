
// document.addEventListener("DOMContentLoaded", () => {
//   const dashboardDiv = document.getElementById("canteenCards");
 
//   const editModal = document.getElementById("editCanteenModal");
//   const editMenuModal = document.getElementById("editMenuModal");

//   let currentMenuItems = [];
//   let currentPage = 1;
//   const itemsPerPage = 20;

// //   // -------------------------
// //   // FETCH CANTEENS
// //   // -------------------------
// //   async function fetchCanteens() {
// //     try {
// //       const res = await fetch("http://localhost:5000/api/dashboard/canteen");
// //       const data = await res.json();
// //       if (data.success) {
// //         renderDashboard(data.canteensWithMenus);
// //         renderManage(data.canteensWithMenus);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching canteens:", err);
// //     }
// //   }

// //   // -------------------------
// //   // FETCH ORDERS
// //   // -------------------------
// //   async function fetchOrders() {
// //     try {
// //       const res = await fetch("http://localhost:5000/api/dashboard/canteen/orders");
// //       const data = await res.json();
// //       if (data.success) renderOrdersSummary(data.results);
// //     } catch (err) {
// //       console.error("Error fetching orders:", err);
// //     }
// //   }

// //   // -------------------------
// //   // RENDER DASHBOARD
// //   // -------------------------
// //   function renderDashboard(canteens) {
// //     if (!dashboardDiv) return;
// //     dashboardDiv.innerHTML = "";
// //     canteens.forEach(c => {
// //       const div = document.createElement("div");
// //       div.classList.add("canteen-card");
// //       div.innerHTML = `
// //         <h3>${c.name}</h3>
// //         <p>Today's Orders: ${c.todayOrders || 0}</p>
// //         <p>Revenue: Rs ${c.todayRevenue || 0}</p>
// //       `;
// //       dashboardDiv.appendChild(div);
// //     });
// //   }


// //   // -------------------------
// // //   // Render orders summary
// // //   // -------------------------
// //   function renderOrdersSummary(orders) {
// //     if (!ordersDiv) return;
// //     ordersDiv.innerHTML = "";

// //     orders.forEach(order => {
// //       const div = document.createElement("div");
// //       div.classList.add("canteen-card");
// //       div.innerHTML = `
// //         <h4>${order.canteenName}</h4>
// //         <p>Total Orders: ${order.totalOrders}</p>
// //         <p>Total Revenue: Rs ${order.totalRevenue}</p>
// //       `;
// //       ordersDiv.appendChild(div);
// //     });
// //   }

// //   // -------------------------
// //   // RENDER MANAGE SECTION
// //   // -------------------------
// //   function renderManage(canteens) {
// //     if (!manageDiv) return;
// //     manageDiv.innerHTML = "";
// //     canteens.forEach(c => {
// //       const div = document.createElement("div");
// //       div.classList.add("manage-canteen-card");
// //       div.innerHTML = `
// //         <h3>${c.name}</h3>
// //         <p>Menu Items: ${c.menuItems.length}</p>
// //         <button onclick="openEditCanteen('${c._id}')">Edit Canteen</button>
// //         <button onclick="deleteCanteen('${c._id}')">Delete</button>
// //       `;
// //       manageDiv.appendChild(div);
// //     });
// //   }


//   const manageDiv = document.getElementById("manageContainer");
//   const ordersDiv = document.getElementById("canteenCards");

//   // -------------------------
//   // Fetch canteens and menus
//   // -------------------------
//   async function fetchCanteens() {
//     try {
//       const res = await fetch("http://localhost:5000/api/dashboard/canteen");
//       const data = await res.json();
//       console.log("Fetched Canteens:", data);

//       if (data.success) {
//         renderDashboard(data.canteensWithMenus);
//         renderManage(data.canteensWithMenus);
//       }
//     } catch (err) {
//       console.error("Error fetching canteens:", err);
//     }
//   }

//   // -------------------------
//   // Fetch today's orders
//   // -------------------------
//   async function fetchOrders() {
//     try {
//       const res = await fetch("http://localhost:5000/api/dashboard/canteen/orders");
//       const data = await res.json();
//       if (data.success) {
//         console.log("Orders Summary:", data.results);
//         renderOrdersSummary(data.results);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     }
//   }

//    // -------------------------
//   // Render manage section
//   // -------------------------
//   function renderManage(canteens) {
//     if (!manageDiv) return;
//     manageDiv.innerHTML = "";

//     canteens.forEach(canteen => {
//       const div = document.createElement("div");
//       div.classList.add("canteen-item");
//       div.innerHTML = `
//   <h3>${canteen.name}</h3>
//   <p>Menu Items: ${canteen.menuItems.length}</p>
//   <button class="btn canteen-item-button" onclick="openEditCanteen('${canteen._id}')">Edit</button>
//   <button class="btn canteen-item-button" onclick="deleteCanteen('${canteen._id}')">Delete</button>
// `;

//       manageDiv.appendChild(div);
//     });
//   }
//     // -------------------------
//   // Render orders summary
//   // -------------------------
//   function renderOrdersSummary(orders) {
//     if (!ordersDiv) return;
//     ordersDiv.innerHTML = "";

//     orders.forEach(order => {
//       const div = document.createElement("div");
//       div.classList.add("canteen-card");
//       div.innerHTML = `
//         <h4>${order.canteenName}</h4>
//         <p>Total Orders: ${order.totalOrders}</p>
//         <p>Total Revenue: Rs ${order.totalRevenue}</p>
//       `;
//       ordersDiv.appendChild(div);
//     });
//   }


// // -------------------------
//    // RENDER DASHBOARD
//   // -------------------------
//   function renderDashboard(canteens) {
//     // if (!dashboardDiv) return;
//     // dashboardDiv.innerHTML = "";
//     // canteens.forEach(c => {
//     //   const div = document.createElement("div");
//     //   div.classList.add("");
//     //   div.innerHTML = `
//     //     <h3>${c.name}</h3>
//     //     <p>Today's Orders: ${c.todayOrders || 0}</p>
//     //     <p>Revenue: Rs ${c.todayRevenue || 0}</p>
//     //   `;
//     //   dashboardDiv.appendChild(div);
//     // });
//   }

//   // -------------------------
//   // ADD CANTEEN
//   // -------------------------
//   window.addCanteenPrompt = async () => {
//     const name = prompt("Canteen Name:");
//     const location = prompt("Location:");
//     const contactNumber = prompt("Contact Number:");
//     if (!name || !location || !contactNumber) return alert("All fields required!");

//     try {
//       const res = await fetch("http://localhost:5000/api/dashboard/canteen", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, location, contactNumber })
//       });
//       const data = await res.json();
//       if (data.success) alert("Canteen added!");
//       fetchCanteens();
//     } catch (err) { console.error(err); }
//   };

//   // -------------------------
//   // DELETE CANTEEN
//   // -------------------------
//   window.deleteCanteen = async (id) => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/dashboard/canteen/${id}`, { method: "DELETE" });
//       const data = await res.json();
//       if (data.success) fetchCanteens();
//     } catch (err) { console.error(err); }
//   };

//   // -------------------------
//   // EDIT CANTEEN & MENU ITEMS
//   // -------------------------
//   window.openEditCanteen = async (canteenId) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/dashboard/canteen");
//       const data = await res.json();
//       if (!data.success) return alert("Failed to load data");

//       const canteen = data.canteensWithMenus.find(c => c._id === canteenId);
//       if (!canteen) return alert("Canteen not found");

//       document.getElementById("canteenId").value = canteen._id;
//       document.getElementById("canteenName").value = canteen.name;
//       document.getElementById("canteenLocation").value = canteen.location || "";
//       document.getElementById("canteenContact").value = canteen.contactNumber || "";

//       const menuContainer = document.getElementById("menuItemsContainer");
//       menuContainer.innerHTML = "";

//       // Add buttons: Add Menu + Edit Menu
//       const actionsDiv = document.createElement("div");
//        actionsDiv.classList.add("canteen-card");
//       actionsDiv.innerHTML = `
//         <button type="button" onclick="addMenuItem()">Add Menu Item</button>
//         <button type="button" onclick="openEditMenu('${canteenId}')">Edit Menu Items</button>
//       `;
//       menuContainer.appendChild(actionsDiv);

//       editModal.style.display = "block";
//     } catch (err) { console.error(err); }
//   };

//   // -------------------------
//   // MENU ITEM PAGINATION
//   // -------------------------
//   window.openEditMenu = async (canteenId) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/dashboard/canteen");
//       const data = await res.json();
//       if (!data.success) return alert("Failed to load menu");

//       const canteen = data.canteensWithMenus.find(c => c._id === canteenId);
//       if (!canteen) return alert("Canteen not found");

//       currentMenuItems = canteen.menuItems;
//       currentPage = 1;
//       renderMenuPage();
//       editMenuModal.style.display = "block";
//     } catch (err) { console.error(err); }
//   };

//   function renderMenuPage() {
//     const container = document.getElementById("menuPaginationContainer");
//     container.innerHTML = "";
//     const start = (currentPage - 1) * itemsPerPage;
//     const pageItems = currentMenuItems.slice(start, start + itemsPerPage);

//     pageItems.forEach(item => {
//       const div = document.createElement("div");
//       div.classList.add("menu-item");
//       div.innerHTML = `
//         <p>${item.name} - Rs ${item.price} - ${item.available ? "Available" : "Unavailable"}</p>
//       `;
//       container.appendChild(div);
//     });

//     // Pagination controls
//     const totalPages = Math.ceil(currentMenuItems.length / itemsPerPage);
//     const paginationDiv = document.createElement("div");
//     paginationDiv.innerHTML = `
//       <button ${currentPage === 1 ? "disabled" : ""} onclick="prevPage()">Prev</button>
//       Page ${currentPage} of ${totalPages}
//       <button ${currentPage === totalPages ? "disabled" : ""} onclick="nextPage()">Next</button>
//     `;
//     container.appendChild(paginationDiv);
//   }

//   window.nextPage = () => {
//     if ((currentPage * itemsPerPage) < currentMenuItems.length) {
//       currentPage++;
//       renderMenuPage();
//     }
//   };

//   window.prevPage = () => {
//     if (currentPage > 1) {
//       currentPage--;
//       renderMenuPage();
//     }
//   };

//   // -------------------------
//   // Add/remove menu items in modal
//   // -------------------------
// window.addMenuItem = () => {
//   const container = document.getElementById("menuPaginationContainer"); // add directly to paginated container
//   const div = document.createElement("div");
//   div.classList.add("menu-item");
//   div.innerHTML = `
//     <input type="hidden" class="menuId" value=""> <!-- empty for new item -->
//     <input type="text" class="menuName" placeholder="Menu Name">
//     <input type="number" class="menuPrice" placeholder="Price">
//     <input type="text" class="menuCategory" placeholder="Category">
//     <select class="menuAvailable">
//       <option value="true" selected>Available</option>
//       <option value="false">Unavailable</option>
//     </select>
//     <button type="button" onclick="removeMenuItemInput(this)">Remove</button>
//   `;
//   container.appendChild(div);
// };

//   window.removeMenuItemInput = (btn) => btn.parentElement.remove();
//   window.closeEditModal = () => editModal.style.display = "none";
//   window.closeEditMenu = () => editMenuModal.style.display = "none";

//   // -------------------------
//   // SUBMIT CANTEEN FORM
//   // -------------------------
//   document.getElementById("editCanteenForm").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const canteenId = document.getElementById("canteenId").value;
//     const name = document.getElementById("canteenName").value;
//     const location = document.getElementById("canteenLocation").value;
//     const contactNumber = document.getElementById("canteenContact").value;

//      try {
//     //   await fetch(`http://localhost:5000/api/dashboard/canteen/${canteenId}`, {
//     //     method: "PUT",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({ name, location, contactNumber })
//     //   });

//     await fetch(`http://localhost:5000/api/dashboard/canteen/${canteenId}`, {
//   method: "PATCH", // ✅ matches backend
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ name, location, contactNumber })
// });


//       const menuDivs = document.querySelectorAll("#menuItemsContainer .menu-item");
//       for (let div of menuDivs) {
//         const menuId = div.querySelector(".menuId").value;
//         const menuName = div.querySelector(".menuName").value;
//         const menuPrice = parseFloat(div.querySelector(".menuPrice").value);
//         const menuCategory = div.querySelector(".menuCategory").value;
//         const available = div.querySelector(".menuAvailable").value === "true";

//         if (menuId) {
//           await fetch(`http://localhost:5000/api/dashboard/canteen/${canteenId}/menu/${menuId}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ name: menuName, price: menuPrice, category: menuCategory, available })
//           });
//         } else {
//           // await fetch(`http://localhost:5000/api/dashboard/canteen/${canteenId}/menu`, {
//           //   method: "POST",
//           //   headers: { "Content-Type": "application/json" },
//           //   body: JSON.stringify({ name: menuName, price: menuPrice, category: menuCategory })
//           // });

//           await fetch(`http://localhost:5000/api/dashboard/canteen/${canteenId}`, {
//   method: "PATCH",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ name, location, contactNumber })
// });

//         }
//       }

//       alert("Canteen & Menu updated!");
//       closeEditModal();
//       fetchCanteens();
//   } catch (err) { console.error(err); alert("Update failed"); }
//   });

// function renderMenuPage() {
//   const container = document.getElementById("menuPaginationContainer");
//   container.innerHTML = "";

//   const start = (currentPage - 1) * itemsPerPage;
//   const pageItems = currentMenuItems.slice(start, start + itemsPerPage);

//   pageItems.forEach(item => {
//     const div = document.createElement("div");
//     div.classList.add("menu-item");
//     div.innerHTML = `
//       <input type="hidden" class="menuId" value="${item._id}">
//       <input type="text" class="menuName" value="${item.name}" placeholder="Menu Name">
//       <input type="number" class="menuPrice" value="${item.price}" placeholder="Price">
//       <input type="text" class="menuCategory" value="${item.category || ''}" placeholder="Category">
//       <select class="menuAvailable">
//         <option value="true" ${item.available ? "selected" : ""}>Available</option>
//         <option value="false" ${!item.available ? "selected" : ""}>Unavailable</option>
//       </select>
//     `;
//     container.appendChild(div);
//   });

//   const totalPages = Math.ceil(currentMenuItems.length / itemsPerPage);
//   const paginationDiv = document.createElement("div");
//   paginationDiv.innerHTML = `
//     <button ${currentPage === 1 ? "disabled" : ""} onclick="prevPage()">Prev</button>
//     Page ${currentPage} of ${totalPages}
//     <button ${currentPage === totalPages ? "disabled" : ""} onclick="nextPage()">Next</button>
//     <button onclick="addMenuItem()">Add New Item</button>
//     <button onclick="saveMenuPage()">Save Changes</button>
//   `;
//   container.appendChild(paginationDiv);
// }



//   // -------------------------
//   // MANAGE SECTION TOGGLE
//   // -------------------------

// //   window.saveMenuPage = async () => {
// //   const container = document.getElementById("menuPaginationContainer");
// //   const menuDivs = container.querySelectorAll(".menu-item");

// //   const canteenId = document.getElementById("canteenId").value;

// //   for (let div of menuDivs) {
// //     const menuId = div.querySelector(".menuId").value;
// //     const menuName = div.querySelector(".menuName").value;
// //     const menuPrice = parseFloat(div.querySelector(".menuPrice").value);
// //     const menuCategory = div.querySelector(".menuCategory").value;
// //     const available = div.querySelector(".menuAvailable").value === "true";

// //     if (!menuName || isNaN(menuPrice)) continue;

// //     if (menuId) {
// //       // Update existing menu item
// //       await fetch(`http://localhost:5000/api/dashboard/canteen/${canteenId}/menu/${menuId}`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ name: menuName, price: menuPrice, category: menuCategory, available })
// //       });
// //     } else {
// //       // New menu item (should rarely happen here)
// //       await fetch(`http://localhost:5000/api/dashboard/canteen/${canteenId}/menu`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ name: menuName, price: menuPrice, category: menuCategory })
// //       });
// //     }
// //   }

// //   alert("Page menu items saved!");
// //   // Refresh the data from server
// //   openEditMenu(canteenId);
// // };


// window.saveMenuPage = async () => {
//   const canteenId = document.getElementById("canteenId").value;
//   if (!canteenId) return alert("Canteen ID missing!");

//   const menuDivs = Array.from(document.querySelectorAll("#menuPaginationContainer .menu-item"));
//   let hasError = false;

//   for (let div of menuDivs) {
//     const menuId = div.querySelector(".menuId")?.value || null;
//     const menuName = div.querySelector(".menuName")?.value.trim();
//     const menuPrice = parseFloat(div.querySelector(".menuPrice")?.value);
//     const menuCategory = div.querySelector(".menuCategory")?.value.trim() || "";
//     const available = div.querySelector(".menuAvailable")?.value === "true";

//     if (!menuName || isNaN(menuPrice)) continue;

//     try {
//       const url = menuId
//         ? `http://localhost:5000/api/dashboard/canteen/${canteenId}/menuItems/${menuId}` // PATCH existing
//         : `http://localhost:5000/api/dashboard/canteen/${canteenId}/menuItems`;        // POST new

//       const method = menuId ? "PATCH" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: menuName, price: menuPrice, category: menuCategory, available })
//       });

//       const data = await res.json();
//       if (!data.success) {
//         console.error("Failed to save menu item:", data);
//         hasError = true;
//       } else if (!menuId) {
//         // set new menuId for newly added items
//         div.querySelector(".menuId").value = data.menuItem._id;
//       }
//     } catch (err) {
//       console.error("Error saving menu item:", err);
//       hasError = true;
//     }
//   }

//   if (hasError) alert("Some menu items could not be saved. Check console.");
//   else alert("All menu items saved successfully!");

//   await openEditMenu(canteenId);
//   fetchCanteens();
//   fetchOrders();
// };




//   window.goBack = () => {
//     document.getElementById("canteenCards").style.display = "grid";
//     document.getElementById("manageSection").style.display = "none";
//   };
//   window.openManage = () => {
//     document.getElementById("canteenCards").style.display = "none";
//     document.getElementById("manageSection").style.display = "block";
//   };


//   // -------------------------
//   // INITIAL LOAD
//   // -------------------------
//   fetchCanteens();
//   fetchOrders();
// });







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
      const res = await fetch("http://localhost:5000/api/dashboard/canteen");
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
      const res = await fetch("http://localhost:5000/api/dashboard/canteen/orders");
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
      const res = await fetch("http://localhost:5000/api/dashboard/canteen", {
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
      const res = await fetch(`http://localhost:5000/api/dashboard/canteen/${id}`, { method: "DELETE" });
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
      const res = await fetch("http://localhost:5000/api/dashboard/canteen");
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
      const res = await fetch("http://localhost:5000/api/dashboard/canteen");
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

  // -------------------------
  // SAVE MENU PAGE
  // -------------------------
  // window.saveMenuPage = async () => {
  //   const canteenId = document.getElementById("canteenId").value;
  //   if (!canteenId) return alert("Canteen ID missing!");

  //   const menuDivs = Array.from(document.querySelectorAll("#menuPaginationContainer .menu-item"));
  //   let hasError = false;

  //   for (let div of menuDivs) {
  //     const menuId = div.querySelector(".menuId")?.value || null;
  //     const menuName = div.querySelector(".menuName")?.value.trim();
  //     const menuPrice = parseFloat(div.querySelector(".menuPrice")?.value);
  //     const menuCategory = div.querySelector(".menuCategory")?.value.trim() || "";
  //     const available = div.querySelector(".menuAvailable")?.value === "true";

  //     if (!menuName || isNaN(menuPrice)) continue;

  //     try {
  //       const url = menuId
  //         ? `http://localhost:5000/api/dashboard/canteen/${canteenId}/menuItems/${menuId}`
  //         : `http://localhost:5000/api/dashboard/canteen/${canteenId}/menuItems`;

  //       const method = menuId ? "PATCH" : "POST";

  //       const res = await fetch(url, {
  //         method,
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ name: menuName, price: menuPrice, category: menuCategory, available })
  //       });

  //       const data = await res.json();
  //       if (!data.success) {
  //         console.error("Failed to save menu item:", data);
  //         hasError = true;
  //       } else if (!menuId) {
  //         div.querySelector(".menuId").value = data.menuItem._id;
  //       }
  //     } catch (err) {
  //       console.error("Error saving menu item:", err);
  //       hasError = true;
  //     }
  //   }

  //   if (hasError) alert("Some menu items could not be saved. Check console.");
  //   else alert("All menu items saved successfully!");

  //   await openEditMenu(canteenId);
  //   fetchCanteens();
  //   fetchOrders();
  // };



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
        ? `http://localhost:5000/api/dashboard/canteen/${canteenId}/menuItems/${menuId}`
        : `http://localhost:5000/api/dashboard/canteen/${canteenId}/menuItems`;

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
