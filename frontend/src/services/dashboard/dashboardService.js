import apiService from '../apiService';
import { API_ENDPOINTS } from '../../config';

class DashboardService {
  // Get dashboard statistics
  async getDashboardStats() {
    return await apiService.get(API_ENDPOINTS.DASHBOARD.STATS);
  }
}

export default new DashboardService();