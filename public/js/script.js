// Show/Hide Password Toggle Function
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("account_password");
  const toggleButtons = document.querySelectorAll("[data-toggle='password']");

  if (!passwordInput || toggleButtons.length === 0) return;

  toggleButtons.forEach(button => {
    button.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";

      passwordInput.type = isHidden ? "text" : "password";
      button.textContent = isHidden ? "Hide Password" : "Show Password";
      button.setAttribute("aria-pressed", String(isHidden));
    });
  });
});



  // Wait until the DOM is ready
  document.addEventListener("DOMContentLoaded", function() {
    const notice = document.querySelector(".notice"); // adjust selector to match your flash message container
    if (notice) {
      setTimeout(() => {
        notice.style.transition = "opacity 1s ease";
        notice.style.opacity = "0";
        // Optionally remove from DOM after fade
        setTimeout(() => notice.remove(), 1000);
      }, 4000); // 4 seconds before fade starts
    }
  });

