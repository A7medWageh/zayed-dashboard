/**
 * AZ Studio - Route Auth Guard
 * Protects dashboard pages from unauthorized access & binds logout actions.
 *
 * Behaviour:
 *  - Protected page + no token  → redirect to login.html
 *  - Auth page + valid token    → redirect to index.html (unless ?force=true)
 *  - Auth page + no token       → allow (normal login flow)
 */

(function initAuthGuard() {
  const AUTH_PAGES = [
    "login.html",
    "enter-email.html",
    "otp.html",
    "new-password.html",
    "reset-password.html",
  ];

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const isAuthPage = AUTH_PAGES.includes(currentPage);
  const token = localStorage.getItem("az_auth_token");

  // If on a protected page and not authenticated, redirect to login
  if (!isAuthPage && !token) {
    window.location.replace("login.html");
    return;
  }

  // If already authenticated and visiting an auth page, redirect to dashboard
  if (isAuthPage && token) {
    if (!window.location.search.includes("force=true")) {
      window.location.replace("index.html");
      return;
    }
  }

  // Populate header profile display with current user info
  document.addEventListener("DOMContentLoaded", () => {
    const rawUser = localStorage.getItem("az_auth_user");
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);
        const nameEl = document.querySelector(".user-name, .profile-name, .header-user-name");
        const roleEl = document.querySelector(".user-role, .profile-role, .header-user-role");
        if (nameEl && user.name) nameEl.textContent = user.name;
        if (roleEl && user.role) roleEl.textContent = user.role;
      } catch (e) {
        console.warn("[AuthGuard] Could not parse user session", e);
      }
    }

    // Attach logout event listeners to all logout triggers
    const logoutTriggers = document.querySelectorAll(
      '[data-action="logout"], .btn-logout, #btnLogout, #logoutModalSubmit'
    );
    logoutTriggers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("az_auth_token");
        localStorage.removeItem("az_auth_user");
        window.location.href = "login.html";
      });
    });

    // Intercept the logout modal confirm link (<a href="login.html"> inside logout modal)
    const logoutConfirmLinks = document.querySelectorAll(
      '#logoutModal .btn-modal-primary[href="login.html"], .modal-overlay .btn-logout-confirm'
    );
    logoutConfirmLinks.forEach((link) => {
      link.addEventListener("click", () => {
        localStorage.removeItem("az_auth_token");
        localStorage.removeItem("az_auth_user");
        // href navigation will proceed naturally
      });
    });
  });
})();
