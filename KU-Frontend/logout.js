  document.getElementById("logout-link").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");   
    localStorage.removeItem("token");  
    localStorage.removeItem("guestId"); 
    window.location.href = "/HomePage/KUCampusBite.html";
  });
