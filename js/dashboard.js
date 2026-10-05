/**
 * AZ STUDIO - ENTERPRISE DASHBOARD CORE SYSTEM
 * Architecture: ES6+ Modular Interaction, Modal Manager, Toast Notifications,
 * Mock API Persistence Layer, Safe DOM Rendering, Theme Switching, Accessible Components.
 */

// ==========================================================================
// 1. Toast Notification Manager (Safe & Accessible)
// ==========================================================================
class ToastNotification {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (typeof document === "undefined") return;
    this.container =
      document.getElementById("toastContainer") || document.getElementById("dashboardToast");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toastContainer";
      this.container.setAttribute("role", "region");
      this.container.setAttribute("aria-live", "polite");
      this.container.setAttribute("aria-label", "إشعارات النظام");
      document.body.appendChild(this.container);
    }
  }

  show(message, type = "success", duration = 3500) {
    if (!this.container) this.init();

    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;
    toast.setAttribute("role", "status");

    const iconSvg =
      type === "success"
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
        : type === "error"
          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
          : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    const iconWrap = document.createElement("span");
    iconWrap.className = "toast-icon";
    iconWrap.innerHTML = iconSvg;

    const textWrap = document.createElement("span");
    textWrap.className = "toast-text";
    textWrap.textContent = String(message || "");

    toast.appendChild(iconWrap);
    toast.appendChild(textWrap);
    this.container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

const toast = new ToastNotification();
window.showToast = (msg, type) => toast.show(msg, type);

// ==========================================================================
// Password Toggle - Event Delegation
// Handles: [data-toggle-pass="inputId"], [data-toggle-pass-btn] (.eye-btn siblings),
// and the auth module's .btn-toggle-eye buttons — no inline onclick anywhere.
// ==========================================================================
document.addEventListener("click", (e) => {
  // Pattern 1: data-toggle-pass="inputId" (index.html change-password modal)
  const toggleById = e.target.closest("[data-toggle-pass]");
  if (toggleById) {
    const targetId = toggleById.getAttribute("data-toggle-pass");
    const input = document.getElementById(targetId);
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    const icon = toggleById.querySelector("[data-lucide]");
    if (icon) {
      icon.setAttribute("data-lucide", input.type === "text" ? "eye-off" : "eye");
      if (typeof lucide !== "undefined" && lucide.createIcons)
        lucide.createIcons({ root: toggleById });
    }
    return;
  }

  // Pattern 2: data-toggle-pass-btn (supervisor eye-btn, finds sibling input)
  const toggleSibling = e.target.closest("[data-toggle-pass-btn]");
  if (toggleSibling) {
    const wrap = toggleSibling.closest(".modal-input-eye-wrap, .auth-input-wrap");
    const input = wrap && wrap.querySelector('input[type="password"], input[type="text"]');
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    return;
  }
});

// ==========================================================================
// Export Button Delegation (data-export-format)
// Replaces inline onclick="showToast('جاري تصدير...', 'success')"
// ==========================================================================
document.addEventListener("click", (e) => {
  const exportBtn = e.target.closest("[data-export-format]");
  if (!exportBtn) return;
  e.preventDefault();
  const fmt = exportBtn.getAttribute("data-export-format") || "excel";
  const fmtLabel = fmt === "pdf" ? "PDF" : fmt === "csv" ? "CSV" : "Excel";
  toast.show(`جاري تصدير ملف ${fmtLabel}...`, "success");
});

// ==========================================================================
// 2. Accessible Modal Manager (Focus Trap & ARIA Dialogs)
// ==========================================================================
class ModalManager {
  constructor() {
    this.activeModal = null;
    this.lastFocused = null;
    this.init();
  }

  init() {
    document.addEventListener("click", (e) => {
      // Trigger Open
      const openBtn = e.target.closest("[data-modal-target]");
      if (openBtn) {
        e.preventDefault();
        const targetId = openBtn.getAttribute("data-modal-target");
        this.open(targetId, openBtn);
        return;
      }

      // Trigger Close
      const closeBtn = e.target.closest(
        "[data-modal-close], .btn-modal-close, .modal-close-btn, .btn-modal-cancel"
      );
      if (closeBtn) {
        e.preventDefault();
        const modal = closeBtn.closest(".modal-overlay, .modal-backdrop");
        if (modal) this.close(modal.id);
        return;
      }

      // Click Backdrop
      if (
        e.target.classList.contains("modal-overlay") ||
        e.target.classList.contains("modal-backdrop")
      ) {
        this.close(e.target.id);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeModal) {
        this.close(this.activeModal.id);
      }
    });
  }

  open(modalId, trigger = null) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.lastFocused = trigger || document.activeElement;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.classList.add("active", "show");
    document.body.style.overflow = "hidden";
    this.activeModal = modal;

    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons({ root: modal });
    }

    setTimeout(() => {
      const focusable = modal.querySelector("button, [href], input, select, textarea");
      if (focusable) focusable.focus();
    }, 60);
  }

  close(modalId) {
    const modal = modalId ? document.getElementById(modalId) : this.activeModal;
    if (!modal) return;

    modal.classList.remove("active", "show");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal-overlay.active, .modal-overlay.show")) {
      document.body.style.overflow = "";
    }

    if (this.lastFocused && typeof this.lastFocused.focus === "function") {
      this.lastFocused.focus();
    }
    this.activeModal = null;
  }
}

const modalManager = new ModalManager();
window.openModal = (id) => modalManager.open(id);
window.closeModal = (id) => modalManager.close(id);

// ==========================================================================
// 3. Dynamic Table Renderers (Eliminates document.write)
// ==========================================================================
function renderSupervisorsTable() {
  const tbody = document.getElementById("supervisorsTableBody");
  if (!tbody) return;

  const count = 18;
  let html = "";
  for (let i = 1; i <= count; i++) {
    const id = 600 + i;
    html += `
      <tr>
        <td><span class="table-code">#${id}</span></td>
        <td style="font-weight: 600; color: #111827;">محمد أحمد ${i}</td>
        <td style="direction: ltr; text-align: right;">01024200163</td>
        <td style="direction: ltr; text-align: right; color: #4B5563;">mohamed.abdelrahman${id}@gmail.com</td>
        <td style="direction: ltr; text-align: right;">1233444448</td>
        <td>مشرف عام</td>
        <td><a href="#" class="link-permissions">كل الصلاحيات</a></td>
        <td><span class="pill-active-green">نشط</span></td>
        <td><button type="button" class="pill-suspend-red" data-action="toggle-status">إيقاف الحساب</button></td>
        <td>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <button type="button" class="btn-table-eye" data-modal-target="viewSupervisorModal" aria-label="عرض" title="عرض المشرف">
              <i data-lucide="eye"></i>
            </button>
            <button type="button" class="btn-table-eye" data-modal-target="editSupervisorModal" style="color: #111827; border-color: #E5E7EB;" aria-label="تعديل" title="تعديل المشرف">
              <i data-lucide="edit"></i>
            </button>
            <button type="button" class="btn-table-del" data-modal-target="deleteModal" aria-label="حذف" title="حذف المشرف">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function renderServicesTable() {
  const tbody = document.getElementById("servicesTableBody");
  if (!tbody) return;

  const count = 18;
  let html = "";
  for (let i = 1; i <= count; i++) {
    html += `
      <tr>
        <td style="text-align: center;">
          <div class="service-media-thumb">
            <i data-lucide="film"></i>
          </div>
        </td>
        <td style="font-weight: 600; color: #111827;">موشن جرافيك ${i}</td>
        <td style="color: #6B7280; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">إنتاج وتصميم رسومات فيديو إعلانية</td>
        <td style="color: #6B7280; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">تسليم ملفات مفتوحة المصدر ودقة 4K</td>
        <td style="color: #6B7280; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">تحليل المتطلبات ورسم السكتشات</td>
        <td style="color: #6B7280; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">فيديو نهائي مع هندسة صوتية</td>
        <td style="color: #6B7280; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">هذا النص يمكن ان يستبدل بنص بديل</td>
        <td>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <button type="button" class="btn-table-eye" data-modal-target="viewServiceModal" aria-label="عرض" title="عرض الخدمة">
              <i data-lucide="eye"></i>
            </button>
            <a href="edit-service.html" class="btn-table-eye" style="color: #111827; border-color: #E5E7EB; text-decoration: none;" aria-label="تعديل" title="تعديل الخدمة">
              <i data-lucide="edit"></i>
            </a>
            <button type="button" class="btn-table-del" data-modal-target="deleteModal" aria-label="حذف" title="حذف الخدمة">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function renderPackagesTable() {
  const tbody = document.getElementById("packagesTableBody");
  if (!tbody) return;

  const count = 18;
  let html = "";
  for (let i = 1; i <= count; i++) {
    html += `
      <tr>
        <td style="font-weight: 600; color: #111827;">الباقة الأساسية ${i}</td>
        <td style="color: #6B7280; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">باقة متكاملة لإنتاج إعلانات السوشيال ميديا</td>
        <td style="font-weight: 600; color: #111827;">40,000 ر.س</td>
        <td style="color: #6B7280; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">تشمل 3 فيديوهات إعلانية وتغطية كاملة</td>
        <td>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <button type="button" class="btn-table-eye" data-modal-target="viewPackageModal" aria-label="عرض" title="عرض الباقة">
              <i data-lucide="eye"></i>
            </button>
            <button type="button" class="btn-table-eye" data-modal-target="editPackageModal" style="color: #111827; border-color: #E5E7EB;" aria-label="تعديل" title="تعديل الباقة">
              <i data-lucide="edit"></i>
            </button>
            <button type="button" class="btn-table-del" data-modal-target="deleteModal" aria-label="حذف" title="حذف الباقة">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function renderSettingsTables() {
  const outTbody = document.getElementById("outputsTableBody");
  if (outTbody) {
    let outHtml = "";
    for (let i = 1; i <= 18; i++) {
      outHtml += `
        <tr>
          <td style="padding: 14px 16px; font-size: 12.5px; color: #374151; font-weight: 500;">المخرجات والإنتاج #${i}</td>
          <td style="padding: 14px 16px; font-size: 12px; color: #6B7280;">تسليم ملفات فيديو عالية الدقة مع حقوق النشر</td>
          <td style="padding: 14px 16px; font-size: 12px; color: #6B7280;">هذا النص يمكن أن يستبدل بنص بديل</td>
          <td style="padding: 14px 16px; text-align: left;">
            <div style="display: flex; gap: 8px; align-items: center; justify-content: flex-end;">
              <button type="button" class="btn-table-del" data-modal-target="deleteOutputModal" aria-label="حذف"><i data-lucide="trash-2"></i></button>
              <button type="button" class="btn-action-edit" data-modal-target="editOutputModal" aria-label="تعديل"><i data-lucide="edit"></i></button>
            </div>
          </td>
        </tr>
      `;
    }
    outTbody.innerHTML = outHtml;
  }

  const secTbody = document.getElementById("sectorsTableBody");
  if (secTbody) {
    let secHtml = "";
    for (let i = 1; i <= 18; i++) {
      secHtml += `
        <tr>
          <td style="padding: 14px 16px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #FFFBEB; border: 1px solid #FDE68A; display: flex; align-items: center; justify-content: center; color: #D97706;">
              <i data-lucide="image"></i>
            </div>
          </td>
          <td style="padding: 14px 16px; font-size: 12.5px; color: #374151; font-weight: 500;">القطاع الحكومي ${i}</td>
          <td style="padding: 14px 16px; font-size: 12px; color: #6B7280;">تقديم حلول إعلامية مرئية للوزارات والهيئات</td>
          <td style="padding: 14px 16px; text-align: left;">
            <div style="display: flex; gap: 8px; align-items: center; justify-content: flex-end;">
              <button type="button" class="btn-table-del" data-modal-target="deleteSectorModal" aria-label="حذف"><i data-lucide="trash-2"></i></button>
              <button type="button" class="btn-action-edit" data-modal-target="editSectorModal" aria-label="تعديل"><i data-lucide="edit"></i></button>
              <button type="button" class="btn-table-eye" data-modal-target="viewSectorModal" aria-label="عرض"><i data-lucide="eye"></i></button>
            </div>
          </td>
        </tr>
      `;
    }
    secTbody.innerHTML = secHtml;
  }

  const faqTbody = document.getElementById("faqTableBody");
  if (faqTbody) {
    let faqHtml = "";
    for (let i = 1; i <= 18; i++) {
      faqHtml += `
        <tr>
          <td style="padding: 14px 16px; font-size: 12.5px; color: #374151; font-weight: 500;">ما هي مدة تسليم المشروع المرئي؟ #${i}</td>
          <td style="padding: 14px 16px; font-size: 12px; color: #6B7280;">تتراوح المدة بين 5 إلى 14 يوم عمل حسب حجم المشروع</td>
          <td style="padding: 14px 16px; font-size: 12px; color: #6B7280; direction: ltr; text-align: right;">2026-03-26 11:48:29</td>
          <td style="padding: 14px 16px; text-align: left;">
            <div style="display: flex; gap: 8px; align-items: center; justify-content: flex-end;">
              <button type="button" class="btn-table-del" data-modal-target="deleteFaqModal" aria-label="حذف"><i data-lucide="trash-2"></i></button>
              <button type="button" class="btn-action-edit" data-modal-target="editFaqModal" aria-label="تعديل"><i data-lucide="edit"></i></button>
              <button type="button" class="btn-table-eye" data-modal-target="viewFaqModal" aria-label="عرض"><i data-lucide="eye"></i></button>
            </div>
          </td>
        </tr>
      `;
    }
    faqTbody.innerHTML = faqHtml;
  }
}

// ==========================================================================
// 4. Accordion & Settings Modules (No Inline Event Handlers)
// ==========================================================================
function initSettingsAccordions() {
  document.addEventListener("click", (e) => {
    // ---- Accordion Toggle ----
    // Ignore clicks on inner action buttons/inputs
    if (
      e.target.closest(
        "[data-add-card-container], [data-action], .btn-add-card-link, .btn-card-delete"
      )
    ) {
      return;
    }

    const header = e.target.closest(
      "[data-accordion-toggle], .settings-accordion-header, .settings-group-header"
    );
    if (header) {
      e.preventDefault();
      const card = header.closest(
        ".settings-section-card, .settings-accordion-card, .settings-group-card"
      );
      if (card) {
        const isOpen = card.classList.contains("open");
        card.classList.toggle("open", !isOpen);
        header.setAttribute("aria-expanded", isOpen ? "false" : "true");
      }
      return;
    }

    // ---- Dynamic Card Remover (data-action="remove-card" | .btn-card-delete) ----
    const removeBtn = e.target.closest('[data-action="remove-card"], .btn-card-delete');
    if (removeBtn) {
      e.preventDefault();
      const card = removeBtn.closest(".setting-dynamic-card, .dynamic-card-item");
      if (card) {
        card.style.opacity = "0";
        card.style.transform = "scale(0.95)";
        card.style.transition = "all 0.2s ease";
        setTimeout(() => {
          card.remove();
          toast.show("تم حذف البطاقة بنجاح", "info");
        }, 200);
      }
      return;
    }

    // ---- Dynamic Card Adder (data-add-card-container) ----
    const addBtn = e.target.closest("[data-add-card-container]");
    if (addBtn) {
      e.preventDefault();
      e.stopPropagation();
      const containerId = addBtn.getAttribute("data-add-card-container");
      const titlePrefix = addBtn.getAttribute("data-add-card-title") || "البطاقة";
      const container = document.getElementById(containerId);
      if (!container) return;
      const count = container.querySelectorAll(".setting-dynamic-card").length + 1;
      const card = document.createElement("div");
      card.className = "setting-dynamic-card";
      const titleAr = document.createElement("div");
      titleAr.className = "modal-form-group";
      const card_head = document.createElement("div");
      card_head.className = "setting-card-head";
      const titleSpan = document.createElement("span");
      titleSpan.className = "setting-card-title";
      titleSpan.textContent = `${titlePrefix} رقم ${count}`;
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn-card-delete";
      deleteBtn.setAttribute("data-action", "remove-card");
      deleteBtn.setAttribute("title", "حذف");
      deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>';
      card_head.appendChild(titleSpan);
      card_head.appendChild(deleteBtn);
      card.appendChild(card_head);
      // Input rows
      card.insertAdjacentHTML(
        "beforeend",
        `
        <div class="modal-form-row">
          <div class="modal-form-group"><label class="modal-label">العنوان ( AR )</label><input type="text" class="modal-input" placeholder="ادخل العنوان"></div>
          <div class="modal-form-group"><label class="modal-label">العنوان ( EN )</label><input type="text" class="modal-input" placeholder="ادخل العنوان"></div>
        </div>
        <div class="modal-form-row" style="margin-top:10px">
          <div class="modal-form-group"><label class="modal-label">الوصف ( AR )</label><input type="text" class="modal-input" placeholder="ادخل الوصف"></div>
          <div class="modal-form-group"><label class="modal-label">الوصف ( EN )</label><input type="text" class="modal-input" placeholder="ادخل الوصف"></div>
        </div>
      `
      );
      container.appendChild(card);
      if (typeof lucide !== "undefined" && lucide.createIcons) lucide.createIcons({ root: card });
      toast.show("تمت إضافة بطاقة جديدة", "info");
      return;
    }

    // ---- Confirm Delete with Toast (data-confirm-delete) ----
    const confirmDeleteBtn = e.target.closest("[data-confirm-delete]");
    if (confirmDeleteBtn) {
      e.preventDefault();
      const msg = confirmDeleteBtn.getAttribute("data-toast-msg") || "تمت العملية بنجاح";
      toast.show(msg, "success");
      modalManager.close();
      return;
    }

    // ---- Chain Modal: close current, open next (data-chain-modal) ----
    const chainBtn = e.target.closest("[data-chain-modal]");
    if (chainBtn) {
      e.preventDefault();
      const nextModalId = chainBtn.getAttribute("data-chain-modal");
      const currentModal = chainBtn.closest(".modal-overlay, .modal-backdrop");
      if (currentModal) modalManager.close(currentModal.id);
      setTimeout(() => modalManager.open(nextModalId, chainBtn), 220);
      return;
    }

    // ---- Status toggle in tables ----
    const statusBtn = e.target.closest('[data-action="toggle-status"]');
    if (statusBtn) {
      e.preventDefault();
      const isSuspended = statusBtn.classList.contains("pill-active-green");
      statusBtn.className = isSuspended ? "pill-suspend-red" : "pill-active-green";
      statusBtn.textContent = isSuspended ? "إيقاف الحساب" : "تفعيل الحساب";
      toast.show("تم تحديث حالة الحساب بنجاح", "success");
      return;
    }

    // ---- Pagination Controls (.page-btn) ----
    const pageBtn = e.target.closest(".page-btn");
    if (pageBtn) {
      e.preventDefault();
      const container = pageBtn.closest(
        ".pagination-controls, .table-pagination, .orders-pagination, .roles-pagination, .table-footer"
      );
      if (!container) return;

      const numberButtons = Array.from(container.querySelectorAll(".page-btn")).filter((b) => {
        const t = b.textContent.trim();
        return t !== "<" && t !== ">";
      });

      const label = pageBtn.textContent.trim();
      const currentIndex = numberButtons.findIndex((b) => b.classList.contains("active"));
      let nextIndex = currentIndex;

      if (label === "<") {
        nextIndex = Math.max(0, currentIndex - 1);
      } else if (label === ">") {
        nextIndex = Math.min(numberButtons.length - 1, currentIndex + 1);
      } else {
        nextIndex = numberButtons.indexOf(pageBtn);
      }

      if (nextIndex >= 0 && nextIndex < numberButtons.length) {
        numberButtons.forEach((b, idx) => {
          b.classList.toggle("active", idx === nextIndex);
        });
        const pageNum = numberButtons[nextIndex].textContent.trim();
        toast.show(`الانتقال إلى الصفحة ${pageNum}`, "info");
      }
      return;
    }
  });

  // Settings Tabs Navigation
  const tabLinks = document.querySelectorAll(".settings-tab-link, [data-tab-target]");
  tabLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId =
        link.getAttribute("data-tab-target") || link.getAttribute("href")?.replace("#", "");
      if (!targetId) return;

      tabLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      document.querySelectorAll(".settings-tab-panel, .tab-pane").forEach((panel) => {
        panel.classList.remove("active");
      });

      const activePanel =
        document.getElementById(targetId) || document.getElementById(`tab-${targetId}`);
      if (activePanel) activePanel.classList.add("active");
    });
  });

  // Keyboard Support (Enter / Space to toggle accordions)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const header = e.target.closest(
        "[data-accordion-toggle], .settings-accordion-header, .settings-group-header"
      );
      if (header && (header.tagName === "BUTTON" || header.getAttribute("role") === "button")) {
        e.preventDefault();
        const card = header.closest(
          ".settings-section-card, .settings-accordion-card, .settings-group-card"
        );
        if (card) {
          const isOpen = card.classList.contains("open");
          card.classList.toggle("open", !isOpen);
          header.setAttribute("aria-expanded", isOpen ? "false" : "true");
        }
      }
    }
  });
}

// ==========================================================================
// 5. Sidebar, Header Dropdowns & Theme Manager
// ==========================================================================
function initAppShell() {
  // Mobile Sidebar Drawer & Backdrop Overlay
  const sidebar = document.querySelector(".sidebar, .admin-sidebar");
  let backdrop = document.querySelector(".sidebar-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    document.body.appendChild(backdrop);
  }

  const openSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.add("active", "show");
    backdrop.classList.add("active", "show");
    document.body.style.overflow = "hidden";
  };

  const closeSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.remove("active", "show");
    backdrop.classList.remove("active", "show");
    document.body.style.overflow = "";
  };

  const toggleSidebar = () => {
    if (!sidebar) return;
    if (sidebar.classList.contains("active") || sidebar.classList.contains("show")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  document.addEventListener("click", (e) => {
    const menuBtn = e.target.closest(
      ".mobile-menu-btn, #mobileMenuBtn, #sidebarToggle, .btn-sidebar-toggle"
    );
    if (menuBtn) {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
      return;
    }

    const closeBtn = e.target.closest(
      ".sidebar-close-btn, #sidebarCloseBtn, .sidebar-backdrop, .sidebar-overlay"
    );
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      closeSidebar();
      return;
    }

    if (window.innerWidth <= 991 && e.target.closest(".sidebar-menu a")) {
      closeSidebar();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSidebar();
    }
  });

  // Header Dropdowns (User profile, Notifications)
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-dropdown-toggle]");
    if (trigger) {
      const panel = trigger.parentElement.querySelector(
        ".custom-dropdown-panel, .user-dropdown-card"
      );
      if (panel) {
        panel.classList.toggle("show");
      }
      return;
    }

    // Click outside to close all dropdowns
    if (!e.target.closest(".header-action-item, .user-profile-widget")) {
      document
        .querySelectorAll(".custom-dropdown-panel.show, .user-dropdown-card.show")
        .forEach((p) => {
          p.classList.remove("show");
        });
    }
  });

  // Theme Switching (Dark / Light Mode)
  const themeToggle =
    document.getElementById("themeToggle") || document.querySelector(".btn-theme-toggle");
  const savedTheme = localStorage.getItem("az_dashboard_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("az_dashboard_theme", next);
      toast.show(`تم تفعيل ${next === "dark" ? "الوضع الليلي" : "الوضع النهاري"}`, "info");
    });
  }

  // Intercept all prototype forms to provide real feedback and prevent standard page reloads
  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (form.classList.contains("auth-form") || form.id === "loginForm") return; // Handled by auth.js

    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      const original = submitBtn.innerHTML;
      submitBtn.innerHTML = "<span>جاري الحفظ...</span>";
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
        const msg =
          form.getAttribute("data-form-toast") ||
          form.getAttribute("data-toast-msg") ||
          "تم حفظ البيانات بنجاح!";
        toast.show(msg, "success");
        modalManager.close();

        const redirectUrl = form.getAttribute("data-form-redirect");
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 800);
        }
      }, 400);
    } else {
      const msg =
        form.getAttribute("data-form-toast") ||
        form.getAttribute("data-toast-msg") ||
        "تمت العملية بنجاح!";
      toast.show(msg, "success");
      const redirectUrl = form.getAttribute("data-form-redirect");
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 800);
      }
    }
  });
}

// ==========================================================================
function initDashboard() {
  renderSupervisorsTable();
  renderServicesTable();
  renderPackagesTable();
  renderSettingsTables();
  initSettingsAccordions();
  initAppShell();

  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDashboard);
} else {
  initDashboard();
}

if (typeof window !== "undefined") {
  window.toast = toast;
  window.modalManager = modalManager;
}
