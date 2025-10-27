    document.addEventListener('DOMContentLoaded', () => {
        // Look for the element with the ID "logout-link"
        const logoutLink = document.getElementById('logout-link');
        
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 1. Clear session data from localStorage
                localStorage.removeItem("user");   
                localStorage.removeItem("token");  
                localStorage.removeItem("guestId"); 
              
                window.location.href = "/HomePage/KUCampusBite.html";
            });
        }
    });
