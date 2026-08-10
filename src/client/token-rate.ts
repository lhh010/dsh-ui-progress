/**
 * Pure live token-rate derivations for the session progress strip. Streaming
 * chunks carry no token counts — the provider only reports usage at step end —
 * so the live rate estimates tokens from the in-flight partial's characters
 * and divides by the decode wall time since the first visible token. All of
 * it is a pure function of the {@link PartialAssistant} plus two timestamps:
 * no React, no framework state. The component supplies the first-token
 * observation time through its behavioral hook (see timing.ts).
 */

import type { PartialAssistant } from '@deepseek-ai/dsh-client-runtime/client'

/**
 * Wide CJK characters priced at one token each: CJK punctuation/forms,
 * kana, CJK ideographs (incl. extension A and compatibility), and hangul.
 * A single regex alternation so a per-character test is stateless.
 */
const CJK_CHAR = /[\u3000-\u303F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF\uFF00-\uFFEF]/

/**
 * Non-CJK density: every 4 chars ≈ 1 token. Mirrors the core token-meter's
 * fixed CHARS_PER_TOKEN so English text prices identically on both surfaces;
 * the CJK half diverges on purpose — the meter's flat density is a
 * conservative context-budget heuristic, while a live throughput readout
 * should track real generation, where one CJK char is typically one token.
 */
const CHARS_PER_TOKEN = 4

/**
 * Estimate the tokens streamed so far from the in-flight partial: wide CJK
 * characters count one each, remaining characters at the fixed 4-per-token
 * density (text and reasoning bodies plus tool-call name/arguments). Blocks
 * of unknown kind carry no readable text and contribute nothing.
 * @param partial - the live streaming partial, or null when the model is not emitting.
 * @returns estimated streamed tokens; 0 when nothing is emitting or no visible content.
 */
export function estimatePartialTokens(partial: PartialAssistant | null): number {
  if (partial === null) return 0
  let wide = 0
  let narrow = 0
  for (const block of partial.blocks) {
    const text = block.kind === 'tool-call' ? block.name + block.argsRaw
      : block.kind === 'text' || block.kind === 'reasoning' ? block.text
      : ''
    for (const char of text) {
      if (CJK_CHAR.test(char)) wide += 1
      else narrow += 1
    }
  }
  return wide + Math.ceil(narrow / CHARS_PER_TOKEN)
}

/**
 * Live tokens per second over the decode window (first visible token → now).
 * Mirrors the core's settled reading — output tokens over decode wall time —
 * so the running figure is directly comparable to the post-turn value shown
 * by the conversation StatsLine.
 * @param tokens - estimated streamed tokens ({@link estimatePartialTokens}).
 * @param firstTokenAt - epoch ms when the first visible token was observed.
 * @param now - epoch ms clock reading.
 * @returns tokens/sec, or null while the window is empty or not yet open.
 */
export function liveTokenRate(tokens: number, firstTokenAt: number, now: number): number | null {
  const decodeMs = now - firstTokenAt
  if (tokens <= 0 || decodeMs <= 0) return null
  return tokens / (decodeMs / 1_000)
}

/**
 * Compact rate figure: whole tokens from ten up, one decimal below (same
 * shape as the core's formatTokensPerSecond, which the settled footer uses).
 * @param tps - tokens per second (negatives clamp to zero).
 * @returns display number without unit.
 */
export function formatTokenRate(tps: number): string {
  const clamped = Math.max(0, tps)
  return clamped >= 10 ? String(Math.round(clamped)) : String(Math.round(clamped * 10) / 10)
}
