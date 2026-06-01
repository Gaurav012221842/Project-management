// src/hooks/useInfiniteScroll.js
import { useEffect, useRef, useCallback } from 'react'

export function useInfiniteScroll(onLoadMore, { hasMore = true, threshold = 0.9 } = {}) {
  const sentinelRef = useRef(null)
  const handleIntersect = useCallback(
    (entries) => { if (entries[0].isIntersecting && hasMore) onLoadMore() },
    [hasMore, onLoadMore]
  )
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleIntersect, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleIntersect, threshold])
  return sentinelRef
}

export default useInfiniteScroll
