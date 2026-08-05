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
 * edge, not a call dependency: both 'conversation.input.dock' and
 * 'conversation.chat.toolview' are declared by ui-conversation's apply, and
 * register() into an undeclared slot throws — service waiting orders this
 * apply after the declaring one.
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

  ctx.effect(
    () => ctx.slots.register(
      { name: 'conversation.chat.toolview', key: 'report_progress', locale: NS },
      ProgressCard,
    ),
    'ui-progress: toolview registration',
  )
}
