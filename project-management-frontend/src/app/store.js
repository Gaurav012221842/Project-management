// src/app/store.js
import { configureStore }    from '@reduxjs/toolkit'
import authReducer           from '../features/auth/authSlice'
import workspaceReducer      from '../features/workspace/workspaceSlice'
import projectReducer        from '../features/project/projectSlice'
import sprintReducer         from '../features/sprint/sprintSlice'
import taskReducer           from '../features/task/taskSlice'
import notificationReducer   from '../features/notification/notificationSlice'
import analyticsReducer      from '../features/analytics/analyticsSlice'
import chatReducer           from '../features/chat/chatSlice'
import uiReducer             from '../features/ui/uiSlice'
import profileReducer        from '../features/profile/profileSlice'
import aiReducer             from '../features/ai/aiSlice'
export const store = configureStore({
  reducer: {
    auth:         authReducer,
    workspace:    workspaceReducer,
    project:      projectReducer,
    sprint:       sprintReducer,
    task:         taskReducer,
    notification: notificationReducer,
    analytics:    analyticsReducer,
    chat:         chatReducer,
    ui:           uiReducer,
    profile:      profileReducer,
    ai:           aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export default store