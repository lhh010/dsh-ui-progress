import { defineTool } from "@deepseek-ai/dsh-tools";
//#region src/index.ts
/**
* Task-progress plugin, node half: hosts the `report_progress` tool and
* injects the reporting guidance into the system prompt. The browser half
* (exports["./client"]) renders the progress surfaces; the tool is the
* model-facing contract those surfaces present. The tool registers only when
* no other host already provides it — a coexisting host plugin wins, and the
* browser half renders whoever registers it.
*/
/** Stable Cordis plugin name (matches the manifest id). */
const name = "@dsh-external/dsh-ui-progress";
/** Required host services: tool registry + system-prompt section registry. */
const inject = ["tools", "systemPrompt"];
/** Section order: the tool-guidance convention band (100–199). */
const GUIDANCE_ORDER = 150;
/** Unique system-prompt section name (duplicate names throw). */
const GUIDANCE_SECTION = "dsh-ui-progress:report-guidance";
/** The progress-reporting tool name (also the client toolview key). */
const REPORT_TOOL = "report_progress";
/** Host plugin body: register the reporting tool and the guidance section. */
function apply(ctx) {
	if (ctx.tools.get(REPORT_TOOL) === void 0) ctx.tools.register(defineTool({
		name: REPORT_TOOL,
		description: "Report the current progress of a long-running task to the Web UI: the completion percent (0-100), the current stage, an optional note, and — when you can genuinely estimate it — the rough remaining time (eta). Call it repeatedly as a task advances so the UI can animate a progress card. eta accepts a display string like \"约5小时\" or \"~5h\", or seconds as a number (18000 = 5 hours); omit eta when you have no time sense.",
		parameters: {
			task: {
				type: "string",
				required: true,
				description: "Task name; keep it stable across reports of the same task."
			},
			percent: {
				type: "number",
				required: true,
				description: "Completion percent, 0-100."
			},
			stage: {
				type: "string",
				description: "Current stage name."
			},
			note: {
				type: "string",
				description: "Optional short note."
			},
			eta: {
				oneOf: [{ type: "string" }, { type: "number" }],
				description: "Rough remaining time: a display string (\"约5小时\") or seconds (18000). Omit when unknown."
			}
		},
		output: {
			schema: {
				type: "object",
				properties: { ok: { type: "boolean" } },
				additionalProperties: false
			},
			render: (_args, value) => [{
				type: "text",
				text: `progress reported (ok=${value.ok})`
			}]
		},
		execute: () => Promise.resolve({ ok: true }),
		timeoutMs: 5e3
	}));
	ctx.systemPrompt.section({
		name: GUIDANCE_SECTION,
		order: GUIDANCE_ORDER,
		text: "Progress reporting: when you run a long or multi-step task and the report_progress tool is available, call it as you advance — pass a stable task name, the completion percent (0-100), the current stage, and, when you can genuinely estimate it, a rough remaining time (eta: a display string like \"约5小时\" or \"~5h\", or seconds as a number such as 18000). Omit eta when you have no time sense — never invent an estimate."
	});
}
//#endregion
export { apply, inject, name };
