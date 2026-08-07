/**
 * Shared timing helpers for the progress surfaces: compact duration
 * formatting and a ticking clock for the live elapsed/ETA readouts. The
 * clock is a component-internal behavioral hook — it subscribes to nothing
 * external (no session or framework state), so it stays inside presentation
 * components.
 */
import { useEffect, useState } from 'react'

/**
 * Compact duration: 45.2s under a minute, 2m42s from there on (same shape as
 * the conversation stats strip).
 * @param ms - duration in milliseconds.
 * @returns display string.
 */
export function formatElapsed(ms: number): string {
  const s = ms / 1_000
  if (s < 60) return `${Math.round(s * 10) / 10}s`
  const whole = Math.round(s)
  return `${Math.floor(whole / 60)}m${whole % 60}s`
}

/**
 * Whole-second ETA: 45s / 2m42s. An estimate, so no sub-second precision.
 * @param ms - remaining-time estimate in milliseconds.
 * @returns display string.
 */
export function formatEta(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1_000))
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m${s % 60}s`
}

/**
 * Ticking clock: Date.now() refreshed once per second while `enabled`, frozen
 * otherwise (callers gate reads on the same flag). The effect ticks once
 * immediately on enable so a resumed readout is not stale for up to a second.
 * @param enabled - whether the clock should tick.
 * @returns the latest epoch-ms timestamp.
 */
export function useNow(enabled: boolean): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!enabled) return
    const tick = () => setNow(Date.now())
    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [enabled])
  return now
}
