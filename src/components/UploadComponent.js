import React, { useState } from 'react';
import axios from 'axios';

const Upload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate file exists
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, PNG, or GIF files are allowed');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);  // Must match backend's expected field name

    setIsUploading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
          // withCredentials: true, // Uncomment if using cookies/auth
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Upload failed');
      }

      alert(`Upload successful! URL: ${response.data.url}`);
      if (onUploadSuccess) onUploadSuccess();

    } catch (error) {
      console.error('Upload error:', error);
      
      // Enhanced error messages
      let errorMessage = 'Upload failed. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.error || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // No response received
        errorMessage = 'No response from server. Check your connection.';
      }

      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Artwork</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/jpeg, image/png, image/gif"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={isUploading}
        />
        
        {error && <div className="error-message">{error}</div>}
        
        <button
          type="submit"
          disabled={isUploading || !file}
          className={isUploading ? 'uploading' : ''}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      <style jsx>{`
        .upload-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .error-message {
          color: #d32f2f;
          margin: 10px 0;
          padding: 10px;
          background: #fdecea;
          border-radius: 4px;
        }
        button {
          padding: 10px 15px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }
        button:disabled, button.uploading {
          background: #cccccc;
          cursor: not-allowed;
        }
        input[type="file"] {
          margin: 10px 0;
          padding: 8px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Upload;