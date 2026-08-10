/**
 * Unit tests for the live token-rate derivations: the CJK-aware partial
 * estimate, the decode-window rate, and the compact formatter. Pure
 * functions — no React, no framework state, no DOM.
 */
import { describe, expect, it } from 'vitest'
import type { PartialAssistant } from '@deepseek-ai/dsh-client-runtime/client'
import { estimatePartialTokens, formatTokenRate, liveTokenRate } from '../src/client/token-rate.ts'

function partialOf(blocks: PartialAssistant['blocks']): PartialAssistant {
  return { turn: 1, step: 1, blocks }
}

describe('estimatePartialTokens', () => {
  it('prices nothing when the model is not emitting', () => {
    expect(estimatePartialTokens(null)).toBe(0)
  })

  it('prices nothing for an empty or content-free partial', () => {
    expect(estimatePartialTokens(partialOf([]))).toBe(0)
    expect(estimatePartialTokens(partialOf([{ kind: 'text', text: '' }]))).toBe(0)
  })

  it('prices narrow text at the fixed 4-char-per-token density', () => {
    expect(estimatePartialTokens(partialOf([{ kind: 'text', text: 'abcd' }]))).toBe(1)
    expect(estimatePartialTokens(partialOf([{ kind: 'text', text: 'abcdefgh' }]))).toBe(2)
    // Ceiling: five narrow chars cost ceil(5/4) = 2 tokens.
    expect(estimatePartialTokens(partialOf([{ kind: 'text', text: 'abcde' }]))).toBe(2)
  })

  it('prices each CJK-wide character as one token', () => {
    // Han ideographs.
    expect(estimatePartialTokens(partialOf([{ kind: 'text', text: '你好世界' }]))).toBe(4)
    // Kana.
    expect(estimatePartialTokens(partialOf([{ kind: 'text', text: 'こんにちは' }]))).toBe(5)
    // Hangul.
    expect(estimatePartialTokens(partialOf([{ kind: 'text', text: '안녕하세요' }]))).toBe(5)
  })

  it('mixes wide and narrow characters', () => {
    // 2 wide + ceil(3 narrow / 4) = 2 + 1 = 3.
    expect(estimatePartialTokens(partialOf([{ kind: 'text', text: '你好abc' }]))).toBe(3)
  })

  it('sums text and reasoning bodies', () => {
    const partial = partialOf([
      { kind: 'reasoning', text: '思考' },
      { kind: 'text', text: 'answer' },
    ])
    expect(estimatePartialTokens(partial)).toBe(2 + 2)
  })

  it('counts tool-call name and arguments, but not opaque blocks', () => {
    const partial = partialOf([
      { kind: 'tool-call', callId: 'c1', name: 'bash', argsRaw: '{"cmd":"ls"}' },
      { kind: 'other', block: { arbitrary: true } },
    ])
    // name "bash" = 4 narrow chars -> 1; args 12 narrow chars -> 3; total 4.
    expect(estimatePartialTokens(partial)).toBe(4)
  })
})

describe('liveTokenRate', () => {
  it('stays null before the window opens or while empty', () => {
    expect(liveTokenRate(0, 1_000, 2_000)).toBeNull()
    expect(liveTokenRate(10, 2_000, 2_000)).toBeNull()
  })

  it('clamps a not-yet-open window to null', () => {
    expect(liveTokenRate(10, 2_000, 1_000)).toBeNull()
  })

  it('divides estimated tokens by the decode wall time', () => {
    expect(liveTokenRate(10, 0, 2_000)).toBe(5)
    expect(liveTokenRate(100, 0, 10_000)).toBe(10)
  })
})

describe('formatTokenRate', () => {
  it('shows one decimal below ten tokens per second', () => {
    expect(formatTokenRate(4.567)).toBe('4.6')
    expect(formatTokenRate(0)).toBe('0')
  })

  it('shows whole tokens from ten up', () => {
    expect(formatTokenRate(12.3)).toBe('12')
    expect(formatTokenRate(9.96)).toBe('10')
  })

  it('clamps negatives to zero', () => {
    expect(formatTokenRate(-3)).toBe('0')
  })
})
