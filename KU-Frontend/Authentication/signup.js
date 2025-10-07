document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector("form");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("input[type='text']").value.trim();
    const email = document.querySelector("input[type='email']").value.trim();
    const password = document.querySelector("input[type='password']").value.trim();


    if (!name) {
      alert("Please enter your full name");
      return;
    }

    if (!email.includes("@") || !email.endsWith(".com")) {
      alert("Please enter a valid email (must contain '@' and end with .com)");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! Please login.");
        window.location.href = "login.html";
      } else {
        alert(`Signup failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  });
});
