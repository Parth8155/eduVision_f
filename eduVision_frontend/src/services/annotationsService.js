// Service for managing PDF annotations (highlights, drawings, etc.)
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eduvision-g0evbghwhyb8apb4.westindia-01.azurewebsites.net/api';
const ANNOTATIONS_API_URL = `${API_BASE_URL}/annotations`;

class AnnotationsService {
  getAuthToken() {
    const token = localStorage.getItem('accessToken');
    return token;
  }

  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      console.error('API Error:', response.status, response.statusText, errorData);
      
      if (response.status === 401) {
        console.error('Authentication failed. Token:', this.getAuthToken() ? 'present' : 'missing');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Save all annotations for a PDF note
  async saveAnnotations(noteId, annotations) {
    try {
      console.log('💾 Saving annotations for note:', noteId, annotations);
      
      const response = await fetch(`${ANNOTATIONS_API_URL}/${noteId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ 
          annotations: annotations,
          lastModified: new Date().toISOString()
        }),
      });

      const data = await this.handleResponse(response);
      return data;
    } catch (error) {
      console.error('Save annotations error:', error);
      toast.error('Failed to save annotations');
      throw error;
    }
  }

  // Load annotations for a PDF note
  async loadAnnotations(noteId) {
    try {
      console.log('📖 Loading annotations for note:', noteId);
      
      const response = await fetch(`${ANNOTATIONS_API_URL}/${noteId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.status === 404) {
        // No annotations found, return empty structure
        return {
          highlights: [],
          drawings: [],
          numberMarkers: [],
          lastModified: null
        };
      }

      const data = await this.handleResponse(response);
      console.log('📖 Loaded annotations:', data);
      return data.annotations || {
        highlights: [],
        drawings: [],
        numberMarkers: [],
        lastModified: null
      };
    } catch (error) {
      console.error('Load annotations error:', error);
      // Don't show toast for load errors to avoid spam
      return {
        highlights: [],
        drawings: [],
        numberMarkers: [],
        lastModified: null
      };
    }
  }

  // Auto-save annotations (debounced)
  setupAutoSave(noteId, getAnnotations, debounceMs = 2000) {
    let timeoutId = null;
    let lastSaveData = null;

    const saveIfChanged = async () => {
      try {
        const currentData = getAnnotations();
        const serializedData = JSON.stringify(currentData);
        
        if (serializedData !== lastSaveData) {
          await this.saveAnnotations(noteId, currentData);
          lastSaveData = serializedData;
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    };

    const debouncedSave = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(saveIfChanged, debounceMs);
    };

    // Return cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        // Perform final save on cleanup
        saveIfChanged();
      }
    };
  }

  // Local storage fallback for offline support
  getLocalStorageKey(noteId) {
    return `annotations_${noteId}`;
  }

  saveToLocalStorage(noteId, annotations) {
    try {
      const data = {
        annotations,
        timestamp: Date.now(),
        version: '1.0'
      };
      localStorage.setItem(this.getLocalStorageKey(noteId), JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  loadFromLocalStorage(noteId) {
    try {
      const stored = localStorage.getItem(this.getLocalStorageKey(noteId));
      if (!stored) return null;
      
      const data = JSON.parse(stored);
      return data.annotations;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  clearLocalStorage(noteId) {
    try {
      localStorage.removeItem(this.getLocalStorageKey(noteId));
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

const annotationsService = new AnnotationsService();
export default annotationsService;
