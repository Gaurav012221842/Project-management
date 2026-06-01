// src/hooks/useMediaQuery.js
import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq      = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    setMatches(mq.matches)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

export function useIsMobile()  { return useMediaQuery('(max-width: 767px)')  }
export function useIsTablet()  { return useMediaQuery('(max-width: 1023px)') }
export function useIsDesktop() { return useMediaQuery('(min-width: 1024px)') }

export default useMediaQuery
