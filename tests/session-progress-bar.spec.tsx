// @vitest-environment jsdom
/**
 * Component-level smoke tests for SessionProgressBar: the resident strip
 * renders the live token-rate chip while the model streams (and only then),
 * computed as a sliding-window average that changes at most once per second.
 * Every @deepseek-ai face is stubbed — icons via vi.mock, the standard-kit
 * selector seats via plain scripted props — so the suite needs no resolution
 * into the harness snapshot's sources; CSS Modules stub to empty objects
 * under vitest's default css handling. The pure rate math itself is pinned
 * by tests/token-rate.spec.ts; this suite proves the wiring (anchor hook +
 * sliding-window clock + render gates) against the new slice-based props
 * (Session snapshot + Chat view legacy projection + pending-interaction map).
 */
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement } from 'react'
import type { ChatSnapshot, ConversationNode, PartialAssistant } from '@deepseek-ai/dsh-client-ui-chat/client'
// Type-only merges so the stubbed standard-kit props carry their declared types.
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-tool-todo/client'
import type {
  ConversationSnapshot, ConversationViewSnapshotStore,
} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {
  SessionListState, SessionSnapshot, SessionSummary,
} from '@deepseek-ai/dsh-api-session-controller/client'
import type { SessionPendingInteraction } from '@deepseek-ai/dsh-client-ui-session/client'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { SessionProgressBar, type SessionProgressBarProps } from '../src/client/SessionProgressBar.tsx'
import { zh } from '../src/client/locales.ts'

vi.mock('@deepseek-ai/dsh-client-ui-primitives', () => ({
  IconLoadingOutline16: () => null,
  IconSparkle16: () => null,
  IconWarningOutline16: () => null,
}))

afterEach(cleanup)
afterEach(() => vi.useRealTimers())

/** Translate stub over the zh dictionary with {param} interpolation. */
function makeT(): SessionProgressBarProps['t'] {
  const t = (key: string, params?: Record<string, string | number>): string => {
    const template = (zh as Record<string, string>)[key] ?? key
    return template.replace(/\{(\w+)\}/g, (_, name: string) => String(params?.[name] ?? ''))
  }
  return t as unknown as SessionProgressBarProps['t']
}

const SID = 'session-1' as SessionId

type BarOverrides = {
  running?: boolean
  partial?: PartialAssistant | null
  pending?: ReadonlyMap<SessionId, SessionPendingInteraction>
  nodes?: readonly ConversationNode[]
}

/** The Chat view snapshot the useConversation stub serves (legacy slice carries the fixtures). */
function chatOf(overrides: BarOverrides = {}): ChatSnapshot {
  return {
    order: [],
    nodes: { get: () => undefined, values: () => [] },
    locations: { getTurn: () => [], getStep: () => [] },
    navigation: { items: () => [] },
    timeline: { turnOrder: [], turns: new Map() },
    legacy: {
      nodes: overrides.nodes ?? [],
      turnTimings: new Map([[1, { startTime: 1_000 }]]),
      turnEnds: new Map(),
      partial: overrides.partial ?? null,
      runningCalls: [],
    },
  } as unknown as ChatSnapshot
}

/** The Session lifecycle snapshot the dock owner share carries. */
function sessionOf(overrides: Pick<BarOverrides, 'running'> = {}): SessionSnapshot {
  return {
    sessionId: SID,
    queue: [],
    pendingSubmissions: [],
    running: overrides.running ?? false,
    subagent: null,
    removed: false,
    openState: 'open',
    openError: null,
    hasMore: false,
    loadingOlder: false,
    promptError: null,
    blank: false,
    lastAgentError: null,
    promptAttempted: true,
    awaitingFirstTurn: false,
  }
}

/** The assembled Conversation snapshot whose chat view serves the fixture. */
function conversationOf(chat: ChatSnapshot): ConversationSnapshot {
  const views = { get: () => chat } as ConversationViewSnapshotStore
  return { views, activeTargets: new Set(['chat']) } as unknown as ConversationSnapshot
}

function barElement(overrides: BarOverrides = {}): ReactElement {
  const chat = chatOf(overrides)
  const conversation = conversationOf(chat)
  const emptyList = { byId: {} } as SessionListState
  return (
    <SessionProgressBar
      session={sessionOf(overrides)}
      input={{ draft: '', draftRev: 0, phase: 'plain' } as never}
      inputActions={{ } as never}
      sessionId={SID}
      t={makeT()}
      useConversation={((selector: (s: ConversationSnapshot) => unknown) => selector(conversation)) as never as SessionProgressBarProps['useConversation']}
      useProjection={((key: 'todos') => undefined) as unknown as SessionProgressBarProps['useProjection']}
      useSessions={((selector: (s: SessionListState) => unknown) => selector(emptyList)) as never as SessionProgressBarProps['useSessions']}
      useSessionPendingInteraction={((selector: (s: ReadonlyMap<SessionId, SessionPendingInteraction>) => unknown) => selector(overrides.pending ?? new Map())) as never as SessionProgressBarProps['useSessionPendingInteraction']}
      useSession={() => undefined as never}
      useInput={() => undefined as never}
      useChat={() => undefined as never}
      useWorkspaces={() => [] as never}
    />
  )
}

/** Render the strip and return a rerender that swaps the fixtures (streaming simulation). */
function renderBar(overrides: BarOverrides = {}): { rerender: (next: BarOverrides) => void } {
  const view = render(barElement(overrides))
  return { rerender: (next: BarOverrides) => view.rerender(barElement(next)) }
}

/** Full streaming partial: 4 CJK-wide chars -> 4 estimated tokens. */
const STREAMING_PARTIAL = {
  turn: 1,
  step: 1,
  blocks: [{ kind: 'text' as const, text: '你好世界' }],
}

/** Half of it: 2 estimated tokens, used to simulate tokens arriving over time. */
const PARTIAL_START = {
  turn: 1,
  step: 1,
  blocks: [{ kind: 'text' as const, text: '你好' }],
}

/** A settled step priced 8 real output tokens over 4 weighted chars -> density 2. */
const CALIBRATED_NODES = [{
  kind: 'assistant',
  seq: 1,
  time: 1_000,
  turn: 1,
  step: 1,
  blocks: STREAMING_PARTIAL.blocks,
  usage: { outputTokens: 8 },
}] as unknown as ConversationNode[]

describe('SessionProgressBar live token rate', () => {
  it('mounts and renders the running state from the zh dictionary', () => {
    renderBar({ running: true, partial: STREAMING_PARTIAL })
    expect(screen.getByText('正在执行')).toBeTruthy()
    expect(screen.getByText('100%')).toBeTruthy()
  })

  it('shows a sliding-window token rate that updates at most once per second', () => {
    vi.useFakeTimers()
    vi.setSystemTime(10_000)
    const bar = renderBar({ running: true, partial: PARTIAL_START })
    // Two more tokens arrive 300ms into the first window.
    act(() => {
      vi.advanceTimersByTime(300)
    })
    bar.rerender({ running: true, partial: STREAMING_PARTIAL })
    // First window completes at 11_000: gained 4-2 = 2 tokens over 1s.
    act(() => {
      vi.advanceTimersByTime(700)
    })
    expect(screen.getByText('2 tok/s')).toBeTruthy()
    // A window with no new tokens keeps the previous reading (no 0-flicker).
    act(() => {
      vi.advanceTimersByTime(1_000)
    })
    expect(screen.getByText('2 tok/s')).toBeTruthy()
  })

  it('scales the live estimate by the calibrated density of a settled step', () => {
    vi.useFakeTimers()
    vi.setSystemTime(10_000)
    // Density 2: 2 weighted chars -> 4 estimated tokens, 4 -> 8.
    const bar = renderBar({ running: true, partial: PARTIAL_START, nodes: CALIBRATED_NODES })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    bar.rerender({ running: true, partial: STREAMING_PARTIAL, nodes: CALIBRATED_NODES })
    act(() => {
      vi.advanceTimersByTime(700)
    })
    // Gained 8-4 = 4 tokens over 1s -> 4 tok/s.
    expect(screen.getByText('4 tok/s')).toBeTruthy()
  })

  it('hides the chip while a human interaction waits (paused stream)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(10_000)
    const pending = new Map<SessionId, SessionPendingInteraction>([
      [SID, { key: 'p1', kind: 'approval', sessionId: SID } as SessionPendingInteraction],
    ])
    renderBar({ running: true, partial: STREAMING_PARTIAL, pending })
    act(() => {
      vi.advanceTimersByTime(4_000)
    })
    expect(screen.queryByText(/tok\/s/)).toBeNull()
    expect(screen.getByText('等待审批')).toBeTruthy()
  })

  it('hides the chip until the partial carries visible tokens', () => {
    vi.useFakeTimers()
    vi.setSystemTime(10_000)
    renderBar({ running: true, partial: { turn: 1, step: 1, blocks: [{ kind: 'text', text: '' }] } })
    act(() => {
      vi.advanceTimersByTime(4_000)
    })
    expect(screen.queryByText(/tok\/s/)).toBeNull()
  })

  it('renders no chip when idle', () => {
    renderBar()
    expect(screen.queryByText(/tok\/s/)).toBeNull()
    expect(screen.getByText('会话就绪')).toBeTruthy()
  })
})
