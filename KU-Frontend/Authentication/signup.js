document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector("form");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("input[type='text']").value.trim();
    const email = document.querySelector("input[type='email']").value.trim();
    const password = document
      .querySelector("input[type='password']")
      .value.trim();

    if (!name) {
      showCallout("Please enter your full name", "error");
      return;
    }

    if (!email.includes("@") || !email.endsWith(".com")) {
      showCallout(
        "Please enter a valid email (must contain '@' and end with .com)",
        "error"
      );
      return;
    }

    if (password.length < 6) {
      showCallout("Password must be at least 6 characters long", "error");
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
        showCallout("Signup successful! Please login.", "success");

        // Redirect after a short delay so the user can see the success message
        setTimeout(() => {
          // Assuming your login page is one level up in the 'Authentication' folder
          window.location.href = "login.html";
        }, 1500); // 1.5 seconds delay
      } else {
        showCallout(
          `Signup failed: ${data.message || "Email already in use."}`,
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      showCallout(
        "Error connecting to server. Check backend URL or server status.",
        "error"
      );
    }
  });

  /**
   * @param {string} message - The text content of the callout.
   * @param {string} type - 'success' (green banner) or 'error' (red banner).
   */

  function showCallout(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const callout = document.createElement("div");
    let iconEntity;
    let calloutClass;

    if (type === "success") {
      iconEntity = "&#x2713;"; // Checkmark
      calloutClass = "callout--success";
    } else if (type === "error") {
      iconEntity = "&#x2715;"; // X mark
      calloutClass = "callout--error";
    } else {
      iconEntity = "i";
      calloutClass = "callout--info";
    }

    callout.className = `callout ${calloutClass} show`;
    callout.innerHTML = `
            <div class="callout__icon">
                <i aria-hidden="true">${iconEntity}</i>
            </div>
            <div class="callout__text">${message}</div>
        `;

    container.appendChild(callout);

    // Auto-remove after 4 seconds
    const DURATION = 4000;
    setTimeout(() => {
      callout.classList.remove("show");
      callout.classList.add("hide");

      callout.addEventListener("transitionend", () => {
        callout.remove();
      });

      setTimeout(() => {
        if (callout.parentNode === container) {
          callout.remove();
        }
      }, 500);
    }, DURATION);
  }
});
