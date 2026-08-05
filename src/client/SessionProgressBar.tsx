/**
 * SessionProgressBar: a resident session-progress strip in the composer
 * input dock, derived entirely from the live {@link ConversationSnapshot}.
 *
 * The bar needs no model-facing tool: it reads the framework's `useSession`
 * hook (session-scope standard kit) and renders the real execution state —
 * whether the turn is running, which tool call is in flight, how many tool
 * results have settled in the current window, and the current turn number.
 * Animation follows the state: a shimmer glide while running, a static
 * filled bar when idle, and a completion glow whenever the window shows a
 * finished turn.
 */
import { IconLoadingOutline16, IconSparkle16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { ConversationSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import css from './SessionProgressBar.module.css'

/** Dock entry props: InputZone owner share + session standard kit + locale seat. */
export type SessionProgressBarProps = import('@deepseek-ai/dsh-client-ui-slots').PropsRuntime<'conversation.input.dock'> & PropsLocale<'progress'>

/**
 * Count settled tool results in the current snapshot window. The node stream
 * is the presentation-truth source: a result node exists exactly when a tool
 * call completed (and re-renders live as the window advances).
 */
function settledToolCount(snapshot: ConversationSnapshot): number {
  let count = 0
  for (const node of snapshot.nodes) {
    if (node.kind === 'tool-result') count += 1
  }
  return count
}

/**
 * The bar's progress value in 0..100. Each settled tool result advances the
 * bar by one fixed segment (window cap 10), so the fill both reflects real
 * work completed and stays visually bounded in long sessions.
 */
function progressPercent(snapshot: ConversationSnapshot): number {
  return Math.min(100, settledToolCount(snapshot) * 10)
}

/** The in-flight tool name when running; undefined when nothing is executing. */
function runningTool(snapshot: ConversationSnapshot): string | undefined {
  return snapshot.runningCalls[0]?.name
}

/** Human label for the current state; null means the dock row renders no text. */
function stateLabel(
  snapshot: ConversationSnapshot,
  runningToolName: string | undefined,
  t: SessionProgressBarProps['t'],
): ReactNode {
  if (snapshot.running) {
    return runningToolName !== undefined ? t('bar.tool', { name: runningToolName }) : t('bar.running')
  }
  return t('bar.idle')
}

/**
 * Resident progress strip. Renders nothing until a session snapshot exists
 * (the no-session hero has no dock content), then shows the state text, the
 * animated fill bar, and the turn/tool counters.
 */
export function SessionProgressBar({ session, t }: SessionProgressBarProps) {
  if (session === undefined || session === null) return null
  const toolName = runningTool(session)
  const running = session.running
  const percent = progressPercent(session)
  const turn = session.turnTimings.size
  const settled = settledToolCount(session)

  return (
    <div className={css.dock} data-progress-bar>
      <div className={css.bar} data-state={running ? 'running' : 'idle'}>
        <span className={clsx(css.glyph, running && css.glyphRunning)}>
          {running ? <IconLoadingOutline16 size={14} /> : <IconSparkle16 size={14} />}
        </span>
        <span className={css.label}>{stateLabel(session, toolName, t)}</span>
        <div className={css.track} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={clsx(css.fill, running && css.fillRunning)}
            style={{ width: `${percent}%` }}
          />
          {running && <div className={css.shimmer} />}
        </div>
        <span className={css.counter}>{t('bar.turn', { turn })}</span>
        <span className={css.counter}>{t('bar.tools', { count: settled })}</span>
      </div>
    </div>
  )
}
