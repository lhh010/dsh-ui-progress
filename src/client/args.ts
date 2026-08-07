/**
 * Parsing helpers for the `report_progress` tool args (model JSON: any field
 * may be missing or mistyped, so every read is shape-checked here once and
 * consumed through these narrow accessors).
 */

/** One parsed args record, shape-checked (model JSON: any field may be missing or mistyped). */
export interface ProgressArgs {
  task?: unknown
  percent?: unknown
  stage?: unknown
  note?: unknown
}

/**
 * Parse the call head's args JSON into a record; malformed or non-object
 * input reads as null.
 * @param argsRaw - the raw JSON string from the call block.
 * @returns the parsed record, or null when it is not a JSON object.
 */
export function parseArgs(argsRaw: string): ProgressArgs | null {
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

/**
 * Clamp a model-reported percent into 0..100; non-numeric input reads as 0.
 * @param value - the raw percent field.
 * @returns the clamped integer percent.
 */
export function toPercent(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

/**
 * The task name, or null when absent or empty (the fallback title is not a
 * task identity — timeline correlation uses only real task names).
 * @param args - the parsed args record.
 * @returns the raw task string, or null.
 */
export function taskOf(args: ProgressArgs | null): string | null {
  const task = args?.task
  return typeof task === 'string' && task !== '' ? task : null
}

/**
 * The stage name, or null when absent or empty.
 * @param args - the parsed args record.
 * @returns the raw stage string, or null.
 */
export function stageOf(args: ProgressArgs | null): string | null {
  const stage = args?.stage
  return typeof stage === 'string' && stage !== '' ? stage : null
}
