const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eduvision-g0evbghwhyb8apb4.westindia-01.azurewebsites.net/api';

const userService = {
  getAuthToken() {
    return localStorage.getItem('accessToken');
  },

  async getCurrentUser() {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expired');
        }
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }

      const result = await response.json();
      localStorage.setItem('user', JSON.stringify(result.data.user));
      return result;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  async updateProfile(updates) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expired');
        }
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const result = await response.json();
      localStorage.setItem('user', JSON.stringify(result.data.user));
      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  async getStudyAnalytics() {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/analytics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get study analytics error:', error);
      throw error;
    }
  }
};

export default userService;
