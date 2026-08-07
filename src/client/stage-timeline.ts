/**
 * Stage-timeline derivation for the report_progress card: fold the in-window
 * `report_progress` calls (settled results plus running calls) that share the
 * card's task name into an ordered chain of distinct stages. Window-scoped by
 * design — paging or compaction drops old reports and the chain restarts;
 * the current stage is always the chain's last row.
 */
import type { ConversationNode, RunningToolCall } from '@deepseek-ai/dsh-client-runtime/client'
import { parseArgs, stageOf, taskOf, toPercent } from './args.ts'

/** One timeline row: a distinct reported stage and the percent it carried. */
export interface StageTimelineEntry {
  stage: string
  percent: number
  /** Epoch ms of the reporting call (call event when running, result time when only the result is in-window). */
  time: number
}

/**
 * Derive the ordered stage chain for one task from the snapshot slices.
 * Consecutive repeats of the same stage collapse into one row (the run's last
 * percent wins); non-consecutive repeats stay as separate rows.
 * @param nodes - the settled conversation nodes.
 * @param runningCalls - the in-flight tool calls.
 * @param task - the exact task name to correlate on.
 * @returns the ordered chain; empty when no report matches the task.
 */
export function deriveStageTimeline(
  nodes: readonly ConversationNode[],
  runningCalls: readonly RunningToolCall[],
  task: string,
): readonly StageTimelineEntry[] {
  const entries: StageTimelineEntry[] = []
  for (const node of nodes) {
    if (node.kind !== 'tool-result' || node.call?.name !== 'report_progress') continue
    const args = parseArgs(node.call.argsRaw)
    if (args === null || taskOf(args) !== task) continue
    const stage = stageOf(args)
    if (stage === null) continue
    entries.push({ stage, percent: toPercent(args.percent), time: node.callTime ?? node.time })
  }
  for (const call of runningCalls) {
    if (call.name !== 'report_progress') continue
    const args = parseArgs(call.argsRaw)
    if (args === null || taskOf(args) !== task) continue
    const stage = stageOf(args)
    if (stage === null) continue
    entries.push({ stage, percent: toPercent(args.percent), time: call.time })
  }
  entries.sort((a, b) => a.time - b.time)
  const chain: StageTimelineEntry[] = []
  for (const entry of entries) {
    const last = chain[chain.length - 1]
    if (last !== undefined && last.stage === entry.stage) {
      // Same stage repeated: keep the run's first time, refresh the percent.
      chain[chain.length - 1] = { stage: entry.stage, percent: entry.percent, time: last.time }
    } else {
      chain.push(entry)
    }
  }
  return chain
}
