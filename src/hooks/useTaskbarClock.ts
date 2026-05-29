import { useEffect, useState } from 'react'

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/** Returns a live HH:MM string, updated every minute. */
export function useTaskbarClock(): string {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()))

    // Align to the next full minute so the display stays accurate.
    const msUntilNextMinute = (60 - new Date().getSeconds()) * 1000
    const alignTimeout = setTimeout(() => {
      tick()
      const interval = setInterval(tick, 60_000)
      return () => clearInterval(interval)
    }, msUntilNextMinute)

    return () => clearTimeout(alignTimeout)
  }, [])

  return time
}
