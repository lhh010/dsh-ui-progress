/**
 * SessionProgressBar: a resident session-progress strip in the composer
 * input dock, derived entirely from the live {@link ConversationSnapshot}
 * plus the `todos` session projection.
 *
 * The bar needs no model-facing tool: it reads the framework's `useSession`
 * hook and the `todos` projection (session-scope standard kit) and renders
 * the real execution state — whether the turn is running, which tool call is
 * in flight, whether the model is emitting reasoning, and the task
 * completion ratio. Progress follows the truth order: a live todos list wins
 * (completed/total is the real task completion — five tasks with two done
 * reads 40%); without one, each settled tool result advances the bar by one
 * segment as a bounded heuristic. Animation follows the state: a spinning
 * glyph and shimmer glide while running, a static filled bar when idle.
 */
import { IconLoadingOutline16, IconSparkle16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { ConversationSnapshot, TodoItem } from '@deepseek-ai/dsh-client-runtime/client'
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
 * True while the model is emitting reasoning: the in-flight partial carries a
 * reasoning block and no tool call is in flight (a running tool is the more
 * specific state and wins the label).
 */
function isReasoning(snapshot: ConversationSnapshot): boolean {
  return snapshot.partial?.blocks.some(block => block.kind === 'reasoning') ?? false
}

/** The in-flight tool name when running; undefined when nothing is executing. */
function runningTool(snapshot: ConversationSnapshot): string | undefined {
  return snapshot.runningCalls[0]?.name
}

/** Completed/active/total from a live todos projection; null when unavailable or empty. */
function todoCounts(todos: readonly TodoItem[] | null | undefined): { done: number; active: number; total: number } | null {
  if (todos === undefined || todos === null || todos.length === 0) return null
  let done = 0
  let active = 0
  for (const item of todos) {
    if (item.status === 'completed') done += 1
    else if (item.status === 'in_progress') active += 1
  }
  return { done, active, total: todos.length }
}

/**
 * The bar's progress value in 0..100. A live `todos` projection wins: the
 * (completed + in-progress)/total ratio is the real task completion — the
 * in-flight task counts toward progress, so five tasks with two done and one
 * in progress reads 60%. Without one, each settled tool result advances the
 * bar by one fixed segment (window cap 10), a visually bounded heuristic for
 * sessions that never write a todo list.
 */
function progressPercent(snapshot: ConversationSnapshot, todos: readonly TodoItem[] | null | undefined): number {
  const counts = todoCounts(todos)
  if (counts !== null) return Math.round(((counts.done + counts.active) / counts.total) * 100)
  return Math.min(100, settledToolCount(snapshot) * 10)
}

/** Human label for the current state; null means the dock row renders no text. */
function stateLabel(
  snapshot: ConversationSnapshot,
  runningToolName: string | undefined,
  thinking: boolean,
  counts: { done: number; active: number; total: number } | null,
  t: SessionProgressBarProps['t'],
): ReactNode {
  if (snapshot.running) {
    if (runningToolName !== undefined) return t('bar.tool', { name: runningToolName })
    if (thinking) return t('bar.thinking')
    return t('bar.running')
  }
  if (counts !== null) return t('bar.todos', { done: counts.done, active: counts.active, total: counts.total })
  return t('bar.idle')
}

/**
 * Resident progress strip. Renders nothing until a session snapshot exists
 * (the no-session hero has no dock content), then shows the state text, the
 * animated fill bar with a live percent readout, and the turn/tool counters.
 */
export function SessionProgressBar({ session, t, useProjection }: SessionProgressBarProps) {
  // Defensive guard: InputZone.session is typed non-null, but a host passing
  // no session must degrade to an empty dock instead of crashing.
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  if (session === undefined || session === null) return null
  const todos = useProjection('todos')
  const toolName = runningTool(session)
  const running = session.running
  const thinking = running && toolName === undefined && isReasoning(session)
  const counts = todoCounts(todos)
  const percent = progressPercent(session, todos)
  const turn = session.turnTimings.size
  const settled = settledToolCount(session)

  return (
    <div className={css.dock} data-progress-bar>
      <div className={css.bar} data-state={running ? 'running' : 'idle'}>
        <span className={clsx(css.glyph, running && css.glyphRunning)}>
          {running ? <IconLoadingOutline16 size={14} /> : <IconSparkle16 size={14} />}
        </span>
        <span className={css.label}>{stateLabel(session, toolName, thinking, counts, t)}</span>
        <div className={css.track} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={clsx(css.fill, running && css.fillRunning)}
            style={{ width: `${percent}%` }}
          />
          {running && <div className={css.shimmer} />}
        </div>
        <span className={css.percent}>{percent}%</span>
        <span className={css.counter}>{t('bar.turn', { turn })}</span>
        <span className={css.counter}>{t('bar.tools', { count: settled })}</span>
      </div>
    </div>
  )
}
