/**
 * AZ Studio - Accessible Modal Manager
 * Supports: Focus trapping, Escape key listener, ARIA dialog attributes, Focus restoration
 */

class ModalManager {
  constructor() {
    this.activeModal = null;
    this.lastFocusedElement = null;
    this.focusTrapHandler = this.handleFocusTrap.bind(this);
    this.keydownHandler = this.handleKeyDown.bind(this);
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    // Delegate clicks for opening & closing modals
    document.addEventListener('click', (e) => {
      // Trigger to open modal
      const openTrigger = e.target.closest('[data-modal-target]');
      if (openTrigger) {
        e.preventDefault();
        const targetId = openTrigger.getAttribute('data-modal-target');
        this.open(targetId, openTrigger);
        return;
      }

      // Trigger to close modal
      const closeTrigger = e.target.closest('[data-modal-close], .btn-modal-close, .modal-close');
      if (closeTrigger) {
        e.preventDefault();
        const modal = closeTrigger.closest('.modal-overlay, .modal-backdrop');
        if (modal) {
          this.close(modal.id);
        }
        return;
      }

      // Click on backdrop to close
      if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-backdrop')) {
        this.close(e.target.id);
      }
    });

    // Global Keydown (Escape key)
    document.addEventListener('keydown', this.keydownHandler);
  }

  /**
   * Open modal by ID with accessible semantics & focus trapping
   * @param {string} modalId 
   * @param {HTMLElement} [triggerElement] 
   */
  open(modalId, triggerElement = null) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.lastFocusedElement = triggerElement || document.activeElement;

    // Accessibility attributes
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'false');

    modal.classList.add('active', 'show');
    document.body.style.overflow = 'hidden';
    this.activeModal = modal;

    // Focus first focusable element inside modal
    setTimeout(() => {
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, 50);

    modal.addEventListener('keydown', this.focusTrapHandler);
  }

  /**
   * Close modal by ID and restore focus
   * @param {string} [modalId] 
   */
  close(modalId) {
    const modal = modalId ? document.getElementById(modalId) : this.activeModal;
    if (!modal) return;

    modal.classList.remove('active', 'show');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeEventListener('keydown', this.focusTrapHandler);

    // If no other modals are active, restore body scroll
    const activeModals = document.querySelectorAll('.modal-overlay.active, .modal-backdrop.active, .modal-overlay.show');
    if (activeModals.length === 0) {
      document.body.style.overflow = '';
    }

    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }

    this.activeModal = null;
  }

  handleKeyDown(e) {
    if (e.key === 'Escape' && this.activeModal) {
      this.close(this.activeModal.id);
    }
  }

  handleFocusTrap(e) {
    if (e.key !== 'Tab' || !this.activeModal) return;

    const focusables = Array.from(this.activeModal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));

    if (focusables.length === 0) return;

    const firstElement = focusables[0];
    const lastElement = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
}

export const modal = new ModalManager();

if (typeof window !== 'undefined') {
  window.modalManager = modal;
  window.openModal = (id) => modal.open(id);
  window.closeModal = (id) => modal.close(id);
}
