/**
 * AZ Studio - Toast Manager Component
 * Safe, accessible notifications with XSS protection and aria-live announcements
 */

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (typeof document === "undefined") return;
    this.container = document.getElementById("toastContainer");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toastContainer";
      this.container.setAttribute("role", "region");
      this.container.setAttribute("aria-live", "polite");
      this.container.setAttribute("aria-label", "إشعارات النظام");
      document.body.appendChild(this.container);
    }
  }

  /**
   * Show a toast message
   * @param {string} message - Plain text message
   * @param {'success'|'error'|'info'|'warning'} type
   * @param {number} duration - Milliseconds
   */
  show(message, type = "success", duration = 3500) {
    if (!this.container) this.init();

    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;
    toast.setAttribute("role", "status");

    // Icon mapping
    const iconName =
      type === "success"
        ? "check-circle"
        : type === "error"
          ? "alert-circle"
          : type === "warning"
            ? "alert-triangle"
            : "info";

    // Safe DOM construction (prevents XSS)
    const iconSpan = document.createElement("span");
    iconSpan.className = "toast-icon";
    iconSpan.innerHTML = `<i data-lucide="${iconName}"></i>`;

    const textSpan = document.createElement("span");
    textSpan.className = "toast-text";
    textSpan.textContent = String(message || "");

    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);

    this.container.appendChild(toast);

    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons({ root: toast });
    }

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
}

export const toast = new ToastManager();

// Also expose globally for legacy compatibility
if (typeof window !== "undefined") {
  window.showToast = (msg, type) => toast.show(msg, type);
  window.toast = toast;
}
