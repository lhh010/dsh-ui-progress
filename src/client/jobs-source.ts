/**
 * Background-job signal: the client `jobs` service roster for the current
 * session. Hosts before the jobs capability (and any composition without
 * api-job-controller) lack the service — every access then degrades to
 * "no background jobs" instead of crashing.
 */
import { useEffect, useState } from 'react'
import type { SessionId } from '@deepseek-ai/dsh-session/types'

/** Structural subset of the client jobs service this plugin reads. */
interface JobRowLike { readonly kind?: string; readonly status?: string }
interface JobsSnapshotLike { readonly rows?: Readonly<Record<string, readonly JobRowLike[] | undefined>> }
interface JobsSourceLike {
  getSnapshot(): JobsSnapshotLike
  subscribe(listener: () => void): () => void
}
export interface JobsServiceLike {
  readonly state: JobsSourceLike
  watchRows(sessionId: string): () => void
}

/** Lazy service resolver; set once from apply (the service may mount later). */
let getService: () => JobsServiceLike | undefined = () => undefined

/** Remember how to reach the client jobs service (called once from apply). */
export function setJobsServiceGetter(resolve: () => JobsServiceLike | undefined): void {
  // The resolver touches a cordis service property, which can throw while the
  // provider fiber is not running — never let that reach the render path.
  getService = () => {
    try { return resolve() } catch { return undefined }
  }
}

/** Running-or-stopping background jobs of one session; subagent-kind jobs are
 *  excluded because the sessions seat already counts those as subagent rows. */
function runningJobCount(sessionId: SessionId): number {
  let rows: readonly JobRowLike[] | undefined
  try { rows = getService()?.state.getSnapshot().rows?.[sessionId] } catch { return 0 }
  if (rows === undefined) return 0
  let count = 0
  for (const job of rows) {
    if (job.kind === 'subagent') continue
    if (job.status === 'running' || job.status === 'stopping') count += 1
  }
  return count
}

/** Reactive running-background-job count for one session; 0 without the service. */
export function useBackgroundJobCount(sessionId: SessionId): number {
  const [count, setCount] = useState(() => runningJobCount(sessionId))
  useEffect(() => {
    let stopWatch: (() => void) | undefined
    let unsubscribe: (() => void) | undefined
    try {
      const service = getService()
      stopWatch = service?.watchRows(sessionId)
      unsubscribe = service?.state.subscribe(() => setCount(runningJobCount(sessionId)))
      setCount(runningJobCount(sessionId))
    } catch {
      // Service absent mid-lifecycle: keep the last count (0); nothing to clean.
    }
    return () => { unsubscribe?.(); stopWatch?.() }
  }, [sessionId])
  return count
}
