/**
 * Unit tests for the background-job signal (`countRunningJobs`): the strip's
 * teal background state must cover live shell jobs, not only subagent
 * sessions, while subagent-kind jobs stay excluded so one worker is never
 * counted twice (the sessions seat already counts those).
 */
import { describe, expect, it } from 'vitest'
import { countRunningJobs, type JobRowLike } from '../src/client/jobs-source.ts'

/** One roster row with the two fields the counter reads. */
function job(kind: string | undefined, status: string | undefined): JobRowLike {
  return { kind, status }
}

describe('countRunningJobs', () => {
  it('reads an absent roster as no work', () => {
    expect(countRunningJobs(undefined)).toBe(0)
    expect(countRunningJobs([])).toBe(0)
  })

  it('counts running and stopping jobs', () => {
    expect(countRunningJobs([job('bash', 'running')])).toBe(1)
    expect(countRunningJobs([job('bash', 'running'), job('pwsh', 'stopping')])).toBe(2)
  })

  it('ignores settled jobs', () => {
    const settled = ['completed', 'killed', 'failed'].map(s => job('bash', s))
    expect(countRunningJobs(settled)).toBe(0)
    expect(countRunningJobs([...settled, job('bash', 'running')])).toBe(1)
  })

  it('excludes subagent-kind jobs so a subagent is counted once', () => {
    expect(countRunningJobs([job('subagent', 'running')])).toBe(0)
    expect(countRunningJobs([job('subagent', 'running'), job('bash', 'running')])).toBe(1)
  })

  it('counts a running job whose kind the build does not know', () => {
    // Only the subagent kind has a second counting seat; an unlabeled or
    // unrecognized kind is still live background work.
    expect(countRunningJobs([job(undefined, 'running')])).toBe(1)
    expect(countRunningJobs([job('workflow', 'running')])).toBe(1)
    // A row with no status is not known to be working.
    expect(countRunningJobs([job('bash', undefined)])).toBe(0)
  })
})
