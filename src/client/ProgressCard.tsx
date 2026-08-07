/**
 * ProgressCard: the animated toolview for the `report_progress` tool.
 *
 * Parses the tool's args (task/percent/stage/note) from the call block and
 * renders a compact progress card: a spinning leading glyph while the call
 * runs, a shimmer-animated fill bar whose width eases to the reported
 * percent, a pulsing glow on completion, and the stage/note lines. The
 * running state (call seen, result not yet) plays the sweep animation; the
 * settled state freezes the final bar.
 *
 * Live chrome on top of the bar: while the call runs the card ticks an
 * elapsed readout; a settled call shows its total wall time. When the model
 * reports a rough remaining-time estimate (args.eta), an ETA row shows on
 * running and settled-but-unfinished cards (an instant tool never shows a
 * running frame, so the estimate stays visible on the settled card) and
 * hides on done/failed cards. No reported eta — no ETA row (unknown stays
 * unknown). A failed result (isError) switches the whole card to the error
 * state — warning glyph, error-tinted fill and copy. When several in-window
 * calls share the same task name, the card replaces the single stage line
 * with the derived stage timeline (chain of distinct reported stages).
 */
import {
  IconCheckOutline16,
  IconLoadingOutline16,
  IconWarningOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { ToolRowProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { parseArgs, taskOf, toPercent, etaOf } from './args.ts'
import css from './ProgressCard.module.css'
import { deriveStageTimeline } from './stage-timeline.ts'
import { formatElapsed, useNow } from './timing.ts'

export type { ProgressArgs } from './args.ts'

/** Progress card props: the toolview runtime share plus the standard locale seat. */
export type ProgressCardProps = ToolRowProps & PropsLocale<'progress'>

/** Format the bar's leading label: task name, or a localized fallback. */
function taskLabel(args: ReturnType<typeof parseArgs>, t: ProgressCardProps['t']): string {
  const task = args?.task
  return typeof task === 'string' && task !== '' ? task : t('card.title')
}

/**
 * The animated progress row. The args come from the call head (stable while
 * running and settled alike); the running/settled distinction only switches
 * the sweep animation on/off.
 */
export function ProgressCard({ toolName, block, inspect, t, useSession }: ProgressCardProps) {
  const argsRaw = ('kind' in block ? block.call?.argsRaw : block.argsRaw) ?? ''
  const args = parseArgs(argsRaw)
  // RunningToolCall (call seen, result not yet) has no `kind`; ToolResultNode
  // (settled) carries `kind: 'tool-result'` — the running sweep plays only
  // while the call is in flight.
  const running = !('kind' in block)
  const failed = 'kind' in block && block.kind === 'tool-result' && block.isError
  const percent = toPercent(args?.percent)
  const done = percent >= 100
  const stage = typeof args?.stage === 'string' && args.stage !== '' ? args.stage : undefined
  const note = typeof args?.note === 'string' && args.note !== '' ? args.note : undefined
  const task = taskOf(args)

  // Live elapsed: now − call time while running; result time − call time once
  // settled (callTime is null when window truncation left the call outside).
  const now = useNow(running)
  const elapsedMs = running
    ? Math.max(0, now - block.time)
    : 'kind' in block && block.callTime !== null
      ? Math.max(0, block.time - block.callTime)
      : null
  // ETA rides the model's own knowledge (args.eta): a rough remaining-time
  // estimate the model can actually judge. No reported eta — no ETA row;
  // linear extrapolation is not an estimate and is never shown. The row
  // stays on settled intermediate cards (a 20% report with "约5小时" remains
  // visible after the call settles — instant tools never show a running
  // frame), and hides on done/failed cards (the render guard below).
  const etaText = etaOf(args)

  // Stage timeline: in-window report_progress calls sharing this card's task,
  // in report order. Only real task names correlate (the fallback title is
  // not a task identity).
  const nodes = useSession(s => s.nodes)
  const runningCalls = useSession(s => s.runningCalls)
  const timeline = useMemo(
    () => task !== null ? deriveStageTimeline(nodes, runningCalls, task) : [],
    [nodes, runningCalls, task],
  )

  let body: ReactNode = null
  if (args !== null) {
    body = (
      <div className={css.card}>
        <div className={css.head}>
          <span className={css.title}>{taskLabel(args, t)}</span>
          <span className={clsx(css.percent, done && css.percentDone, failed && css.percentError)}>{percent}%</span>
        </div>
        <div className={css.track} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={clsx(css.fill, running && css.fillRunning, done && !failed && css.fillDone, failed && css.fillError)}
            style={{ width: `${percent}%` }}
          />
          {/* Shimmer band gliding over the fill while the call is running. */}
          {running && <div className={css.shimmer} />}
        </div>
        {elapsedMs !== null && (
          <div className={css.line}>
            <span className={css.lineLabel}>{t('card.elapsed')}</span>
            <span className={css.lineValue}>{formatElapsed(elapsedMs)}</span>
          </div>
        )}
        {!failed && etaText !== null && (
          <div className={css.line}>
            <span className={css.lineLabel}>{t('card.eta')}</span>
            <span className={css.lineValue}>{etaText}</span>
          </div>
        )}
        {/* A multi-stage chain replaces the single stage line (its last row is this call's stage). */}
        {timeline.length >= 2 ? (
          <div className={css.timeline}>
            <span className={css.timelineLabel}>{t('card.stages')}</span>
            {timeline.map((entry, index) => (
              <div key={`${entry.stage}-${index}`} className={css.timelineRow}>
                <span className={clsx(css.timelineDot, index === timeline.length - 1 && css.timelineDotCurrent)} />
                <span className={css.timelineStage}>{entry.stage}</span>
                <span className={css.timelinePercent}>{entry.percent}%</span>
              </div>
            ))}
          </div>
        ) : (
          stage !== undefined && (
            <div className={css.line}>
              <span className={css.lineLabel}>{t('card.stage')}</span>
              <span className={css.lineValue}>{stage}</span>
            </div>
          )
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
    <div
      className={css.root}
      data-tool={toolName}
      data-state={running ? 'running' : failed ? 'error' : done ? 'done' : 'idle'}
    >
      <div className={css.row}>
        <div className={clsx(css.leading, running && css.leadingRunning, failed && css.leadingError)}>
          {failed ? <IconWarningOutline16 /> : done ? <IconCheckOutline16 /> : <IconLoadingOutline16 />}
        </div>
        <div className={css.titleLine}>{taskLabel(args, t)}</div>
        {running && <span className={css.status}>{t('card.title')}</span>}
        {failed && <span className={clsx(css.status, css.statusError)}>{t('card.error')}</span>}
        {done && !failed && <span className={clsx(css.status, css.statusDone)}>{t('card.done')}</span>}
        {inspect !== undefined && (
          <button type="button" className={css.inspect} onClick={inspect} aria-label="Inspect">↗</button>
        )}
      </div>
      {body}
    </div>
  )
}
