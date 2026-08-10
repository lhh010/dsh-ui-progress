/**
 * Shared timing helpers for the progress surfaces: compact duration
 * formatting and a ticking clock for the live elapsed/ETA readouts. The
 * clock is a component-internal behavioral hook — it subscribes to nothing
 * external (no session or framework state), so it stays inside presentation
 * components. The first-token anchor hook stamps the live token-rate window
 * the same way: from the snapshot's partial alone.
 */
import { useEffect, useRef, useState } from 'react'
import type { PartialAssistant } from '@deepseek-ai/dsh-client-runtime/client'
import { estimatePartialTokens } from './token-rate.ts'

/**
 * Compact duration: one decimal always under a minute (17.0s, 3.4s), folded
 * whole-second steps from the minute mark on (1m0s, 2m42s). The fold check
 * uses the rounded tenth so 59.96s reads 1m0s instead of 60.0s.
 * @param ms - duration in milliseconds.
 * @returns display string.
 */
export function formatElapsed(ms: number): string {
  const tenths = Math.round(ms / 100) / 10
  if (tenths < 60) return `${tenths.toFixed(1)}s`
  const whole = Math.round(tenths)
  return `${Math.floor(whole / 60)}m${whole % 60}s`
}

/**
 * Whole-second ETA: 45s / 2m42s / 5h / 5h20m. An estimate, so no sub-second
 * precision; hours kick in at the hour mark.
 * @param ms - remaining-time estimate in milliseconds.
 * @returns display string.
 */
export function formatEta(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1_000))
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m${s % 60}s`
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  return minutes > 0 ? `${hours}h${minutes}m` : `${hours}h`
}

/**
 * Ticking clock: Date.now() refreshed at the rate the elapsed display
 * needs — every 100ms while the elapsed since `start` is under a minute
 * (0.1s steps), once per second from the minute mark on (folded 1s steps).
 * Frozen when disabled or anchorless; callers gate reads on the same flags.
 * The effect ticks once immediately on enable so a resumed readout is not
 * stale for up to one interval.
 * @param enabled - whether the clock should tick.
 * @param start - epoch-ms anchor the elapsed is measured from (turn start,
 *   call time); null disables the clock.
 * @returns the latest epoch-ms timestamp.
 */
export function useNow(enabled: boolean, start: number | null): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!enabled || start === null) return
    let alive = true
    let timer: ReturnType<typeof setTimeout> | undefined
    const tick = (): void => {
      if (!alive) return
      setNow(Date.now())
      // 0.1s steps below a minute, folded 1s steps from the minute mark on.
      const delay = Date.now() - start < 60_000 ? 100 : 1_000
      timer = setTimeout(tick, delay)
    }
    tick()
    return () => {
      alive = false
      if (timer !== undefined) clearTimeout(timer)
    }
  }, [enabled, start])
  return now
}

/**
 * First-visible-token anchor for the live token-rate window: the epoch-ms
 * instant the current streaming partial first carried estimated tokens
 * (one render behind the real chunk event at most — a live readout does not
 * need event-exact boundaries). Stamped once per (turn, step): a new step's
 * partial re-opens the decode window, a null partial or a stopped turn
 * closes it.
 * @param running - whether the session turn is running.
 * @param partial - the live streaming partial (snapshot-derived).
 * @returns the anchor, or null while no token stream is live.
 */
export function useFirstTokenAt(running: boolean, partial: PartialAssistant | null): number | null {
  const [anchor, setAnchor] = useState<number | null>(null)
  const key = partial === null ? null : `${partial.turn}\u0000${partial.step}`
  const hasTokens = partial !== null && estimatePartialTokens(partial) > 0
  const lastKey = useRef<string | null>(null)
  useEffect(() => {
    if (!running || key === null || !hasTokens) {
      lastKey.current = null
      setAnchor(null)
      return
    }
    if (lastKey.current !== key) {
      lastKey.current = key
      setAnchor(Date.now())
    }
    // Same key with live tokens: keep the existing anchor (stamped once).
  }, [running, key, hasTokens])
  return anchor
}
