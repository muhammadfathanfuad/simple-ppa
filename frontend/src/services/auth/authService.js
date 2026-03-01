import apiService from '../apiService';
import { API_ENDPOINTS } from '../../config';

class AuthService {
  // Login user
  async login(credentials) {
    const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Get current user
  async getCurrentUser() {
    return await apiService.get(API_ENDPOINTS.AUTH.ME);
  }

  // Get stored user from localStorage
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Update user profile
  async updateProfile(profileData) {
    return await apiService.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get authentication token
  getToken() {
    return localStorage.getItem('token');
  }

  // Check if user has specific role
  hasRole(role) {
    const user = this.getStoredUser();
    return user?.role === role;
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getStoredUser();
    return user?.role === 'admin' || user?.role === 'super_admin';
  }
}

export default new AuthService();