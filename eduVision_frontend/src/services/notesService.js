const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eduvision-g0evbghwhyb8apb4.westindia-01.azurewebsites.net/api';

const notesService = {
  getAuthToken() {
    return localStorage.getItem('accessToken');
  },

  async getUserNotes(params = {}) {
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
      const response = await fetch(`${API_BASE_URL}/notes?${searchParams}`, {
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
        throw new Error(`Failed to fetch notes: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get user notes error:', error);
      throw error;
    }
  },

  async getUserSubjects() {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes/subjects`, {
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
        throw new Error(`Failed to fetch subjects: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get user subjects error:', error);
      throw error;
    }
  },

  async getUserFolders() {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes/folders`, {
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
        throw new Error(`Failed to fetch folders: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get user folders error:', error);
      throw error;
    }
  },

  async getNoteById(noteId) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
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
        throw new Error(`Failed to fetch note: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get note by ID error:', error);
      throw error;
    }
  },

  async updateNote(noteId, updates) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
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
        throw new Error(`Failed to update note: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update note error:', error);
      throw error;
    }
  },

  async deleteNote(noteId) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
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
        throw new Error(`Failed to delete note: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete note error:', error);
      throw error;
    }
  },

  async toggleStar(noteId, starred) {
    return this.updateNote(noteId, { starred });
  },

  getFileUrl(note) {
    console.log('getFileUrl called with note:', note);

    if (note._id || note.id) {
      const noteId = note._id || note.id;
      const dbApiUrl = `${API_BASE_URL}/files/pdf/${noteId}`;
      console.log('Using database API URL:', dbApiUrl);
      return dbApiUrl;
    }

    if (note.pdfUrl) {
      console.log('Found legacy pdfUrl:', note.pdfUrl);
      return note.pdfUrl;
    }

    if (note.fileUrl) {
      console.log('Found legacy fileUrl:', note.fileUrl);
      return note.fileUrl;
    }

    console.warn('No valid identifier found for note');
    return null;
  },

  async getPdfFileInfo(noteId) {
    const token = this.getAuthToken();
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/files/pdf/${noteId}/info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        return { success: false, error: 'Authentication expired' };
      }

      const result = await response.json();
      return { success: response.ok, data: result.data, error: result.message };
    } catch (error) {
      console.error('Error getting PDF file info:', error);
      return { success: false, error: 'Failed to get file info' };
    }
  },

  async updateLastAccessed(noteId) {
    const token = this.getAuthToken();
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/notes/${noteId}/access`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error updating last accessed:', error);
    }
  },
};

export default notesService;
