document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  const rememberCheckbox = document.querySelector("#remember");
  const emailInput = document.querySelector("input[type='email']");
  const passwordInput = document.querySelector("input[type='password']");

  const savedEmail = localStorage.getItem("rememberedEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }

  function showToast(type, message) {
    const container = document.getElementById("toast-container");

    // 1. Create the toast element
    const toast = document.createElement("div");

    // Determine the icon and class based on the 'type'
    let icon;
    let toastClass;

    if (type === "success") {
      icon = "✓"; // Checkmark
      toastClass = "toast--success";
    } else if (type === "error") {
      icon = "!"; // Exclamation point
      toastClass = "toast--error";
    } else {
      // Default to info if an unknown type is passed
      icon = "i";
      toastClass = "toast--info";
    }

    // 2. Set the content and classes for styling
    toast.className = `toast ${toastClass} show`; // 'show' class is for animation/visibility
    toast.innerHTML = `
        <div class="toast__icon">${icon}</div>
        <div class="toast__text">${message}</div>
    `;

    // 3. Add the toast to the container
    container.appendChild(toast);

    // 4. Set a timer to automatically remove the toast
    const DURATION = 4000; // 4000 milliseconds = 4 seconds

    setTimeout(() => {
      // Add a 'hide' class for fade-out animation (if you add CSS for it)
      toast.classList.remove("show");
      toast.classList.add("hide");

      // Remove the element completely after the transition/duration
      toast.addEventListener("transitionend", () => {
        toast.remove();
      });

      // Fallback removal if transitionend doesn't fire (simpler approach)
      setTimeout(() => {
        if (toast.parentNode === container) {
          toast.remove();
        }
      }, 500); // Wait 0.5s for the fade-out
    }, DURATION);
  }

  const BASE_URL = "http://localhost:5000";

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const guestId = localStorage.getItem("guestId");

    if (!email.includes("@") || !email.endsWith(".com")) {
      alert("Please enter a valid email (must contain '@' and end with .com)");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, guestId }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Login successful!", "success");

        // ✅ Handle admin login (no token or user object expected)
        if (data.role && data.role === "admin") {
          localStorage.setItem("role", "admin");
          window.location.href = "../Admin Dashboard/dashboard/dashboard.html";
          return;
        }

        // ✅ Normal user login
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        localStorage.removeItem("guestId");

        if (rememberCheckbox.checked) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        window.location.href = "../HomePage/KUCampusBite.html";
      } else if (response.status === 404) {
        showToast(
          "No account found with this email. Please sign up first.",
          "error"
        );
        window.location.href = "signup.html";
      } else {
        showToast(`Login failed: ${data.message || "Unknown error"}`, "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error connecting to server. Check backend URL or server status.");
    }
  });
});
