/**
 * ProgressCard: the animated toolview for the `report_progress` tool.
 *
 * Parses the tool's args (task/percent/stage/note) from the call block and
 * renders a compact progress card: a spinning leading glyph while the call
 * runs, a shimmer-animated fill bar whose width eases to the reported
 * percent, a pulsing glow on completion, and the stage/note lines. The
 * running state (call seen, result not yet) plays the sweep animation; the
 * settled state freezes the final bar.
 */
import { IconCheckOutline16, IconLoadingOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { ToolRowProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import css from './ProgressCard.module.css'

/** Progress card props: the toolview runtime share plus the standard locale seat. */
export type ProgressCardProps = ToolRowProps & PropsLocale<'progress'>

/** One parsed args record, shape-checked (model JSON: any field may be missing or mistyped). */
export interface ProgressArgs {
  task?: unknown
  percent?: unknown
  stage?: unknown
  note?: unknown
}

function parseArgs(argsRaw: string): ProgressArgs | null {
  try {
    const parsed: unknown = JSON.parse(argsRaw)
    if (typeof parsed !== 'object' || parsed === null) return null
    // Every ProgressArgs field is optional unknown, so the narrowed `object`
    // is already assignable — no assertion needed.
    return parsed
  } catch {
    // Mid-stream truncation or malformed model JSON: fall back to the generic row.
    return null
  }
}

/** Clamp a model-reported percent into 0..100; non-numeric input reads as 0. */
function toPercent(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

/** Format the bar's leading label: task name, or a localized fallback. */
function taskLabel(args: ProgressArgs | null, t: ProgressCardProps['t']): string {
  const task = args?.task
  return typeof task === 'string' && task !== '' ? task : t('card.title')
}

/**
 * The animated progress row. The args come from the call head (stable while
 * running and settled alike); the running/settled distinction only switches
 * the sweep animation on/off.
 */
export function ProgressCard({ toolName, block, inspect, t }: ProgressCardProps) {
  const argsRaw = ('kind' in block ? block.call?.argsRaw : block.argsRaw) ?? ''
  const args = parseArgs(argsRaw)
  // RunningToolCall (call seen, result not yet) has no `kind`; ToolResultNode
  // (settled) carries `kind: 'tool-result'` — the running sweep plays only
  // while the call is in flight.
  const running = !('kind' in block)
  const percent = toPercent(args?.percent)
  const done = percent >= 100
  const stage = typeof args?.stage === 'string' && args.stage !== '' ? args.stage : undefined
  const note = typeof args?.note === 'string' && args.note !== '' ? args.note : undefined

  let body: ReactNode = null
  if (args !== null) {
    body = (
      <div className={css.card}>
        <div className={css.head}>
          <span className={css.title}>{taskLabel(args, t)}</span>
          <span className={clsx(css.percent, done && css.percentDone)}>{percent}%</span>
        </div>
        <div className={css.track} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={clsx(css.fill, running && css.fillRunning, done && css.fillDone)}
            style={{ width: `${percent}%` }}
          />
          {/* Shimmer band gliding over the fill while the call is running. */}
          {running && <div className={css.shimmer} />}
        </div>
        {stage !== undefined && (
          <div className={css.line}>
            <span className={css.lineLabel}>{t('card.stage')}</span>
            <span className={css.lineValue}>{stage}</span>
          </div>
        )}
        {note !== undefined && (
          <div className={css.line}>
            <span className={css.lineLabel}>{t('card.note')}</span>
            <span className={css.lineValue}>{note}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={css.root} data-tool={toolName} data-state={running ? 'running' : done ? 'done' : 'idle'}>
      <div className={css.row}>
        <div className={clsx(css.leading, running && css.leadingRunning)}>
          {done ? <IconCheckOutline16 /> : <IconLoadingOutline16 />}
        </div>
        <div className={css.titleLine}>{taskLabel(args, t)}</div>
        {running && <span className={css.status}>{t('card.title')}</span>}
        {done && <span className={clsx(css.status, css.statusDone)}>{t('card.done')}</span>}
        {inspect !== undefined && (
          <button type="button" className={css.inspect} onClick={inspect} aria-label="Inspect">↗</button>
        )}
      </div>
      {body}
    </div>
  )
}
