// src/constants/uiConstants.js
export const THEME = {
  LIGHT: 'light',
  DARK:  'dark',
}

export const BREAKPOINTS = {
  SM:  640,
  MD:  768,
  LG:  1024,
  XL:  1280,
  XXL: 1536,
}

export const TOAST_DURATION = {
  SHORT:  2000,
  MEDIUM: 4000,
  LONG:   7000,
}

export const MODAL_IDS = {
  CREATE_TASK:      'createTask',
  EDIT_TASK:        'editTask',
  DELETE_TASK:      'deleteTask',
  CREATE_PROJECT:   'createProject',
  EDIT_PROJECT:     'editProject',
  DELETE_PROJECT:   'deleteProject',
  CREATE_SPRINT:    'createSprint',
  INVITE_MEMBER:    'inviteMember',
  CREATE_WORKSPACE: 'createWorkspace',
  EDIT_WORKSPACE:   'editWorkspace',
  CONFIRM_DELETE:   'confirmDelete',
}

export const PAGE_SIZES = [10, 20, 50, 100]

export const DEFAULT_PAGE_SIZE = 20

export const SORT_DIR = {
  ASC:  'ASC',
  DESC: 'DESC',
}

export const ANIMATION = {
  FADE_IN: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } },
  SLIDE_UP:{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } },
}
