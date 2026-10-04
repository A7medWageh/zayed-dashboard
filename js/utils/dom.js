/**
 * AZ Studio - Safe DOM & Utility Helpers
 */

/**
 * Escapes HTML characters to prevent XSS vulnerabilities
 * @param {string} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats a number to Saudi Riyal format
 * @param {number|string} amount 
 * @returns {string}
 */
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `${num.toLocaleString('ar-SA')} ر.س`;
}

/**
 * Formats a Date object or ISO string to Arabic display
 * @param {string|Date} date 
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Creates an element with attributes and safe children
 */
export function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => {
    if (key === 'className') {
      el.className = val;
    } else if (key === 'dataset') {
      Object.entries(val).forEach(([dKey, dVal]) => {
        el.dataset[dKey] = dVal;
      });
    } else if (key.startsWith('on') && typeof val === 'function') {
      el.addEventListener(key.substring(2).toLowerCase(), val);
    } else {
      el.setAttribute(key, val);
    }
  });

  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  });

  return el;
}
