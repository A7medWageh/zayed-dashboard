/**
 * AZ Studio - App Shell & Shared Layout Module
 * Automatically highlights the active sidebar menu item based on current page URL,
 * updates user profile in header, and wires universal interactions.
 */

export class AppShell {
  static init() {
    this.highlightActiveMenu();
    this.bindLogoutTriggers();
    this.initUserProfile();
  }

  /**
   * Highlights the current page in the sidebar menu dynamically
   */
  static highlightActiveMenu() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const menuLinks = document.querySelectorAll(".sidebar-menu a, .sidebar-item");

    menuLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && (href === currentPath || (currentPath === "" && href === "index.html"))) {
        menuLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }

  /**
   * Binds all logout buttons across dashboard pages to clean session removal
   */
  static bindLogoutTriggers() {
    document.addEventListener("click", (e) => {
      const logoutBtn = e.target.closest(
        '[data-action="logout"], .btn-logout, a[href="login.html"]'
      );
      if (logoutBtn && !window.location.pathname.endsWith("login.html")) {
        // Clear tokens
        localStorage.removeItem("az_auth_token");
        localStorage.removeItem("az_auth_user");
      }
    });
  }

  /**
   * Loads current user info into header
   */
  static initUserProfile() {
    const raw = localStorage.getItem("az_auth_user");
    if (!raw) return;

    try {
      const user = JSON.parse(raw);
      const nameEl = document.querySelector(".user-name, .profile-name, .header-user-name");
      const roleEl = document.querySelector(".user-role, .profile-role, .header-user-role");

      if (nameEl && user.name) nameEl.textContent = user.name;
      if (roleEl && user.role) roleEl.textContent = user.role;
    } catch {
      // Ignored
    }
  }
}

// Auto-init on DOM Ready
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => AppShell.init());
}
