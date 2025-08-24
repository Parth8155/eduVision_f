const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eduvision-g0evbghwhyb8apb4.westindia-01.azurewebsites.net/api';

const uploadService = {
  getAuthToken() {
    return localStorage.getItem('accessToken');
  },

  async uploadFiles(files, noteData) {
    console.log('uploadFiles called with:', { filesCount: files.length, noteData });

    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const formData = new FormData();

    files.forEach((file, index) => {
      console.log(`Adding file ${index}:`, file.name, file.type, file.size);
      formData.append('files', file);
    });

    formData.append('title', noteData.title || '');
    formData.append('subject', noteData.subject || '');
    formData.append('folder', noteData.folder || 'General');
    formData.append('generateOverlay', 'true');

    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      console.log("Uploading files to:", `${API_BASE_URL}/upload/upload-and-create`);

      const response = await fetch(`${API_BASE_URL}/upload/upload-and-create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        signal: AbortSignal.timeout(30000)
      });

      console.log("Response status:", response.status);

      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText || response.statusText };
        }

        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          throw new Error('SESSION_EXPIRED');
        }

        if (response.status === 413) {
          throw new Error('File too large. Maximum size is 10MB per file.');
        }

        if (response.status === 400 && errorData.message) {
          if (errorData.message.includes('Unexpected field')) {
            throw new Error('UPLOAD_FORMAT_ERROR');
          }
          if (errorData.message.includes('File too large')) {
            throw new Error('FILE_TOO_LARGE');
          }
          if (errorData.message.includes('Invalid file type')) {
            throw new Error('INVALID_FILE_TYPE');
          }
        }

        if (response.status === 422) {
          throw new Error('Invalid file format or corrupted file.');
        }

        console.error("Error response:", errorData);
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
      }

      const result = JSON.parse(responseText);
      console.log("Upload success:", result);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Upload timeout - please try again');
      }
      throw error;
    }
  },

  async uploadSingleFile(file, onProgress) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else if (xhr.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          reject(new Error('Session expired. Please login again.'));
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.message || `Upload failed: ${xhr.statusText}`));
          } catch {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${API_BASE_URL}/upload/single`);
      xhr.send(formData);
    });
  }
};

export default uploadService;
