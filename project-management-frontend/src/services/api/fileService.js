// src/services/api/fileService.js
import api from './axiosInstance'

const fileService = {
  uploadFile: (formData, onUploadProgress) =>
    api.post('/api/v1/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),

  deleteFile: (fileId) =>
    api.delete(`/api/v1/files/${fileId}`),

  getFileUrl: (fileId) =>
    `/api/v1/files/${fileId}`,
}

export default fileService
