import { useEffect, useState } from 'react'

type UseClockOptions = {
  /** IANA timezone (e.g. 'America/Managua'). Omit for the visitor's local zone. */
  timeZone?: string
  /** Include seconds in the formatted string. */
  withSeconds?: boolean
}

function format(options: UseClockOptions): string {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    ...(options.withSeconds ? { second: '2-digit' } : {}),
    ...(options.timeZone ? { timeZone: options.timeZone } : {}),
  })
}

/**
 * Live clock. Defaults to the visitor's local timezone; pass `timeZone` for a
 * fixed zone. Ticks every second and cleans up its interval.
 */
export function useClock(options: UseClockOptions = {}): string {
  const { timeZone, withSeconds } = options
  const [time, setTime] = useState(() => format(options))

  useEffect(() => {
    const opts = { timeZone, withSeconds }
    const interval = setInterval(() => setTime(format(opts)), 1000)
    return () => clearInterval(interval)
  }, [timeZone, withSeconds])

  return time
}
