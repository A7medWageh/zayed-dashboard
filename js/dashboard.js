/**
 * AZ STUDIO - COMPLETE DASHBOARD INTERACTION SYSTEM
 * Supports: Universal Modals, Dropdowns, Sidebar Toggle, Search/Filter,
 * Form Validation, Dynamic Data Injection, Toast Notifications, Theme Switching
 */

document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initDropdowns();
  initSidebar();
  initTheme();
  initTableSearchAndFilters();
  initFormsAndToasts();
  initSettingsTabs();
  initContactCards();
  initPageTransitions();
});

/* ==================== Toast System Start ==================== */
function showToast(message, type = 'success') {
  let toast = document.getElementById('dashboardToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dashboardToast';
    toast.className = 'dashboard-toast';
    document.body.appendChild(toast);
  }

  const icons = {
    success: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    info: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  };

  toast.innerHTML = `
    <div class="toast-content ${type}">
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <span class="toast-text">${message}</span>
    </div>
  `;
  
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
window.showToast = showToast;

/* ==================== Modal Manager Start ==================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  document.querySelectorAll('.modal-overlay.active').forEach(m => {
    if (m !== modal) m.classList.remove('active');
  });

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalOrId) {
  let modal = typeof modalOrId === 'string' ? document.getElementById(modalOrId) : modalOrId;
  if (!modal) {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  } else {
    modal.classList.remove('active');
  }

  if (!document.querySelector('.modal-overlay.active')) {
    document.body.style.overflow = '';
  }
}
window.openModal = openModal;
window.closeModal = closeModal;

function initModals() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-target]');
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-target');
      
      const row = trigger.closest('tr');
      if (row) {
        populateModalFromRow(modalId, row, trigger);
      }
      
      openModal(modalId);
    }
  });

  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-modal-close], .modal-close-btn, .btn-modal-cancel');
    if (closeBtn) {
      e.preventDefault();
      const modal = closeBtn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    }
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

/**
 * Dynamically populates modals with contextual data from table rows
 */
function populateModalFromRow(modalId, row, trigger) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  const cells = row.querySelectorAll('td');
  if (cells.length === 0) return;

  if (modalId === 'viewOrderModal') {
    const code = cells[0]?.textContent.trim() || '#1020';
    const client = cells[1]?.textContent.trim() || 'محمد السيد';
    const phone = cells[2]?.textContent.trim() || '01210229016';
    const email = cells[3]?.textContent.trim() || 'mohamed@icloud.com';
    const date = cells[4]?.textContent.trim() || '10/2/2025';
    const service = cells[5]?.textContent.trim() || 'انتاج فديو مؤسسي';
    const budget = cells[7]?.textContent.trim() || '3000 ر.س';

    const orderIdEl = modal.querySelector('#modalOrderCode');
    const clientEl = modal.querySelector('#modalOrderClient');
    const phoneEl = modal.querySelector('#modalOrderPhone');
    const emailEl = modal.querySelector('#modalOrderEmail');
    const serviceEl = modal.querySelector('#modalOrderService');
    const dateEl = modal.querySelector('#modalOrderDate');
    const budgetEl = modal.querySelector('#modalOrderBudget');

    if (orderIdEl) orderIdEl.textContent = code;
    if (clientEl) clientEl.textContent = client;
    if (phoneEl) phoneEl.textContent = phone;
    if (emailEl) emailEl.textContent = email;
    if (serviceEl) serviceEl.textContent = service;
    if (dateEl) dateEl.textContent = date;
    if (budgetEl) budgetEl.textContent = budget;
  } else if (modalId === 'deleteModal' || modalId.includes('delete')) {
    const itemName = cells[1]?.textContent.trim() || cells[0]?.textContent.trim() || 'هذا العنصر';
    const targetLabel = modal.querySelector('.delete-item-name');
    if (targetLabel) targetLabel.textContent = itemName;
  } else if (modalId === 'viewContactModal') {
    const client = cells[1]?.textContent.trim() || 'محمد احمد';
    const phone = cells[2]?.textContent.trim() || '01210229015';
    const email = cells[3]?.textContent.trim() || 'mohamedmoatasem@icloud.com';
    const subject = cells[5]?.textContent.trim() || 'انشاء فديو موشن جرافك';

    const clientEl = modal.querySelector('#modalContactClient');
    const phoneEl = modal.querySelector('#modalContactPhone');
    const emailEl = modal.querySelector('#modalContactEmail');
    const subjectEl = modal.querySelector('#modalContactSubject');

    if (clientEl) clientEl.textContent = client;
    if (phoneEl) phoneEl.textContent = phone;
    if (emailEl) emailEl.textContent = email;
    if (subjectEl) subjectEl.textContent = subject;
  }
}

/* ==========================================================================
   3. Dropdowns (User Menu, Notifications, Filters)
   ========================================================================== */
function initDropdowns() {
  const userProfileWidget = document.querySelector('.user-profile-widget');
  const userDropdown = document.getElementById('userDropdown');
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');

  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu, .custom-dropdown-panel, .user-dropdown-card, .export-dropdown-menu').forEach(menu => {
      menu.classList.remove('active');
    });
  }

  if (userProfileWidget && userDropdown) {
    userProfileWidget.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = userDropdown.classList.contains('active');
      closeAllDropdowns();
      if (!isActive) {
        userDropdown.classList.add('active');
      }
    });
  }

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = notifDropdown.classList.contains('active');
      closeAllDropdowns();
      if (!isActive) {
        notifDropdown.classList.add('active');
      }
    });
  }

  // Export dropdown buttons
  document.querySelectorAll('#exportDropdownBtn, .btn-export').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wrap = btn.closest('.export-btn-wrap');
      const menu = wrap ? wrap.querySelector('.export-dropdown-menu') : document.getElementById('exportMenu');
      if (menu) {
        const isActive = menu.classList.contains('active');
        closeAllDropdowns();
        if (!isActive) {
          menu.classList.add('active');
        }
      }
    });
  });

  // Chart and Table card range filter buttons
  document.querySelectorAll('.card-dropdown-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast('تم تحديث نطاق العرض الزمني', 'info');
    });
  });

  document.querySelectorAll('.user-dropdown-item, .dropdown-item, .export-item').forEach(item => {
    item.addEventListener('click', () => {
      closeAllDropdowns();
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target || typeof e.target.closest !== 'function') return;
    if (!e.target.closest('.user-dropdown-card') && 
        !e.target.closest('.user-profile-widget') && 
        !e.target.closest('.notif-bell-btn') && 
        !e.target.closest('.custom-dropdown-panel') &&
        !e.target.closest('.export-btn-wrap') &&
        !e.target.closest('.export-dropdown-menu') &&
        !e.target.closest('[data-dropdown-toggle]')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });
}

/* ==========================================================================
   4. Mobile Sidebar Management
   ========================================================================== */
function initSidebar() {
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const sidebarClose = document.getElementById('sidebarCloseBtn');
  const sidebar = document.querySelector('.sidebar');
  let overlay = document.getElementById('sidebarOverlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sidebarOverlay';
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  function openSidebar() {
    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.classList.add('sidebar-open');
    document.documentElement.classList.add('sidebar-open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
    document.documentElement.classList.remove('sidebar-open');
    document.body.style.overflow = '';
  }

  function toggleSidebar() {
    if (!sidebar) return;
    if (
      sidebar.classList.contains('active') ||
      document.body.classList.contains('sidebar-open')
    ) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    });
  }
  if (sidebarClose) {
    sidebarClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeSidebar();
    });
  }
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeSidebar();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
    }
  });

  document.querySelectorAll('.sidebar-group').forEach(group => {
    const toggleBtn = group.querySelector('.sidebar-accordion-toggle, :scope > .sidebar-item');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        const submenu = group.querySelector('.sidebar-submenu');
        if (submenu) {
          e.preventDefault();
          e.stopPropagation();
          const isCurrentlyOpen = group.classList.contains('open');
          
          document.querySelectorAll('.sidebar-group').forEach(otherGroup => {
            if (otherGroup !== group) {
              otherGroup.classList.remove('open');
            }
          });

          if (isCurrentlyOpen) {
            group.classList.remove('open');
          } else {
            group.classList.add('open');
          }
        }
      });
    }
  });

  document.querySelectorAll('.sidebar-subitem, .sidebar-item:not(.sidebar-accordion-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 991 && !link.closest('.sidebar-group:not(.open)')) {
        closeSidebar();
      }
    });
  });
}

/* ==========================================================================
   5. Dark / Light Mode Switching
   ========================================================================== */
function updateLogos(theme) {
  document.querySelectorAll('img[src*="az-studio-logo"]').forEach(img => {
    if (theme === 'dark') {
      img.src = img.src.replace('az-studio-logo.svg', 'az-studio-logo-white.svg');
    } else {
      img.src = img.src.replace('az-studio-logo-white.svg', 'az-studio-logo.svg');
    }
  });
}

function initTheme() {
  const currentTheme = localStorage.getItem('az_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateLogos(currentTheme);

  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('#themeToggleBtn, .theme-toggle-btn');
    if (themeBtn) {
      e.preventDefault();
      const active = document.documentElement.getAttribute('data-theme') || 'light';
      const next = active === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('az_theme', next);
      updateLogos(next);
      showToast(next === 'dark' ? 'تم تفعيل الوضع الليلي 🌙' : 'تم تفعيل الوضع النهاري ☀️', 'info');
    }
  });
}

/* ==========================================================================
   6. Table Search & Quick Filter
   ========================================================================== */
function initTableSearchAndFilters() {
  const searchInputs = document.querySelectorAll('.table-search-input, input[placeholder*="البحث"]');
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const table = input.closest('main, section, .table-card-container')?.querySelector('table');
      if (!table) return;

      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  });
}

/* ==========================================================================
   7. Form Submissions & Modal Actions
   ========================================================================== */
function initFormsAndToasts() {
  const quoteForm = document.getElementById('createQuoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('viewOrderModal');
      showToast('تم إرسال عرض السعر للعميل بنجاح!', 'success');
      quoteForm.reset();
    });
  }

  const rejectOrderBtn = document.getElementById('btnRejectOrder');
  if (rejectOrderBtn) {
    rejectOrderBtn.addEventListener('click', () => {
      closeModal('viewOrderModal');
      showToast('تم تحديث حالة الطلب إلى "مرفوض"', 'info');
    });
  }

  const serviceForm = document.getElementById('serviceForm');
  if (serviceForm) {
    serviceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('serviceModal');
      closeModal('addServiceModal');
      showToast('تم حفظ بيانات الخدمة بنجاح!', 'success');
      serviceForm.reset();
    });
  }

  const packageForm = document.getElementById('packageForm');
  if (packageForm) {
    packageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('packageModal');
      closeModal('addPackageModal');
      showToast('تم حفظ بيانات الباقة بنجاح!', 'success');
      packageForm.reset();
    });
  }

  const supervisorForm = document.getElementById('supervisorForm');
  if (supervisorForm) {
    supervisorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('supervisorModal');
      closeModal('addSupervisorModal');
      showToast('تم حفظ بيانات المشرف بنجاح!', 'success');
      supervisorForm.reset();
    });
  }

  const roleForm = document.getElementById('roleForm');
  if (roleForm) {
    roleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('roleModal');
      closeModal('addRoleModal');
      showToast('تم حفظ الدور والصلاحيات بنجاح!', 'success');
      roleForm.reset();
    });
  }

  const exportForm = document.getElementById('exportForm');
  if (exportForm) {
    exportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('exportModal');
      showToast('جاري إنشاء وتحميل ملف التصدير...', 'success');
    });
  }

  const editProfileForm = document.getElementById('editProfileForm');
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('editProfileModal');
      showToast('تم تحديث بيانات الملف الشخصي بنجاح!', 'success');
    });
  }

  const changePassForm = document.getElementById('changePasswordForm');
  if (changePassForm) {
    changePassForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('changePasswordModal');
      showToast('تم تغيير كلمة المرور بنجاح!', 'success');
      changePassForm.reset();
    });
  }

  const confirmDeleteBtn = document.getElementById('btnConfirmDelete');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      closeModal();
      showToast('تم حذف العنصر بنجاح!', 'success');
    });
  }

  const btnMarkContacted = document.getElementById('btnMarkContacted');
  if (btnMarkContacted) {
    btnMarkContacted.addEventListener('click', () => {
      closeModal('viewContactModal');
      showToast('تم تعيين حالة الرسالة إلى "تم التواصل"', 'success');
    });
  }
}

/* ==========================================================================
   8. Settings Tabs Navigation
   ========================================================================== */
function initSettingsTabs() {
  const panels = document.querySelectorAll('.settings-tab-panel');
  const links = document.querySelectorAll('[data-tab-link]');

  if (panels.length === 0) return;

  function switchTab(tabKey) {
    if (!tabKey) tabKey = 'home';
    const targetId = `tab-${tabKey.replace(/^tab-/, '')}`;
    
    panels.forEach(p => {
      if (p.id === targetId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    links.forEach(link => {
      const linkTarget = link.getAttribute('data-tab-link');
      if (linkTarget === targetId || link.getAttribute('href')?.includes(`tab=${tabKey}`)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const currentTab = urlParams.get('tab') || 'home';
  switchTab(currentTab);

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('settings.html?tab=')) {
        e.preventDefault();
        const tabVal = href.split('tab=')[1];
        history.pushState(null, '', `settings.html?tab=${tabVal}`);
        switchTab(tabVal);
      }
    });
  });

  const outputsSearch = document.getElementById('outputsSearchInput');
  const outputsBody = document.getElementById('outputsTableBody');
  if (outputsSearch && outputsBody) {
    outputsSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = outputsBody.querySelectorAll('tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  const sectorsSearch = document.getElementById('sectorsSearchInput');
  const sectorsBody = document.getElementById('sectorsTableBody');
  if (sectorsSearch && sectorsBody) {
    sectorsSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = sectorsBody.querySelectorAll('tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  const faqSearch = document.getElementById('faqSearchInput');
  const faqBody = document.getElementById('faqTableBody');
  if (faqSearch && faqBody) {
    faqSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = faqBody.querySelectorAll('tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }
}

/* ==========================================================================
   9. Contact Messages Cards Actions 
   ========================================================================== */
function initContactCards() {
  let cardPendingDelete = null;

  document.addEventListener('click', (e) => {
    const dotsBtn = e.target.closest('.contact-dots-btn');
    const allDropdowns = document.querySelectorAll('.contact-card-dropdown');

    if (dotsBtn) {
      e.stopPropagation();
      const card = dotsBtn.closest('.contact-msg-card');
      const dropdown = card?.querySelector('.contact-card-dropdown');
      
      allDropdowns.forEach(d => {
        if (d !== dropdown) d.classList.remove('active');
      });

      if (dropdown) {
        dropdown.classList.toggle('active');
      }
      return;
    }

    if (!e.target.closest('.contact-card-dropdown')) {
      allDropdowns.forEach(d => d.classList.remove('active'));
    }
  });

  document.addEventListener('click', (e) => {
    const contactedBtn = e.target.closest('.contact-dropdown-item.contacted-item');
    if (contactedBtn) {
      e.preventDefault();
      const card = contactedBtn.closest('.contact-msg-card');
      if (card) {
        const statusVal = card.querySelector('.contact-status-val');
        if (statusVal) {
          statusVal.textContent = 'تم التواصل';
          statusVal.style.color = '#10B981';
          statusVal.style.fontWeight = '700';
        }
        const dropdown = card.querySelector('.contact-card-dropdown');
        if (dropdown) dropdown.classList.remove('active');
      }
      showToast('تم تعيين حالة التواصل إلى "تم التواصل" بنجاح', 'success');
    }
  });

  document.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.contact-dropdown-item.delete-item');
    if (deleteBtn) {
      e.preventDefault();
      const card = deleteBtn.closest('.contact-msg-card');
      cardPendingDelete = card;
      const dropdown = card?.querySelector('.contact-card-dropdown');
      if (dropdown) dropdown.classList.remove('active');
      openModal('deleteModal');
    }
  });

  const confirmDeleteBtn = document.getElementById('btnConfirmDelete');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (cardPendingDelete) {
        cardPendingDelete.style.transition = 'all 0.3s ease';
        cardPendingDelete.style.opacity = '0';
        cardPendingDelete.style.transform = 'scale(0.95)';
        setTimeout(() => {
          cardPendingDelete.remove();
          cardPendingDelete = null;
        }, 300);
      }
    });
  }
}

/* ==========================================================================
   10. Smooth Sidebar & Page Navigation Transitions
   ========================================================================== */
function initPageTransitions() {
  const navLinks = document.querySelectorAll('.sidebar-item[href], .sidebar-subitem[href]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      
      const targetUrl = new URL(href, window.location.href);
      if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
        return;
      }
      
      e.preventDefault();
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.transition = 'opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1)';
        mainContent.style.opacity = '0';
      }
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    });
  });
}

/* ==========================================================================
   11. Global Dynamic Helpers (Settings Cards, Accordions, Passwords)
   ========================================================================== */
function toggleSettingsCard(header) {
  const card = header.closest('.settings-section-card');
  if (card) {
    card.classList.toggle('open');
  }
}

function addSettingDynamicCard(containerId, titlePrefix) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const count = container.querySelectorAll('.setting-dynamic-card').length + 1;
  const card = document.createElement('div');
  card.className = 'setting-dynamic-card';
  card.innerHTML = `
    <div class="setting-card-head">
      <span class="setting-card-title">${titlePrefix} رقم ${count}</span>
      <button type="button" class="btn-card-delete" onclick="removeSettingCard(this)" title="حذف">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    </div>
    <div class="modal-form-row">
      <div class="modal-form-group"><label class="modal-label">العنوان ( AR )</label><input type="text" class="modal-input" placeholder="ادخل العنوان"></div>
      <div class="modal-form-group"><label class="modal-label">العنوان ( EN )</label><input type="text" class="modal-input" placeholder="ادخل العنوان"></div>
    </div>
    <div class="modal-form-row" style="margin-top: 10px;">
      <div class="modal-form-group"><label class="modal-label">الوصف ( AR )</label><input type="text" class="modal-input" placeholder="ادخل الوصف"></div>
      <div class="modal-form-group"><label class="modal-label">الوصف ( EN )</label><input type="text" class="modal-input" placeholder="ادخل الوصف"></div>
    </div>
  `;
  container.appendChild(card);
  showToast('تمت إضافة بطاقة جديدة', 'info');
}

function removeSettingCard(btn) {
  const card = btn.closest('.setting-dynamic-card');
  if (card) {
    card.style.transition = 'all 0.25s ease';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.remove();
      showToast('تم حذف البطاقة', 'info');
    }, 250);
  }
}

function toggleInputPass(id) {
  const el = document.getElementById(id);
  if (el) el.type = el.type === 'password' ? 'text' : 'password';
}

function togglePasswordVisibility(btn) {
  const wrap = btn.closest('.modal-input-eye-wrap');
  if (!wrap) return;
  const input = wrap.querySelector('input');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  } else {
    input.type = 'password';
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }
}

if (typeof window !== 'undefined') {
  window.toggleSettingsCard = toggleSettingsCard;
  window.addSettingDynamicCard = addSettingDynamicCard;
  window.removeSettingCard = removeSettingCard;
  window.toggleInputPass = toggleInputPass;
  window.togglePasswordVisibility = togglePasswordVisibility;
}

