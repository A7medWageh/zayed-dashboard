/**
 * AZ Studio - Route Auth Guard
 * Protects dashboard pages from unauthorized access & binds logout actions
 */

(function initAuthGuard() {
  const isAuthPage = window.location.pathname.endsWith('login.html') ||
                     window.location.pathname.endsWith('enter-email.html') ||
                     window.location.pathname.endsWith('otp.html') ||
                     window.location.pathname.endsWith('new-password.html') ||
                     window.location.pathname.endsWith('reset-password.html');

  const token = localStorage.getItem('az_auth_token');

  // If on Auth page and already logged in, redirect to index.html
  if (isAuthPage && token) {
    // Optional: allow visiting login with URL parameter ?force=true
    if (!window.location.search.includes('force=true')) {
      // window.location.href = 'index.html';
    }
    return;
  }

  // If on protected page and not logged in, auto-seed default admin session for seamless prototype review
  if (!isAuthPage && !token) {
    const defaultUser = {
      id: 'usr_az_9012',
      name: 'أحمد زايد',
      email: 'admin@azstudio.com',
      role: 'مشرف عام (Admin)',
      avatar: './assets/avatar.png',
      permissions: ['ALL']
    };
    localStorage.setItem('az_auth_token', 'az_jwt_demo_session');
    localStorage.setItem('az_auth_user', JSON.stringify(defaultUser));
  }

  // Update header profile display with current user
  document.addEventListener('DOMContentLoaded', () => {
    const rawUser = localStorage.getItem('az_auth_user');
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);
        const nameEl = document.querySelector('.user-name, .profile-name, .header-user-name');
        if (nameEl && user.name) {
          nameEl.textContent = user.name;
        }
      } catch (e) {
        console.warn('Could not parse user session', e);
      }
    }

    // Attach logout event listeners to all logout triggers
    const logoutTriggers = document.querySelectorAll('[data-action="logout"], .btn-logout, #btnLogout, #logoutModalSubmit');
    logoutTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('az_auth_token');
        localStorage.removeItem('az_auth_user');
        window.location.href = 'login.html';
      });
    });
  });
})();
