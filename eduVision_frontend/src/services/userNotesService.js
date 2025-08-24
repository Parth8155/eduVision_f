// User notes service for managing personal notes on PDF pages
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eduvision-g0evbghwhyb8apb4.westindia-01.azurewebsites.net/api';
const USER_NOTES_API_URL = `${API_BASE_URL}/user-notes`;

class UserNotesService {
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
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getNotesForPage(noteId, pageNumber) {
    try {
      const response = await fetch(`${USER_NOTES_API_URL}/${noteId}/page/${pageNumber}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return data.notes;
    } catch (error) {
      console.error('Get notes for page error:', error);
      throw error;
    }
  }

  async getAllNotesForNote(noteId) {
    try {
      const response = await fetch(`${USER_NOTES_API_URL}/${noteId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return data.notes;
    } catch (error) {
      console.error('Get all notes for note error:', error);
      throw error;
    }
  }

  async createNote(noteData) {
    try {
      const response = await fetch(`${USER_NOTES_API_URL}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(noteData),
      });

      const data = await this.handleResponse(response);
      toast.success('Note created successfully');
      return data.note;
    } catch (error) {
      console.error('Create note error:', error);
      toast.error('Failed to create note');
      throw error;
    }
  }

  async updateNote(noteId, updateData) {
    try {
      const response = await fetch(`${USER_NOTES_API_URL}/${noteId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await this.handleResponse(response);
      toast.success('Note updated successfully');
      return data.note;
    } catch (error) {
      console.error('Update note error:', error);
      toast.error('Failed to update note');
      throw error;
    }
  }

  async deleteNote(noteId) {
    try {
      const response = await fetch(`${USER_NOTES_API_URL}/${noteId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      await this.handleResponse(response);
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Delete note error:', error);
      toast.error('Failed to delete note');
      throw error;
    }
  }

  async searchNotes(noteId, query) {
    try {
      const response = await fetch(`${USER_NOTES_API_URL}/${noteId}/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return data.notes;
    } catch (error) {
      console.error('Search notes error:', error);
      throw error;
    }
  }
}

const userNotesService = new UserNotesService();
export default userNotesService;
