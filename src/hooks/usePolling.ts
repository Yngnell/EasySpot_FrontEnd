import { useEffect, useRef } from 'react'

/**
 * Calls `callback` right away and then every `intervalMs`, so the page shows
 * near real-time data (e.g. which spaces are free) without a manual refresh.
 */
export function usePolling(callback: () => void, intervalMs: number, enabled = true) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) return
    savedCallback.current()
    const id = window.setInterval(() => savedCallback.current(), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, enabled])
}
