/**
 * Task-progress plugin, browser half: the resident session-progress strip
 * (input dock). The strip derives live execution state from the Chat view
 * snapshot and the Session lifecycle snapshot — no model-facing tool
 * required; the report_progress toolview was removed in v0.8.0 (hosts that
 * provide the tool render their own surface).
 * Export discipline: packages/client/AGENTS.md — only the cordis apply
 * surface and contract types leave this package.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the Conversation service, input-dock SlotMap entry, and
// the SessionStandardProps useConversation merge.
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// Type-only: pulls the Chat view snapshot types (legacy slice, TodoItem).
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
// Type-only: pulls the global useSessions/useSessionPendingInteraction seats.
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
// Type-only: pulls the SessionSnapshot lifecycle contract.
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
// Type-only: the `todos` SessionProjectionMap key merge (single source, the todo domain's pure outlet).
import type {} from '@deepseek-ai/dsh-tool-todo/client'
import { SessionProgressBar } from './SessionProgressBar.tsx'
import { en, zh, type ProgressKey } from './locales.ts'

export type { SessionProgressBarProps } from './SessionProgressBar.tsx'
export type { ProgressKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The progress surfaces' copy. */
    progress: ProgressKey
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'progress'

/** Required services (cordis fiber inject): the slots registry and the locale seat. */
export const inject = ['slots', 'locale']

/**
 * Client plugin body: register the `progress` dictionaries and the resident
 * session-progress strip into the input dock. The dock slot is declared by
 * ui-conversation's apply; `slots.inject` waits on that declaration,
 * reruns after redeclaration, and rolls back with this plugin's fiber.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-progress: dictionaries')

  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register(
    { name: 'conversation.input.dock', id: 'progress', order: 20, locale: NS },
    SessionProgressBar,
  ))
}
