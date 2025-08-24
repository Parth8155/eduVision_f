const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eduvision-g0evbghwhyb8apb4.westindia-01.azurewebsites.net/api';

const studyToolsService = {
  getAuthToken() {
    return localStorage.getItem('accessToken');
  },

  // Create and save study material (generates and stores in DB)
  async createStudyMaterial(sourceNoteId, type, options = {}) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/study-materials/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceNoteId,
          type,
          generationOptions: options,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to create study material: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create study material error:', error);
      throw error;
    }
  },

  async generateMCQ(noteId, options = {}) {
    const defaultOptions = {
      count: 5,
      difficulty: 'medium'
    };

    const requestOptions = { ...defaultOptions, ...options };
    return this.createStudyMaterial(noteId, 'mcq', requestOptions);
  },

  async generateSummary(noteId, options = {}) {
    const defaultOptions = {
      length: 'medium',
      format: 'structured'
    };

    const requestOptions = { ...defaultOptions, ...options };
    return this.createStudyMaterial(noteId, 'summary', requestOptions);
  },

  async generatePracticeQuestions(noteId, options = {}) {
    const defaultOptions = {
      count: 5,
      difficulty: 'medium'
    };

    const requestOptions = { ...defaultOptions, ...options };
    return this.createStudyMaterial(noteId, 'practice', requestOptions);
  },

  // Get user's study materials with filtering
  async getUserStudyMaterials(params = {}) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/study-materials?${searchParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to get study materials: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get study materials error:', error);
      throw error;
    }
  },

  // Get single study material by ID
  async getStudyMaterialById(id) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/study-materials/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to get study material: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get study material error:', error);
      throw error;
    }
  },

  // Update study material
  async updateStudyMaterial(id, updates) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/study-materials/${id}`, {
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
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to update study material: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update study material error:', error);
      throw error;
    }
  },

  // Toggle star status
  async toggleStar(id) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/study-materials/${id}/star`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to toggle star: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Toggle star error:', error);
      throw error;
    }
  },

  // Delete study material
  async deleteStudyMaterial(id) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/study-materials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to delete study material: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete study material error:', error);
      throw error;
    }
  },

  // Record study session
  async recordStudySession(id, score, timeSpent = 0) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/study-materials/${id}/session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score, timeSpent }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to record study session: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Record study session error:', error);
      throw error;
    }
  },

  // Get study material statistics
  async getStudyMaterialStats() {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/study-materials/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to get statistics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get statistics error:', error);
      throw error;
    }
  },

  // Helper method to get file URL for study materials (if they have associated files)
  getStudyMaterialUrl(studyMaterial) {
    if (studyMaterial._id) {
      return `/study-tools?material=${studyMaterial._id}&tab=${studyMaterial.type}`;
    }
    return '/study-tools';
  },

  // Legacy methods for backward compatibility
  async saveGeneratedContent(noteId, contentType, content) {
    // This is now handled by createStudyMaterial
    return this.createStudyMaterial(noteId, contentType, { content });
  },

  async getGeneratedContent(noteId, contentType) {
    // Get study materials by source note and type
    return this.getUserStudyMaterials({ 
      sourceNoteId: noteId, 
      type: contentType 
    });
  },

  async getUserGeneratedContent() {
    // Get all user study materials
    return this.getUserStudyMaterials();
  },
};

export default studyToolsService;
