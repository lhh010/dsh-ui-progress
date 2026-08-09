/**
 * Task-progress plugin, browser half: the resident session-progress strip
 * (input dock) plus the animated toolview for the `report_progress` tool.
 * The strip derives live execution state from the conversation snapshot —
 * no model-facing tool required; the toolview stays as the manual-report
 * card. Export discipline: packages/client/AGENTS.md — only the cordis apply
 * surface and contract types leave this package.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: the `todos` SessionProjectionMap key merge (single source, the todo domain's pure outlet).
import type {} from '@deepseek-ai/dsh-tool-todo/client'
// Type-only: pulls the SlotMap merges for the slots this plugin registers
// into — 'conversation.input.dock' (declared by ui-conversation's contract)
// and 'tool.call.toolview' (declared by ui-tool's contract). Without them the
// register overloads see no declared slot names.
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-tool/client'
import { ProgressCard } from './ProgressCard.tsx'
import { SessionProgressBar } from './SessionProgressBar.tsx'
import { en, zh, type ProgressKey } from './locales.ts'

export type { ProgressArgs, ProgressCardProps } from './ProgressCard.tsx'
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

/**
 * Required services (cordis fiber inject). 'conversation' is an ordering
 * edge for the input-dock registration, not a call dependency: the dock slot
 * is declared by ui-conversation's apply. The atomic toolview slot
 * 'tool.call.toolview' is declared by ui-tool's apply, so that registration
 * waits on the slot declaration through slots.inject rather than the fiber.
 */
export const inject = ['slots', 'conversation', 'locale']

/**
 * Client plugin body: register the `progress` dictionaries, the resident
 * session-progress strip into the input dock, and the animated progress card
 * into the keyed toolview hole under the `report_progress` tool name.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-progress: dictionaries')

  // Conditional mount: the input dock is declared by the conversation entry;
  // waiting on the conversation service is the registration-safe signal.
  ctx.inject(['slots', 'conversation', 'sessions'], (scope: ClientContext) => {
    scope.effect(
      () => scope.slots.register(
        { name: 'conversation.input.dock', id: 'progress', order: 20, locale: NS },
        SessionProgressBar,
      ),
      'ui-progress: session progress strip',
    )
  })

  // The animated progress card renders under the 'report_progress' tool name
  // in ui-tool's keyed 'tool.call.toolview' hole. slots.inject waits for
  // ui-tool to declare the slot, then registers (and re-registers if the
  // declaration is ever replaced).
  ctx.slots.inject('tool.call.toolview', () => ctx.slots.register(
    { name: 'tool.call.toolview', key: 'report_progress', locale: NS },
    ProgressCard,
  ))
}
