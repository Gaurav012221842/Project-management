// src/utils/storageUtils.js
export const storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key)
      return val !== null ? JSON.parse(val) : fallback
    } catch { return fallback }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(key) } catch {}
  },
  clear() {
    try { localStorage.clear() } catch {}
  },
}

export const sessionStore = {
  get(key, fallback = null) {
    try {
      const val = sessionStorage.getItem(key)
      return val !== null ? JSON.parse(val) : fallback
    } catch { return fallback }
  },
  set(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)) } catch {}
  },
  remove(key) {
    try { sessionStorage.removeItem(key) } catch {}
  },
}

export default storage
