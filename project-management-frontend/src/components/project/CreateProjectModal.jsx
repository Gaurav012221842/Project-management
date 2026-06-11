// src/components/project/CreateProjectModal.jsx
import { useEffect, useState }    from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm }                from 'react-hook-form'
import { motion }                 from 'framer-motion'
import {
  XMarkIcon,
  FolderPlusIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import {
  createProject,
  selectCreateLoading,
} from '../../features/project/projectSlice'
import {
  fetchWorkspaces,
  selectWorkspaceLoading,
  selectSelectedWorkspace,
  selectWorkspaces,
  setSelectedWorkspace,
} from '../../features/workspace/workspaceSlice'
import projectService
  from '../../services/api/projectService'

const STATUS_OPTIONS = [
  { value: 'ACTIVE',    label: '🟢 Active'    },
  { value: 'ON_HOLD',   label: '🟡 On Hold'   },
  { value: 'COMPLETED', label: '🔵 Completed' },
]

export default function CreateProjectModal({
  onClose
}) {
  const dispatch          = useDispatch()
  const isLoading         = useSelector(selectCreateLoading)
  const selectedWorkspace = useSelector(selectSelectedWorkspace)
  const workspaces        = useSelector(selectWorkspaces)
  const workspaceLoading  = useSelector(selectWorkspaceLoading)

  const [memberSearch, setMemberSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedMembers, setSelectedMembers] =
    useState([])
  const [searching, setSearching] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name:        '',
      description: '',
      status:      'ACTIVE',
      workspaceId: selectedWorkspace?.id || '',
      startDate:   '',
      endDate:     '',
    }
  })

  useEffect(() => {
    if (!workspaces.length) {
      dispatch(fetchWorkspaces())
    }
  }, [dispatch, workspaces.length])

  useEffect(() => {
    if (selectedWorkspace?.id) {
      setValue('workspaceId', selectedWorkspace.id)
    }
  }, [selectedWorkspace, setValue])

  const handleWorkspaceChange = (event) => {
    const workspace = workspaces.find(
      ws => String(ws.id) === event.target.value
    )
    setValue('workspaceId', event.target.value)
    dispatch(setSelectedWorkspace(workspace || null))
  }

  // ============================
  // Search Users
  // ============================
  const handleMemberSearch = async (query) => {
    setMemberSearch(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setSearching(true)
    try {
      const res = await projectService
        .searchUsers(query)
      setSearchResults(
        res.data.filter(
          u => !selectedMembers.find(
            m => m.id === u.id
          )
        )
      )
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const addMember = (user) => {
    setSelectedMembers([...selectedMembers, user])
    setMemberSearch('')
    setSearchResults([])
  }

  const removeMember = (userId) => {
    setSelectedMembers(
      selectedMembers.filter(m => m.id !== userId)
    )
  }

  // ============================
  // Submit
  // ============================
  const onSubmit = (data) => {
    if (!data.workspaceId) {
      alert('Please select a workspace before creating a project.')
      return
    }

    dispatch(createProject({
      ...data,
      workspaceId: data.workspaceId,
      memberIds: selectedMembers.map(m => m.id),
    })).then((result) => {
      if (!result.error) onClose()
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0   }}
      className="fixed inset-0 bg-black/50
                  backdrop-blur-sm flex items-center
                  justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{ opacity: 0, scale: 0.95, y: 20    }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl
                    w-full max-w-lg max-h-[90vh]
                    overflow-hidden"
      >

        {/* Header */}
        <div className="flex items-center
                         justify-between px-6 py-5
                         border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100
                             rounded-xl flex items-center
                             justify-center">
              <FolderPlusIcon
                className="w-5 h-5 text-indigo-600"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold
                              text-gray-900">
                New Project
              </h2>
              <p className="text-xs text-gray-400">
                {selectedWorkspace?.name
                  ? `Workspace: ${selectedWorkspace.name}`
                  : 'Please select a workspace before creating a project.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400
                        hover:text-gray-600
                        hover:bg-gray-100
                        transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto"
          style={{ maxHeight: 'calc(90vh - 80px)' }}
        >
          <div className="px-6 py-5 space-y-5">

            {/* Project Name */}
            <div>
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                Project Name *
              </label>
              <input
                {...register('name', {
                  required:  'Project name is required',
                  minLength: {
                    value:   2,
                    message: 'At least 2 characters',
                  }
                })}
                placeholder="e.g. E-Commerce Platform"
                className={`w-full px-4 py-3 border
                             rounded-xl text-sm
                             focus:outline-none
                             focus:ring-2
                             transition-all
                             ${errors.name
                               ? 'border-red-300 ' +
                                 'focus:ring-red-500 ' +
                                 'bg-red-50'
                               : 'border-gray-200 ' +
                                 'focus:ring-indigo-500 ' +
                                 'hover:border-gray-300'
                             }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Workspace */}
            <div>
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                Workspace *
              </label>
              <select
                {...register('workspaceId', {
                  required: 'Workspace is required',
                  onChange: handleWorkspaceChange,
                })}
                disabled={workspaceLoading}
                className={`w-full px-4 py-3 border
                             rounded-xl text-sm bg-white
                             focus:outline-none
                             focus:ring-2
                             transition-all
                             ${errors.workspaceId
                               ? 'border-red-300 ' +
                                 'focus:ring-red-500 ' +
                                 'bg-red-50'
                               : 'border-gray-200 ' +
                                 'focus:ring-indigo-500 ' +
                                 'hover:border-gray-300'
                             }`}
              >
                <option value="">
                  {workspaceLoading
                    ? 'Loading workspaces...'
                    : 'Select workspace'}
                </option>
                {workspaces.map(workspace => (
                  <option
                    key={workspace.id}
                    value={workspace.id}
                  >
                    {workspace.name}
                  </option>
                ))}
              </select>
              {errors.workspaceId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.workspaceId.message}
                </p>
              )}
              {!workspaceLoading &&
               workspaces.length === 0 && (
                <p className="mt-1 text-xs text-gray-400">
                  Create a workspace first to add projects.
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                {...register('description')}
                placeholder="Brief project description..."
                rows={3}
                className="w-full px-4 py-3 border
                            border-gray-200 rounded-xl
                            text-sm resize-none
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                            hover:border-gray-300
                            transition-all"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className="cursor-pointer"
                  >
                    <input
                      {...register('status')}
                      type="radio"
                      value={opt.value}
                      className="sr-only"
                    />
                    <div className={`px-3 py-2.5
                                      rounded-xl border-2
                                      text-center text-xs
                                      font-medium
                                      transition-all
                                      cursor-pointer
                                      ${watch('status') ===
                                        opt.value
                                        ? 'border-indigo-500 ' +
                                          'bg-indigo-50 ' +
                                          'text-indigo-700'
                                        : 'border-gray-200 ' +
                                          'text-gray-600 ' +
                                          'hover:border-gray-300'
                                      }`}>
                      {opt.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm
                                    font-semibold
                                    text-gray-700 mb-1.5">
                  Start Date
                </label>
                <input
                  {...register('startDate')}
                  type="date"
                  className="w-full px-4 py-3 border
                              border-gray-200 rounded-xl
                              text-sm focus:outline-none
                              focus:ring-2
                              focus:ring-indigo-500
                              hover:border-gray-300
                              transition-all"
                />
              </div>
              <div>
                <label className="block text-sm
                                    font-semibold
                                    text-gray-700 mb-1.5">
                  End Date
                </label>
                <input
                  {...register('endDate')}
                  type="date"
                  className="w-full px-4 py-3 border
                              border-gray-200 rounded-xl
                              text-sm focus:outline-none
                              focus:ring-2
                              focus:ring-indigo-500
                              hover:border-gray-300
                              transition-all"
                />
              </div>
            </div>

            {/* Add Members */}
            <div>
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                Add Team Members
              </label>

              {/* Search Input */}
              <div className="relative mb-3">
                <MagnifyingGlassIcon
                  className="absolute left-3.5
                              top-1/2 -translate-y-1/2
                              w-4 h-4 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={memberSearch}
                  onChange={(e) =>
                    handleMemberSearch(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3
                              border border-gray-200
                              rounded-xl text-sm
                              focus:outline-none
                              focus:ring-2
                              focus:ring-indigo-500
                              hover:border-gray-300
                              transition-all"
                />

                {/* Search Results */}
                {(searchResults.length > 0 ||
                  searching) && (
                  <div className="absolute top-full
                                   left-0 right-0 mt-1
                                   bg-white rounded-xl
                                   shadow-xl border
                                   border-gray-100
                                   z-20 overflow-hidden
                                   max-h-48
                                   overflow-y-auto">
                    {searching ? (
                      <div className="flex items-center
                                       justify-center
                                       py-4">
                        <div className="w-4 h-4 border-2
                                         border-indigo-500
                                         border-t-transparent
                                         rounded-full
                                         animate-spin" />
                      </div>
                    ) : (
                      searchResults.map(user => (
                        <div
                          key={user.id}
                          onClick={() => addMember(user)}
                          className="flex items-center
                                      gap-3 px-4 py-3
                                      hover:bg-gray-50
                                      cursor-pointer
                                      transition-colors"
                        >
                          <div className="w-8 h-8
                                           rounded-full
                                           bg-indigo-200
                                           flex items-center
                                           justify-center
                                           text-indigo-700
                                           font-bold
                                           text-xs
                                           flex-shrink-0">
                            {user.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm
                                           font-medium
                                           text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs
                                           text-gray-400">
                              {user.email}
                            </p>
                          </div>
                          <UserPlusIcon
                            className="w-4 h-4
                                        text-indigo-400
                                        ml-auto"
                          />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Selected Members */}
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map(member => (
                    <motion.div
                      key={member.id}
                      initial={{
                        opacity: 0,
                        scale:   0.8
                      }}
                      animate={{
                        opacity: 1,
                        scale:   1
                      }}
                      className="flex items-center
                                  gap-2 px-3 py-1.5
                                  bg-indigo-50
                                  border border-indigo-200
                                  rounded-xl text-sm
                                  text-indigo-700
                                  font-medium"
                    >
                      <div className="w-5 h-5
                                       rounded-full
                                       bg-indigo-300
                                       flex items-center
                                       justify-center
                                       text-white text-xs
                                       font-bold">
                        {member.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>
                      {member.name}
                      <button
                        type="button"
                        onClick={() =>
                          removeMember(member.id)
                        }
                        className="text-indigo-400
                                    hover:text-indigo-600
                                    transition-colors"
                      >
                        <XCircleIcon
                          className="w-4 h-4"
                        />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3
                           px-6 py-4 border-t
                           border-gray-100 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl
                          border-2 border-gray-200
                          text-gray-600 font-semibold
                          text-sm hover:bg-gray-100
                          transition-all"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading
                ? { scale: 1.01 } : {}}
              whileTap={!isLoading
                ? { scale: 0.99 } : {}}
              className={`flex-1 py-3 rounded-xl
                           font-semibold text-sm
                           text-white flex items-center
                           justify-center gap-2
                           transition-all
                           ${isLoading
                             ? 'bg-indigo-400 ' +
                               'cursor-not-allowed'
                             : 'bg-indigo-600 ' +
                               'hover:bg-indigo-700 ' +
                               'shadow-lg ' +
                               'shadow-indigo-200'
                           }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2
                                   border-white
                                   border-t-transparent
                                   rounded-full
                                   animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlusIcon className="w-4 h-4" />
                  Create Project
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
