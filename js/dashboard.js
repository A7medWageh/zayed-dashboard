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

/* ==========================================================================
   1. Toast Notification System
   ========================================================================== */
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

/* ==========================================================================
   2. Universal Modal Manager
   ========================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Close any already opened modals
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

  // Restore scroll if no active modals left
  if (!document.querySelector('.modal-overlay.active')) {
    document.body.style.overflow = '';
  }
}

function initModals() {
  // Open triggers via data-modal-target
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-target]');
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-target');
      
      // Dynamic row data population for view/edit/delete triggers
      const row = trigger.closest('tr');
      if (row) {
        populateModalFromRow(modalId, row, trigger);
      }
      
      openModal(modalId);
    }
  });

  // Close triggers via data-modal-close or .btn-modal-close
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-modal-close], .modal-close-btn, .btn-modal-cancel');
    if (closeBtn) {
      e.preventDefault();
      const modal = closeBtn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    }
  });

  // Click on background overlay to close
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Keyboard Escape key handler
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

  // Extract cell texts
  const cells = row.querySelectorAll('td');
  if (cells.length === 0) return;

  // Check modal type
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
    document.querySelectorAll('.dropdown-menu, .custom-dropdown-panel, .user-dropdown-card').forEach(menu => {
      menu.classList.remove('active');
    });
  }

  // Toggle user dropdown on click
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

  // Toggle notifications on click
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

  // Close dropdowns when clicking any item inside them (e.g. modals trigger)
  document.querySelectorAll('.user-dropdown-item, .dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      closeAllDropdowns();
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-dropdown-card') && 
        !e.target.closest('.user-profile-widget') && 
        !e.target.closest('.notif-bell-btn') && 
        !e.target.closest('.custom-dropdown-panel') &&
        !e.target.closest('[data-dropdown-toggle]')) {
      closeAllDropdowns();
    }
  });

  // Close on Escape key
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
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Accordion Submenu Toggle for (الطلبات, الباقات, اعدادات الموقع الالكتروني)
  document.querySelectorAll('.sidebar-group').forEach(group => {
    const toggleBtn = group.querySelector('.sidebar-accordion-toggle, :scope > .sidebar-item');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        const submenu = group.querySelector('.sidebar-submenu');
        if (submenu) {
          e.preventDefault();
          e.stopPropagation();
          const isCurrentlyOpen = group.classList.contains('open');
          
          // Close all other sidebar groups so only one is open at a time
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

  // Close mobile sidebar when clicking a subitem or non-accordion link
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
  // Quotation Submission Form
  const quoteForm = document.getElementById('createQuoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('viewOrderModal');
      showToast('تم إرسال عرض السعر للعميل بنجاح!', 'success');
      quoteForm.reset();
    });
  }

  // Reject Order Action
  const rejectOrderBtn = document.getElementById('btnRejectOrder');
  if (rejectOrderBtn) {
    rejectOrderBtn.addEventListener('click', () => {
      closeModal('viewOrderModal');
      showToast('تم تحديث حالة الطلب إلى "مرفوض"', 'info');
    });
  }

  // Add / Edit Service Form
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

  // Add / Edit Package Form
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

  // Add / Edit Supervisor Form
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

  // Add / Edit Role Form
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

  // Export Data Form
  const exportForm = document.getElementById('exportForm');
  if (exportForm) {
    exportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('exportModal');
      showToast('جاري إنشاء وتحميل ملف التصدير...', 'success');
    });
  }

  // Edit Profile Form
  const editProfileForm = document.getElementById('editProfileForm');
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('editProfileModal');
      showToast('تم تحديث بيانات الملف الشخصي بنجاح!', 'success');
    });
  }

  // Change Password Form
  const changePassForm = document.getElementById('changePasswordForm');
  if (changePassForm) {
    changePassForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('changePasswordModal');
      showToast('تم تغيير كلمة المرور بنجاح!', 'success');
      changePassForm.reset();
    });
  }

  // Delete Confirm Button
  const confirmDeleteBtn = document.getElementById('btnConfirmDelete');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      closeModal();
      showToast('تم حذف العنصر بنجاح!', 'success');
    });
  }

  // Contact Message Action
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

  // Handle URL query parameter ?tab=...
  const urlParams = new URLSearchParams(window.location.search);
  const currentTab = urlParams.get('tab') || 'home';
  switchTab(currentTab);

  // Handle in-page tab link clicks
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

  // Search in outputs table
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

  // Search in sectors table
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

  // Search in FAQs table
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
   9. Contact Messages Cards Actions (Figma 1:1 Matching)
   ========================================================================== */
function initContactCards() {
  let cardPendingDelete = null;

  // Toggle contact card dropdown on clicking three dots
  document.addEventListener('click', (e) => {
    const dotsBtn = e.target.closest('.contact-dots-btn');
    const allDropdowns = document.querySelectorAll('.contact-card-dropdown');

    if (dotsBtn) {
      e.stopPropagation();
      const card = dotsBtn.closest('.contact-msg-card');
      const dropdown = card?.querySelector('.contact-card-dropdown');
      
      // Close other open contact dropdowns
      allDropdowns.forEach(d => {
        if (d !== dropdown) d.classList.remove('active');
      });

      if (dropdown) {
        dropdown.classList.toggle('active');
      }
      return;
    }

    // Close dropdown if clicked outside
    if (!e.target.closest('.contact-card-dropdown')) {
      allDropdowns.forEach(d => d.classList.remove('active'));
    }
  });

  // Action: Mark as Contacted
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

  // Action: Delete Contact Message
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

  // When Confirm Delete is clicked in deleteModal
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

