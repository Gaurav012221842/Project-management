// src/components/task/TaskAttachments.jsx
import { useRef, useState }         from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import { format }                   from 'date-fns'
import {
  PaperClipIcon,
  DocumentIcon,
  PhotoIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline'
import {
  uploadAttachment,
  deleteAttachment,
  selectUploadLoading,
} from '../../features/task/taskSlice'

const FILE_ICONS = {
  'image': PhotoIcon,
  'pdf':   DocumentIcon,
  'doc':   DocumentIcon,
  'docx':  DocumentIcon,
  'txt':   DocumentIcon,
  'default': PaperClipIcon,
}

const getFileIcon = (fileType) => {
  if (!fileType) return FILE_ICONS.default
  if (fileType.startsWith('image/')) {
    return FILE_ICONS.image
  }
  const ext = fileType.split('/').pop()
  return FILE_ICONS[ext] || FILE_ICONS.default
}

const formatFileSize = (bytes) => {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function TaskAttachments({ task }) {
  const dispatch     = useDispatch()
  const isUploading  = useSelector(selectUploadLoading)
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [deleteId,   setDeleteId]   = useState(null)

  const attachments = task.attachments || []

  const handleUpload = (file) => {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be less than 10MB')
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    dispatch(uploadAttachment({
      taskId: task.id,
      formData,
    }))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const handleDelete = (attachmentId) => {
    dispatch(deleteAttachment({
      taskId: task.id,
      attachmentId,
    }))
    setDeleteId(null)
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center
                       justify-between">
        <div className="flex items-center gap-2">
          <PaperClipIcon
            className="w-5 h-5 text-gray-400"
          />
          <h3 className="text-sm font-bold
                          text-gray-700">
            Attachments
          </h3>
          <span className="text-xs text-gray-400
                            bg-gray-100 px-2 py-0.5
                            rounded-full font-medium">
            {attachments.length}
          </span>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1.5 text-xs
                      font-semibold text-indigo-600
                      hover:text-indigo-700
                      transition-colors disabled:opacity-50"
        >
          <CloudArrowUpIcon className="w-4 h-4" />
          Upload
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-2xl p-8
          text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-200 bg-gray-50 ' +
              'hover:border-indigo-300 ' +
              'hover:bg-indigo-50/30'
          }
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-3
                             border-indigo-500
                             border-t-transparent
                             rounded-full
                             animate-spin mb-3" />
            <p className="text-sm text-indigo-600
                           font-medium">
              Uploading...
            </p>
          </div>
        ) : (
          <>
            <CloudArrowUpIcon
              className={`w-10 h-10 mx-auto mb-3
                           ${isDragging
                             ? 'text-indigo-500'
                             : 'text-gray-400'
                           }`}
            />
            <p className={`text-sm font-medium
                            ${isDragging
                              ? 'text-indigo-700'
                              : 'text-gray-500'
                            }`}>
              {isDragging
                ? 'Drop file here'
                : 'Drop files or click to upload'
              }
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Max file size: 10MB
            </p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) =>
          handleUpload(e.target.files[0])
        }
      />

      {/* Attachments Grid */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-1
                         sm:grid-cols-2 gap-3">
          <AnimatePresence>
            {attachments.map((attachment, index) => {
              const Icon =
                getFileIcon(attachment.fileType)
              const isImage =
                attachment.fileType?.startsWith(
                  'image/'
                )

              return (
                <motion.div
                  key={attachment.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1    }}
                  exit={{ opacity: 0, scale: 0.95    }}
                  transition={{
                    duration: 0.3,
                    delay:    index * 0.06,
                  }}
                  className="group relative bg-gray-50
                              border border-gray-200
                              rounded-2xl overflow-hidden
                              hover:border-indigo-200
                              hover:shadow-sm
                              transition-all"
                >
                  {/* Image Preview */}
                  {isImage ? (
                    <div className="h-36 bg-gray-100
                                     overflow-hidden">
                      <img
                        src={attachment.fileUrl}
                        alt={attachment.fileName}
                        className="w-full h-full
                                    object-cover
                                    group-hover:scale-105
                                    transition-transform
                                    duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-24 bg-gray-100
                                     flex items-center
                                     justify-center">
                      <Icon
                        className="w-10 h-10 text-gray-400"
                      />
                    </div>
                  )}

                  {/* File Info */}
                  <div className="p-3">
                    <p className="text-xs font-semibold
                                   text-gray-800 truncate
                                   mb-0.5">
                      {attachment.fileName}
                    </p>
                    <div className="flex items-center
                                     justify-between">
                      <p className="text-[10px]
                                     text-gray-400">
                        {formatFileSize(
                          attachment.fileSize
                        )}
                        {attachment.createdAt && (
                          <> • {format(
                            new Date(attachment.createdAt),
                            'MMM dd'
                          )}</>
                        )}
                      </p>

                      <div className="flex items-center
                                       gap-1">
                        {/* Download */}
                        <a
                          href={attachment.fileUrl}
                          download={attachment.fileName}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          className="p-1 rounded-lg
                                      text-gray-400
                                      hover:text-indigo-600
                                      hover:bg-indigo-50
                                      transition-colors"
                        >
                          <ArrowDownTrayIcon
                            className="w-3.5 h-3.5"
                          />
                        </a>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            setDeleteId(attachment.id)
                          }
                          className="p-1 rounded-lg
                                      text-gray-400
                                      hover:text-red-500
                                      hover:bg-red-50
                                      transition-colors"
                        >
                          <TrashIcon
                            className="w-3.5 h-3.5"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Confirm Overlay */}
                  <AnimatePresence>
                    {deleteId === attachment.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0   }}
                        className="absolute inset-0
                                    bg-black/70 flex
                                    flex-col items-center
                                    justify-center gap-3
                                    p-4"
                      >
                        <p className="text-white text-xs
                                       font-medium
                                       text-center">
                          Delete this file?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleDelete(attachment.id)
                            }
                            className="px-3 py-1.5
                                        bg-red-500 text-white
                                        rounded-lg text-xs
                                        font-semibold
                                        hover:bg-red-600
                                        transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              setDeleteId(null)
                            }
                            className="px-3 py-1.5
                                        bg-white/20 text-white
                                        rounded-lg text-xs
                                        font-medium
                                        hover:bg-white/30
                                        transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {attachments.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">
            No attachments yet
          </p>
        </div>
      )}
    </div>
  )
}