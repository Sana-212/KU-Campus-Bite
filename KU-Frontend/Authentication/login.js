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
        alert("Login successful!");


        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);


        localStorage.removeItem("guestId");


        if (rememberCheckbox.checked) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }


        window.location.href = "../HomePage/KUCampusBite.html";
      } else if (response.status === 404) {
        alert("No account found with this email. Please sign up first.");
        window.location.href = "signup.html";
      } else {
        alert(`Login failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error connecting to server. Check backend URL or server status.");
    }
  });
});
