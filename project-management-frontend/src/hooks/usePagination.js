// src/hooks/usePagination.js
import { useState, useCallback } from 'react'

export function usePagination(initialPage = 0, initialSize = 20) {
  const [page, setPage]         = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialSize)

  const goToPage   = useCallback((p) => setPage(p), [])
  const nextPage   = useCallback(() => setPage(p => p + 1), [])
  const prevPage   = useCallback(() => setPage(p => Math.max(0, p - 1)), [])
  const changeSize = useCallback((s) => { setPageSize(s); setPage(0) }, [])
  const reset      = useCallback(() => setPage(0), [])

  return { page, pageSize, goToPage, nextPage, prevPage, changeSize, reset }
}

export default usePagination
