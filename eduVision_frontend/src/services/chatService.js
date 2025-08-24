// Chat service for communicating with the backend chatbot API
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eduvision-g0evbghwhyb8apb4.westindia-01.azurewebsites.net/api';
const CHAT_API_URL = `${API_BASE_URL}/chat`;

class ChatService {
  getAuthToken() {
    const token = localStorage.getItem('accessToken');
    console.log('Chat service getting auth token:', token ? 'Token found' : 'No token found');
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

  async getConversation(noteId) {
    try {
      const response = await fetch(`${CHAT_API_URL}/conversation/${noteId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get conversation error:', error);
      toast.error('Failed to load chat conversation');
      throw error;
    }
  }

  async sendMessage(noteId, message, context) {
    try {
      const response = await fetch(`${CHAT_API_URL}/message`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          noteId,
          message,
          context,
        }),
      });

      const data = await this.handleResponse(response);
      return data.data.message;
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
      throw error;
    }
  }

  async getConversationHistory(conversationId) {
    try {
      const response = await fetch(`${CHAT_API_URL}/history/${conversationId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return data.messages;
    } catch (error) {
      console.error('Get conversation history error:', error);
      toast.error('Failed to load conversation history');
      throw error;
    }
  }

  async getAllConversations(noteId) {
    try {
      const response = await fetch(`${CHAT_API_URL}/conversations/note/${noteId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return data.conversations;
    } catch (error) {
      console.error('Get all conversations error:', error);
      toast.error('Failed to load conversations');
      throw error;
    }
  }

  async createNewConversation(noteId) {
    try {
      const response = await fetch(`${CHAT_API_URL}/conversation/new`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ noteId }),
      });

      const data = await this.handleResponse(response);
      toast.success('New conversation created');
      return data.conversation;
    } catch (error) {
      console.error('Create new conversation error:', error);
      toast.error('Failed to create new conversation');
      throw error;
    }
  }

  async getUserConversations() {
    try {
      const response = await fetch(`${CHAT_API_URL}/conversations`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return data.conversations;
    } catch (error) {
      console.error('Get user conversations error:', error);
      toast.error('Failed to load conversations');
      throw error;
    }
  }

  async updateConversationSettings(conversationId, settings) {
    try {
      const response = await fetch(`${CHAT_API_URL}/settings/${conversationId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ settings }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update conversation settings error:', error);
      toast.error('Failed to update settings');
      throw error;
    }
  }

  async deleteConversation(conversationId) {
    try {
      const response = await fetch(`${CHAT_API_URL}/conversation/${conversationId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      await this.handleResponse(response);
      toast.success('Conversation deleted successfully');
    } catch (error) {
      console.error('Delete conversation error:', error);
      toast.error('Failed to delete conversation');
      throw error;
    }
  }

  async generateStudyQuestions(noteId, options = {}) {
    try {
      const response = await fetch(`${CHAT_API_URL}/study-questions/${noteId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(options),
      });

      const data = await this.handleResponse(response);
      return data.questions;
    } catch (error) {
      console.error('Generate study questions error:', error);
      toast.error('Failed to generate study questions');
      throw error;
    }
  }

  async getConversationStarters(noteId) {
    try {
      const response = await fetch(`${CHAT_API_URL}/conversation-starters/${noteId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return data.starters;
    } catch (error) {
      console.error('Get conversation starters error:', error);
      toast.error('Failed to load conversation starters');
      throw error;
    }
  }

  formatMessage(message) {
    return message.content;
  }

  hasNoteReferences(message) {
    return Boolean(message.noteReferences && message.noteReferences.length > 0);
  }

  getNoteReferences(message) {
    return message.noteReferences || [];
  }
}

const chatService = new ChatService();
export default chatService;
