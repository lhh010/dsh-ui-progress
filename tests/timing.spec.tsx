// @vitest-environment jsdom
/**
 * Hook tests for the windowed live token rate: the smoothing window publishes
 * a rate only after tokens arrive, keeps it through a single empty window
 * (chunk-gap tolerance), clears it after two consecutive stalled windows
 * (the frozen-rate-during-tool-execution bug), and re-opens when tokens
 * flow again.
 */
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useWindowedTokenRate } from '../src/client/timing.ts'

describe('useWindowedTokenRate', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('publishes a rate after a window with token gain', () => {
    let tokens = 0
    const view = renderHook(() => useWindowedTokenRate(true, 1_000, tokens))
    act(() => { tokens = 50; view.rerender() })
    act(() => { vi.advanceTimersByTime(1_000) })
    expect(view.result.current).not.toBeNull()
    expect(view.result.current).toBeGreaterThan(0)
  })

  it('keeps the last rate through ONE empty window (chunk-gap tolerance)', () => {
    let tokens = 0
    const view = renderHook(() => useWindowedTokenRate(true, 1_000, tokens))
    act(() => { tokens = 50; view.rerender() })
    act(() => { vi.advanceTimersByTime(1_000) })
    const first = view.result.current
    expect(first).not.toBeNull()
    // No new tokens for one window: the figure holds (no flicker to zero).
    act(() => { vi.advanceTimersByTime(1_000) })
    expect(view.result.current).toBe(first)
  })

  it('clears the frozen rate after two consecutive stalled windows (tool execution)', () => {
    let tokens = 0
    const view = renderHook(() => useWindowedTokenRate(true, 1_000, tokens))
    act(() => { tokens = 50; view.rerender() })
    act(() => { vi.advanceTimersByTime(1_000) })
    expect(view.result.current).not.toBeNull()
    // Step settled; tool executes with no characters arriving for >2s.
    act(() => { vi.advanceTimersByTime(1_000) })
    act(() => { vi.advanceTimersByTime(1_000) })
    expect(view.result.current).toBeNull()
  })

  it('re-opens the readout when tokens flow again after a stall', () => {
    let tokens = 0
    const view = renderHook(() => useWindowedTokenRate(true, 1_000, tokens))
    act(() => { tokens = 50; view.rerender() })
    act(() => { vi.advanceTimersByTime(1_000) })
    act(() => { vi.advanceTimersByTime(1_000) })
    act(() => { vi.advanceTimersByTime(1_000) })
    expect(view.result.current).toBeNull()
    // Next assistant step starts streaming.
    act(() => { tokens = 120; view.rerender() })
    act(() => { vi.advanceTimersByTime(1_000) })
    expect(view.result.current).not.toBeNull()
  })

  it('disables immediately (rate null) when the stream closes', () => {
    let tokens = 0
    const initial = renderHook(({ enabled }) => useWindowedTokenRate(enabled, 1_000, tokens), {
      initialProps: { enabled: true },
    })
    act(() => { tokens = 50; initial.rerender({ enabled: true }) })
    act(() => { vi.advanceTimersByTime(1_000) })
    expect(initial.result.current).not.toBeNull()
    initial.rerender({ enabled: false })
    expect(initial.result.current).toBeNull()
  })
})
