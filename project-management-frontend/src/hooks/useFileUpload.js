// src/hooks/useFileUpload.js
import { useState, useCallback } from 'react'
import axiosInstance from '../services/api/axiosInstance'

export function useFileUpload(uploadUrl = '/api/files/upload') {
  const [uploading, setUploading] = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [error,     setError]     = useState(null)

  const upload = useCallback(async (file) => {
    setUploading(true); setProgress(0); setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axiosInstance.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total))
        },
      })
      setProgress(100)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
      throw err
    } finally {
      setUploading(false)
    }
  }, [uploadUrl])

  const reset = useCallback(() => { setUploading(false); setProgress(0); setError(null) }, [])

  return { upload, uploading, progress, error, reset }
}

export default useFileUpload
