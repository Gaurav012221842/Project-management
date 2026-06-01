// src/features/ui/uiSlice.js
import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSidebarOpen:    true,
    isChatOpen:       false,
    isMobile:         false,
    isSearchOpen:     false,
    activeModal:      null,
    theme:            'light',
    pageTitle:        'ProjAI',
    breadcrumbs:      [],
    globalLoading:    false,
    toasts:           [],
  },
  reducers: {

    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },

    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload
    },

    toggleChat: (state) => {
      state.isChatOpen = !state.isChatOpen
    },

    setChatOpen: (state, action) => {
      state.isChatOpen = action.payload
    },

    setIsMobile: (state, action) => {
      state.isMobile = action.payload
      if (action.payload) {
        state.isSidebarOpen = false
      } else {
        state.isSidebarOpen = true
      }
    },

    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen
    },

    setActiveModal: (state, action) => {
      state.activeModal = action.payload
    },

    closeModal: (state) => {
      state.activeModal = null
    },

    setTheme: (state, action) => {
      state.theme = action.payload
      document.documentElement.setAttribute(
        'data-theme',
        action.payload
      )
    },

    setPageTitle: (state, action) => {
      state.pageTitle   = action.payload
      document.title    = `${action.payload} | ProjAI`
    },

    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload
    },

    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    },

    addToast: (state, action) => {
      state.toasts.push({
        id:        Date.now(),
        ...action.payload,
      })
    },

    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(
        t => t.id !== action.payload
      )
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleChat,
  setChatOpen,
  setIsMobile,
  toggleSearch,
  setActiveModal,
  closeModal,
  setTheme,
  setPageTitle,
  setBreadcrumbs,
  setGlobalLoading,
  addToast,
  removeToast,
} = uiSlice.actions

// Selectors
export const selectIsSidebarOpen =
  (state) => state.ui.isSidebarOpen

export const selectIsChatOpen =
  (state) => state.ui.isChatOpen

export const selectIsMobile =
  (state) => state.ui.isMobile

export const selectIsSearchOpen =
  (state) => state.ui.isSearchOpen

export const selectActiveModal =
  (state) => state.ui.activeModal

export const selectTheme =
  (state) => state.ui.theme

export const selectPageTitle =
  (state) => state.ui.pageTitle

export const selectBreadcrumbs =
  (state) => state.ui.breadcrumbs

export const selectGlobalLoading =
  (state) => state.ui.globalLoading

export default uiSlice.reducer