const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://eduvision-g0evbghwhyb8apb4.westindia-01.azurewebsites.net/api';

const authService = {
  // Login user
  async login(loginData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (result.success && result.data?.accessToken) {
        // Store access token in localStorage
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
  },

  // Register user
  async register(registerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (result.success && result.data?.accessToken) {
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
  },

  // Logout user
  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  // Refresh access token
  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success && result.data?.accessToken) {
        localStorage.setItem('accessToken', result.data.accessToken);
        return result.data.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
        credentials: 'include',
      });

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Helper methods
  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  getCurrentUser() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  },

  isAuthenticated() {
    return !!this.getAccessToken();
  },

  // Auto-refresh token before it expires
  setupTokenRefresh() {
    const token = this.getAccessToken();
    if (token) {
      // Refresh token every 50 minutes (tokens expire in 1 hour)
      setInterval(async () => {
        await this.refreshToken();
      }, 50 * 60 * 1000);
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send reset email');
      }

      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(token, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to reset password');
      }

      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
};

export default authService;
