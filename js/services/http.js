/**
 * AZ Studio - Universal HTTP Client & Interceptor
 * Features:
 * - Bearer Token Injection
 * - Unified Error Handling (401, 403, 422, 500)
 * - Automatic Mock Fallback via API_CONFIG.USE_MOCK
 * - Request Timeouts & AbortController support
 */

import { API_CONFIG } from '../config/api.config.js';
import { ApiClient } from './apiClient.js';
import { toast } from '../components/ToastManager.js';

export class HttpClient {
  /**
   * Get Authorization Headers
   */
  static getHeaders(customHeaders = {}) {
    const token = localStorage.getItem('az_auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...customHeaders
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Universal Request Handler
   */
  static async request(endpoint, options = {}) {
    // If Mock Mode is enabled, route through local mock persistence
    if (API_CONFIG.USE_MOCK) {
      return this.handleMockRequest(endpoint, options);
    }

    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    const config = {
      method: options.method || 'GET',
      headers: this.getHeaders(options.headers),
      signal: controller.signal,
      ...options
    };

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle 401 Unauthorized (Session Expired)
      if (response.status === 401) {
        localStorage.removeItem('az_auth_token');
        localStorage.removeItem('az_auth_user');
        toast.show('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى', 'warning');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
        throw new Error('Unauthorized');
      }

      // Handle 403 Forbidden
      if (response.status === 403) {
        toast.show('ليس لديك صلاحية لتنفيذ هذا الإجراء', 'error');
        throw new Error('Forbidden');
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = data?.message || `حدث خطأ في الخادم (رمز ${response.status})`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        toast.show('انتهت مهلة الطلب، يرجى التحقق من اتصال الإنترنت', 'error');
      }
      throw err;
    }
  }

  /**
   * Internal Mock Request Router
   */
  static async handleMockRequest(endpoint, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const resource = endpoint.split('/')[1]?.split('?')[0] || 'general';

    // Parse simple resource routing
    if (method === 'GET') {
      const idMatch = endpoint.match(/\/([^\/]+)\/([^\/?]+)/);
      if (idMatch && idMatch[2] && idMatch[2] !== 'export') {
        return ApiClient.getById(idMatch[1], idMatch[2]);
      }
      return ApiClient.getAll(resource);
    }

    if (method === 'POST') {
      return ApiClient.create(resource, options.body);
    }

    if (method === 'PUT' || method === 'PATCH') {
      const idMatch = endpoint.match(/\/([^\/]+)\/([^\/?]+)/);
      const id = idMatch ? idMatch[2] : options.body?.id;
      return ApiClient.update(resource, id, options.body);
    }

    if (method === 'DELETE') {
      const idMatch = endpoint.match(/\/([^\/]+)\/([^\/?]+)/);
      const id = idMatch ? idMatch[2] : null;
      return ApiClient.delete(resource, id);
    }

    return { success: true };
  }

  // Convenience Methods
  static get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  static post(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, { method: 'POST', body, headers });
  }

  static put(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, { method: 'PUT', body, headers });
  }

  static patch(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, { method: 'PATCH', body, headers });
  }

  static delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}
