import apiService from '../apiService';
import { API_ENDPOINTS } from '../../config';

class DashboardService {
  // Get dashboard statistics
  async getDashboardStats(params = {}) {
    return await apiService.get(API_ENDPOINTS.DASHBOARD.STATS, params);
  }

  // Get available years for filters
  async getAvailableYears() {
    return await apiService.get('/dashboard/available-years');
  }
}

export default new DashboardService();