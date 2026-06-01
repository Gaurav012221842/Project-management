// src/app/rootReducer.js
// Re-exported for reference; actual reducers are combined in store.js
export { default as authReducer }         from '../features/auth/authSlice'
export { default as workspaceReducer }    from '../features/workspace/workspaceSlice'
export { default as projectReducer }      from '../features/project/projectSlice'
export { default as sprintReducer }       from '../features/sprint/sprintSlice'
export { default as taskReducer }         from '../features/task/taskSlice'
export { default as notificationReducer } from '../features/notification/notificationSlice'
export { default as analyticsReducer }    from '../features/analytics/analyticsSlice'
export { default as chatReducer }         from '../features/chat/chatSlice'
export { default as uiReducer }           from '../features/ui/uiSlice'
export { default as profileReducer }      from '../features/profile/profileSlice'
export { default as aiReducer }           from '../features/ai/aiSlice'
