import apiService from '../apiService';
import { API_ENDPOINTS } from '../../config';

class AdminService {
  // User management
  async getAllAdmins() {
    return await apiService.get(API_ENDPOINTS.ADMIN.USERS);
  }

  async createAdmin(adminData) {
    return await apiService.post(API_ENDPOINTS.ADMIN.USERS, adminData);
  }

  async updateAdmin(id, adminData) {
    return await apiService.put(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, adminData);
  }

  async deleteAdmin(id) {
    return await apiService.delete(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
  }

  // Activity logs
  async getActivityLogs(params = {}) {
    return await apiService.get(API_ENDPOINTS.ADMIN.LOGS, params);
  }

  // Master data management
  // Jenis Kasus
  async getAllJenisKasus() {
    return await apiService.get(API_ENDPOINTS.ADMIN.MASTER_JENIS_KASUS);
  }

  async createJenisKasus(jenisKasusData) {
    return await apiService.post(API_ENDPOINTS.ADMIN.MASTER_JENIS_KASUS, jenisKasusData);
  }

  async updateJenisKasus(id, jenisKasusData) {
    return await apiService.put(`${API_ENDPOINTS.ADMIN.MASTER_JENIS_KASUS}/${id}`, jenisKasusData);
  }

  async deleteJenisKasus(id) {
    return await apiService.delete(`${API_ENDPOINTS.ADMIN.MASTER_JENIS_KASUS}/${id}`);
  }

  // Bentuk Kekerasan
  async getAllBentukKekerasan() {
    return await apiService.get(API_ENDPOINTS.ADMIN.MASTER_BENTUK_KEKERASAN);
  }

  async createBentukKekerasan(bentukKekerasanData) {
    return await apiService.post(API_ENDPOINTS.ADMIN.MASTER_BENTUK_KEKERASAN, bentukKekerasanData);
  }

  async updateBentukKekerasan(id, bentukKekerasanData) {
    return await apiService.put(`${API_ENDPOINTS.ADMIN.MASTER_BENTUK_KEKERASAN}/${id}`, bentukKekerasanData);
  }

  async deleteBentukKekerasan(id) {
    return await apiService.delete(`${API_ENDPOINTS.ADMIN.MASTER_BENTUK_KEKERASAN}/${id}`);
  }

  // Kecamatan
  async getAllKecamatan() {
    return await apiService.get(API_ENDPOINTS.ADMIN.MASTER_KECAMATAN);
  }

  async createKecamatan(kecamatanData) {
    return await apiService.post(API_ENDPOINTS.ADMIN.MASTER_KECAMATAN, kecamatanData);
  }

  async updateKecamatan(id, kecamatanData) {
    return await apiService.put(`${API_ENDPOINTS.ADMIN.MASTER_KECAMATAN}/${id}`, kecamatanData);
  }

  async deleteKecamatan(id) {
    return await apiService.delete(`${API_ENDPOINTS.ADMIN.MASTER_KECAMATAN}/${id}`);
  }
}

export default new AdminService();