// src/components/chat/ChatFilePreview.jsx
import React from 'react'
import { DocumentIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { formatFileSize } from '../../utils/formatUtils'

function ChatFilePreview({ file, onRemove, preview = false }) {
  const isImage = file.type?.startsWith('image/')
  const url     = file.url || (file instanceof File ? URL.createObjectURL(file) : null)

  return (
    <div className="relative flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
      {isImage && url ? (
        <img src={url} alt={file.name} className="w-10 h-10 rounded object-cover" />
      ) : (
        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
          {isImage
            ? <PhotoIcon    className="w-5 h-5 text-gray-400" />
            : <DocumentIcon className="w-5 h-5 text-gray-400" />}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
        {file.size != null && (
          <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
        )}
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-500 hover:bg-red-500 text-white rounded-full flex items-center justify-center"
        >
          <XMarkIcon className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  )
}

export default ChatFilePreview
