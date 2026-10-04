/**
 * AZ Studio - Services & Packages API Service
 */

import { HttpClient } from "./http.js";
import { API_CONFIG } from "../config/api.config.js";

export const ServicesApi = {
  async getServices(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `${API_CONFIG.ENDPOINTS.SERVICES.LIST}?${query}`
      : API_CONFIG.ENDPOINTS.SERVICES.LIST;
    return HttpClient.get(endpoint);
  },

  async getServiceById(id) {
    return HttpClient.get(API_CONFIG.ENDPOINTS.SERVICES.DETAIL(id));
  },

  async createService(data) {
    return HttpClient.post(API_CONFIG.ENDPOINTS.SERVICES.CREATE, data);
  },

  async updateService(id, data) {
    return HttpClient.put(API_CONFIG.ENDPOINTS.SERVICES.UPDATE(id), data);
  },

  async deleteService(id) {
    return HttpClient.delete(API_CONFIG.ENDPOINTS.SERVICES.DELETE(id));
  },
};

export const PackagesApi = {
  async getPackages(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `${API_CONFIG.ENDPOINTS.PACKAGES.LIST}?${query}`
      : API_CONFIG.ENDPOINTS.PACKAGES.LIST;
    return HttpClient.get(endpoint);
  },

  async getPackageById(id) {
    return HttpClient.get(API_CONFIG.ENDPOINTS.PACKAGES.DETAIL(id));
  },

  async createPackage(data) {
    return HttpClient.post(API_CONFIG.ENDPOINTS.PACKAGES.CREATE, data);
  },

  async updatePackage(id, data) {
    return HttpClient.put(API_CONFIG.ENDPOINTS.PACKAGES.UPDATE(id), data);
  },

  async deletePackage(id) {
    return HttpClient.delete(API_CONFIG.ENDPOINTS.PACKAGES.DELETE(id));
  },
};
