/**
 * AZ Studio - Supervisors, Roles & CMS Settings API Services
 */

import { HttpClient } from "./http.js";
import { API_CONFIG } from "../config/api.config.js";

export const SupervisorsApi = {
  async getSupervisors(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `${API_CONFIG.ENDPOINTS.SUPERVISORS.LIST}?${query}`
      : API_CONFIG.ENDPOINTS.SUPERVISORS.LIST;
    return HttpClient.get(endpoint);
  },

  async getSupervisorById(id) {
    return HttpClient.get(API_CONFIG.ENDPOINTS.SUPERVISORS.DETAIL(id));
  },

  async createSupervisor(data) {
    return HttpClient.post(API_CONFIG.ENDPOINTS.SUPERVISORS.CREATE, data);
  },

  async updateSupervisor(id, data) {
    return HttpClient.put(API_CONFIG.ENDPOINTS.SUPERVISORS.UPDATE(id), data);
  },

  async toggleStatus(id) {
    return HttpClient.patch(API_CONFIG.ENDPOINTS.SUPERVISORS.TOGGLE_STATUS(id));
  },

  async deleteSupervisor(id) {
    return HttpClient.delete(API_CONFIG.ENDPOINTS.SUPERVISORS.DELETE(id));
  },
};

export const RolesApi = {
  async getRoles(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `${API_CONFIG.ENDPOINTS.ROLES.LIST}?${query}`
      : API_CONFIG.ENDPOINTS.ROLES.LIST;
    return HttpClient.get(endpoint);
  },

  async getRoleById(id) {
    return HttpClient.get(API_CONFIG.ENDPOINTS.ROLES.DETAIL(id));
  },

  async createRole(data) {
    return HttpClient.post(API_CONFIG.ENDPOINTS.ROLES.CREATE, data);
  },

  async updateRole(id, data) {
    return HttpClient.put(API_CONFIG.ENDPOINTS.ROLES.UPDATE(id), data);
  },

  async deleteRole(id) {
    return HttpClient.delete(API_CONFIG.ENDPOINTS.ROLES.DELETE(id));
  },

  async getPermissionsList() {
    return HttpClient.get(API_CONFIG.ENDPOINTS.ROLES.PERMISSIONS);
  },
};

export const SettingsApi = {
  async getSettings() {
    return HttpClient.get(API_CONFIG.ENDPOINTS.SETTINGS.GET);
  },

  async updateSettings(data) {
    return HttpClient.put(API_CONFIG.ENDPOINTS.SETTINGS.UPDATE, data);
  },

  async uploadMedia(formData) {
    return HttpClient.post(API_CONFIG.ENDPOINTS.SETTINGS.UPLOAD_MEDIA, formData, {
      "Content-Type": "multipart/form-data",
    });
  },
};
