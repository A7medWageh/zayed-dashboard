/**
 * AZ Studio - Orders & Quotations API Service
 */

import { HttpClient } from "./http.js";
import { API_CONFIG } from "../config/api.config.js";

export const OrdersApi = {
  /**
   * Fetch all orders with optional search and status filters
   */
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `${API_CONFIG.ENDPOINTS.ORDERS.LIST}?${query}`
      : API_CONFIG.ENDPOINTS.ORDERS.LIST;
    return HttpClient.get(endpoint);
  },

  /**
   * Fetch single order details by ID
   */
  async getOrderById(id) {
    return HttpClient.get(API_CONFIG.ENDPOINTS.ORDERS.DETAIL(id));
  },

  /**
   * Update Order Status (e.g. pending, in_progress, completed, rejected)
   */
  async updateStatus(id, status) {
    return HttpClient.patch(API_CONFIG.ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status });
  },

  /**
   * Send quotation or price proposal to client
   */
  async sendQuotation(id, quoteData) {
    return HttpClient.post(API_CONFIG.ENDPOINTS.ORDERS.SEND_QUOTE(id), quoteData);
  },

  /**
   * Export orders report (Excel/PDF/CSV)
   */
  async exportOrders(format = "excel") {
    return HttpClient.get(`${API_CONFIG.ENDPOINTS.ORDERS.EXPORT}?format=${format}`);
  },
};
