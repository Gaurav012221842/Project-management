// src/hooks/useLocalStorage.js
import { useState, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })

  const setValue = useCallback((value) => {
    try {
      const newVal = value instanceof Function ? value(storedValue) : value
      setStoredValue(newVal)
      if (newVal == null) localStorage.removeItem(key)
      else localStorage.setItem(key, JSON.stringify(newVal))
    } catch {}
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    setStoredValue(undefined)
    localStorage.removeItem(key)
  }, [key])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage
