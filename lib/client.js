window.__ModuleLoader__.load({
	id: "@dsh-external/dsh-ui-progress",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
		function r(e) {
			var t, f, n = "";
			if ("string" == typeof e || "number" == typeof e) n += e;
			else if ("object" == typeof e) if (Array.isArray(e)) {
				var o = e.length;
				for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
			} else for (f in e) e[f] && (n && (n += " "), n += f);
			return n;
		}
		function clsx() {
			for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
			return n;
		}
		//#endregion
		//#region \0dsh-css:E:\deepseek-harness\dsh-ui-progress\src\client\ProgressCard.module.css.mjs
		const css$1 = ".tcGvRa_root{flex-direction:column;gap:8px;padding:8px 0;display:flex}.tcGvRa_row{align-items:center;gap:8px;min-height:24px;display:flex}.tcGvRa_leading{width:16px;height:16px;color:var(--dsw-alias-state-business-primary);justify-content:center;align-items:center;display:flex}.tcGvRa_leadingRunning{animation:1s linear infinite tcGvRa_dsh-progress-spin}@keyframes tcGvRa_dsh-progress-spin{to{transform:rotate(360deg)}}.tcGvRa_titleLine{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:14px;font-weight:600;line-height:22px;overflow:hidden}.tcGvRa_status{color:var(--dsw-alias-label-tertiary);flex-shrink:0;font-size:12px;line-height:18px}.tcGvRa_statusDone{color:var(--dsw-alias-state-success-primary)}.tcGvRa_inspect{color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:4px;flex-shrink:0;padding:2px 4px;font-size:12px;line-height:18px}.tcGvRa_inspect:hover{background:var(--dsw-alias-interactive-bg-hover)}.tcGvRa_card{flex-direction:column;gap:6px;margin-left:24px;display:flex}.tcGvRa_head{justify-content:space-between;align-items:baseline;gap:8px;display:flex}.tcGvRa_title{color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}.tcGvRa_percent{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;transition:color .2s}.tcGvRa_percentDone{color:var(--dsw-alias-state-success-primary);font-weight:600}.tcGvRa_track{background:var(--dsw-alias-bg-layer-2);border-radius:999px;height:8px;position:relative;overflow:hidden}.tcGvRa_fill{background:linear-gradient(90deg, var(--dsw-alias-brand-primary), var(--dsw-alias-state-business-primary));border-radius:999px;transition:width .5s cubic-bezier(.4,0,.2,1);position:absolute;top:0;bottom:0;left:0}.tcGvRa_fillDone{background:var(--dsw-alias-state-success-primary);animation:1.6s ease-in-out infinite tcGvRa_dsh-progress-glow}@keyframes tcGvRa_dsh-progress-glow{0%,to{box-shadow:0 0 0 0 color-mix(in srgb, var(--dsw-alias-state-success-primary) 0%, transparent)}50%{box-shadow:0 0 8px 1px color-mix(in srgb, var(--dsw-alias-state-success-primary) 45%, transparent)}}.tcGvRa_shimmer{background:linear-gradient(90deg, transparent, color-mix(in srgb, var(--dsw-alias-bg-base) 55%, transparent), transparent);pointer-events:none;border-radius:999px;width:40%;animation:1.4s ease-in-out infinite tcGvRa_dsh-progress-shimmer;position:absolute;top:0;bottom:0;left:0}@keyframes tcGvRa_dsh-progress-shimmer{0%{transform:translate(-120%)}to{transform:translate(320%)}}.tcGvRa_line{align-items:baseline;gap:8px;font-size:12px;line-height:18px;display:flex}.tcGvRa_lineLabel{color:var(--dsw-alias-label-tertiary);flex-shrink:0}.tcGvRa_lineValue{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-secondary);overflow:hidden}";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=\"@dsh-external/dsh-ui-progress/ProgressCard.module.css\"]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@dsh-external/dsh-ui-progress";
			tag.dataset.pluginCss = "@dsh-external/dsh-ui-progress/ProgressCard.module.css";
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var ProgressCard_module_css_default = {
			"card": "tcGvRa_card",
			"dsh-progress-glow": "tcGvRa_dsh-progress-glow",
			"inspect": "tcGvRa_inspect",
			"fill": "tcGvRa_fill",
			"track": "tcGvRa_track",
			"leading": "tcGvRa_leading",
			"fillDone": "tcGvRa_fillDone",
			"titleLine": "tcGvRa_titleLine",
			"row": "tcGvRa_row",
			"head": "tcGvRa_head",
			"title": "tcGvRa_title",
			"statusDone": "tcGvRa_statusDone",
			"percentDone": "tcGvRa_percentDone",
			"dsh-progress-spin": "tcGvRa_dsh-progress-spin",
			"shimmer": "tcGvRa_shimmer",
			"leadingRunning": "tcGvRa_leadingRunning",
			"root": "tcGvRa_root",
			"dsh-progress-shimmer": "tcGvRa_dsh-progress-shimmer",
			"line": "tcGvRa_line",
			"lineLabel": "tcGvRa_lineLabel",
			"lineValue": "tcGvRa_lineValue",
			"percent": "tcGvRa_percent",
			"status": "tcGvRa_status"
		};
		//#endregion
		//#region src/client/ProgressCard.tsx
		/**
		* ProgressCard: the animated toolview for the `report_progress` tool.
		*
		* Parses the tool's args (task/percent/stage/note) from the call block and
		* renders a compact progress card: a spinning leading glyph while the call
		* runs, a shimmer-animated fill bar whose width eases to the reported
		* percent, a pulsing glow on completion, and the stage/note lines. The
		* running state (call seen, result not yet) plays the sweep animation; the
		* settled state freezes the final bar.
		*/
		function parseArgs(argsRaw) {
			try {
				const parsed = JSON.parse(argsRaw);
				if (typeof parsed !== "object" || parsed === null) return null;
				return parsed;
			} catch {
				return null;
			}
		}
		/** Clamp a model-reported percent into 0..100; non-numeric input reads as 0. */
		function toPercent(value) {
			const n = typeof value === "number" ? value : Number(value);
			if (!Number.isFinite(n)) return 0;
			return Math.max(0, Math.min(100, n));
		}
		/** Format the bar's leading label: task name, or a localized fallback. */
		function taskLabel(args, t) {
			const task = args?.task;
			return typeof task === "string" && task !== "" ? task : t("card.title");
		}
		/**
		* The animated progress row. The args come from the call head (stable while
		* running and settled alike); the running/settled distinction only switches
		* the sweep animation on/off.
		*/
		function ProgressCard({ toolName, block, inspect, t }) {
			const args = parseArgs(("kind" in block ? block.call?.argsRaw : block.argsRaw) ?? "");
			const running = !("kind" in block);
			const percent = toPercent(args?.percent);
			const done = percent >= 100;
			const stage = typeof args?.stage === "string" && args.stage !== "" ? args.stage : void 0;
			const note = typeof args?.note === "string" && args.note !== "" ? args.note : void 0;
			let body = null;
			if (args !== null) body = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: ProgressCard_module_css_default.card,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ProgressCard_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.title,
							children: taskLabel(args, t)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: clsx(ProgressCard_module_css_default.percent, done && ProgressCard_module_css_default.percentDone),
							children: [percent, "%"]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ProgressCard_module_css_default.track,
						role: "progressbar",
						"aria-valuenow": percent,
						"aria-valuemin": 0,
						"aria-valuemax": 100,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: clsx(ProgressCard_module_css_default.fill, running && ProgressCard_module_css_default.fillRunning, done && ProgressCard_module_css_default.fillDone),
							style: { width: `${percent}%` }
						}), running && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: ProgressCard_module_css_default.shimmer })]
					}),
					stage !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ProgressCard_module_css_default.line,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.lineLabel,
							children: t("card.stage")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.lineValue,
							children: stage
						})]
					}),
					note !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ProgressCard_module_css_default.line,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.lineLabel,
							children: t("card.note")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.lineValue,
							children: note
						})]
					})
				]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: ProgressCard_module_css_default.root,
				"data-tool": toolName,
				"data-state": running ? "running" : done ? "done" : "idle",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: ProgressCard_module_css_default.row,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: clsx(ProgressCard_module_css_default.leading, running && ProgressCard_module_css_default.leadingRunning),
							children: done ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, {}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: ProgressCard_module_css_default.titleLine,
							children: taskLabel(args, t)
						}),
						running && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.status,
							children: t("card.title")
						}),
						done && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: clsx(ProgressCard_module_css_default.status, ProgressCard_module_css_default.statusDone),
							children: t("card.done")
						}),
						inspect !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: ProgressCard_module_css_default.inspect,
							onClick: inspect,
							"aria-label": "Inspect",
							children: "↗"
						})
					]
				}), body]
			});
		}
		//#endregion
		//#region \0dsh-css:E:\deepseek-harness\dsh-ui-progress\src\client\SessionProgressBar.module.css.mjs
		const css = ".Jn-3TW_dock{box-sizing:border-box;width:calc(100% - var(--dsh-composer-side-clearance) - var(--dsh-composer-side-clearance) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset));margin:0 auto}.Jn-3TW_bar{box-sizing:border-box;width:100%;max-width:calc(var(--dsh-composer-card-max-width) - 4 * var(--dsh-composer-dock-inset));border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);border-radius:12px;align-items:center;gap:10px;height:36px;margin:0 auto;padding:4px 5px 4px 12px;display:flex}.Jn-3TW_bar[data-state=running]{border-color:color-mix(in srgb, var(--dsw-alias-state-business-primary) 40%, transparent);animation:2s ease-in-out infinite Jn-3TW_dsh-session-progress-glow}@keyframes Jn-3TW_dsh-session-progress-glow{0%,to{box-shadow:0 0 0 0 color-mix(in srgb, var(--dsw-alias-state-business-primary) 0%, transparent)}50%{box-shadow:0 0 10px 1px color-mix(in srgb, var(--dsw-alias-state-business-primary) 28%, transparent)}}.Jn-3TW_glyph{color:var(--dsw-alias-state-business-primary);flex:none;display:inline-flex}.Jn-3TW_glyphRunning{animation:1s linear infinite Jn-3TW_dsh-session-progress-spin}@keyframes Jn-3TW_dsh-session-progress-spin{to{transform:rotate(360deg)}}.Jn-3TW_label{color:var(--dsw-alias-label-primary);flex:none;font-size:13px;font-weight:500;line-height:24px}.Jn-3TW_track{background:var(--dsw-alias-bg-layer-2);border-radius:999px;flex:1;min-width:60px;height:6px;position:relative;overflow:hidden}.Jn-3TW_fill{background:var(--dsw-alias-state-business-primary);border-radius:999px;transition:width .5s cubic-bezier(.4,0,.2,1);position:absolute;top:0;bottom:0;left:0}.Jn-3TW_fillRunning{background:linear-gradient(90deg, var(--dsw-alias-state-business-primary), var(--dsw-alias-brand-primary))}.Jn-3TW_shimmer{background:linear-gradient(90deg, transparent, color-mix(in srgb, var(--dsw-alias-bg-base) 55%, transparent), transparent);pointer-events:none;border-radius:999px;width:40%;animation:1.4s ease-in-out infinite Jn-3TW_dsh-session-progress-shimmer;position:absolute;top:0;bottom:0;left:0}@keyframes Jn-3TW_dsh-session-progress-shimmer{0%{transform:translate(-120%)}to{transform:translate(320%)}}.Jn-3TW_counter{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-tertiary);white-space:nowrap;flex:none;font-size:12px;line-height:18px}.Jn-3TW_percent{text-align:right;font-variant-numeric:tabular-nums;min-width:34px;color:var(--dsw-alias-label-secondary);white-space:nowrap;flex:none;font-size:12px;line-height:18px}";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=\"@dsh-external/dsh-ui-progress/SessionProgressBar.module.css\"]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@dsh-external/dsh-ui-progress";
			tag.dataset.pluginCss = "@dsh-external/dsh-ui-progress/SessionProgressBar.module.css";
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var SessionProgressBar_module_css_default = {
			"shimmer": "Jn-3TW_shimmer",
			"dsh-session-progress-shimmer": "Jn-3TW_dsh-session-progress-shimmer",
			"dsh-session-progress-spin": "Jn-3TW_dsh-session-progress-spin",
			"glyph": "Jn-3TW_glyph",
			"label": "Jn-3TW_label",
			"track": "Jn-3TW_track",
			"counter": "Jn-3TW_counter",
			"glyphRunning": "Jn-3TW_glyphRunning",
			"fill": "Jn-3TW_fill",
			"bar": "Jn-3TW_bar",
			"dock": "Jn-3TW_dock",
			"fillRunning": "Jn-3TW_fillRunning",
			"percent": "Jn-3TW_percent",
			"dsh-session-progress-glow": "Jn-3TW_dsh-session-progress-glow"
		};
		//#endregion
		//#region src/client/SessionProgressBar.tsx
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
		/**
		* Count settled tool results in the current snapshot window. The node stream
		* is the presentation-truth source: a result node exists exactly when a tool
		* call completed (and re-renders live as the window advances).
		*/
		function settledToolCount(snapshot) {
			let count = 0;
			for (const node of snapshot.nodes) if (node.kind === "tool-result") count += 1;
			return count;
		}
		/**
		* True while the model is emitting reasoning: the in-flight partial carries a
		* reasoning block and no tool call is in flight (a running tool is the more
		* specific state and wins the label).
		*/
		function isReasoning(snapshot) {
			return snapshot.partial?.blocks.some((block) => block.kind === "reasoning") ?? false;
		}
		/** The in-flight tool name when running; undefined when nothing is executing. */
		function runningTool(snapshot) {
			return snapshot.runningCalls[0]?.name;
		}
		/** Completed/total from a live todos projection; null when unavailable or empty. */
		function todoCounts(todos) {
			if (todos === void 0 || todos === null || todos.length === 0) return null;
			let done = 0;
			for (const item of todos) if (item.status === "completed") done += 1;
			return {
				done,
				total: todos.length
			};
		}
		/**
		* The bar's progress value in 0..100. A live `todos` projection wins: the
		* completed/total ratio is the real task completion (five tasks, two done →
		* 40%). Without one, each settled tool result advances the bar by one fixed
		* segment (window cap 10), a visually bounded heuristic for sessions that
		* never write a todo list.
		*/
		function progressPercent(snapshot, todos) {
			const counts = todoCounts(todos);
			if (counts !== null) return Math.round(counts.done / counts.total * 100);
			return Math.min(100, settledToolCount(snapshot) * 10);
		}
		/** Human label for the current state; null means the dock row renders no text. */
		function stateLabel(snapshot, runningToolName, thinking, counts, t) {
			if (snapshot.running) {
				if (runningToolName !== void 0) return t("bar.tool", { name: runningToolName });
				if (thinking) return t("bar.thinking");
				return t("bar.running");
			}
			if (counts !== null) return t("bar.todos", {
				done: counts.done,
				total: counts.total
			});
			return t("bar.idle");
		}
		/**
		* Resident progress strip. Renders nothing until a session snapshot exists
		* (the no-session hero has no dock content), then shows the state text, the
		* animated fill bar with a live percent readout, and the turn/tool counters.
		*/
		function SessionProgressBar({ session, t, useProjection }) {
			if (session === void 0 || session === null) return null;
			const todos = useProjection("todos");
			const toolName = runningTool(session);
			const running = session.running;
			const thinking = running && toolName === void 0 && isReasoning(session);
			const counts = todoCounts(todos);
			const percent = progressPercent(session, todos);
			const turn = session.turnTimings.size;
			const settled = settledToolCount(session);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: SessionProgressBar_module_css_default.dock,
				"data-progress-bar": true,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: SessionProgressBar_module_css_default.bar,
					"data-state": running ? "running" : "idle",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: clsx(SessionProgressBar_module_css_default.glyph, running && SessionProgressBar_module_css_default.glyphRunning),
							children: running ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkle16, { size: 14 })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: SessionProgressBar_module_css_default.label,
							children: stateLabel(session, toolName, thinking, counts, t)
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: SessionProgressBar_module_css_default.track,
							role: "progressbar",
							"aria-valuenow": percent,
							"aria-valuemin": 0,
							"aria-valuemax": 100,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: clsx(SessionProgressBar_module_css_default.fill, running && SessionProgressBar_module_css_default.fillRunning),
								style: { width: `${percent}%` }
							}), running && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: SessionProgressBar_module_css_default.shimmer })]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: SessionProgressBar_module_css_default.percent,
							children: [percent, "%"]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: SessionProgressBar_module_css_default.counter,
							children: t("bar.turn", { turn })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: SessionProgressBar_module_css_default.counter,
							children: t("bar.tools", { count: settled })
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/** `progress` namespace dictionaries. */
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"card.title": "任务进度",
			"card.done": "完成",
			"card.stage": "阶段",
			"card.note": "备注",
			"card.empty": "（无进度数据）",
			"bar.idle": "会话就绪",
			"bar.running": "正在执行",
			"bar.thinking": "正在思考",
			"bar.todos": "已完成 {done}/{total}",
			"bar.turn": "第 {turn} 轮",
			"bar.tools": "{count} 个工具调用",
			"bar.tool": "工具 {name}",
			"bar.waiting": "等待输入"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"card.title": "Task progress",
			"card.done": "Done",
			"card.stage": "Stage",
			"card.note": "Note",
			"card.empty": "(no progress data)",
			"bar.idle": "Session idle",
			"bar.running": "Executing",
			"bar.thinking": "Thinking",
			"bar.todos": "Done {done}/{total}",
			"bar.turn": "Turn {turn}",
			"bar.tools": "{count} tool calls",
			"bar.tool": "Tool {name}",
			"bar.waiting": "Waiting for input"
		};
		//#endregion
		//#region src/client/index.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "progress";
		/**
		* Required services (cordis fiber inject). 'conversation' is an ordering
		* edge, not a call dependency: both 'conversation.input.dock' and
		* 'conversation.chat.toolview' are declared by ui-conversation's apply, and
		* register() into an undeclared slot throws — service waiting orders this
		* apply after the declaring one.
		*/
		const inject = [
			"slots",
			"conversation",
			"locale"
		];
		/**
		* Client plugin body: register the `progress` dictionaries, the resident
		* session-progress strip into the input dock, and the animated progress card
		* into the keyed toolview hole under the `report_progress` tool name.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-progress: dictionaries");
			ctx.inject([
				"slots",
				"conversation",
				"sessions"
			], (scope) => {
				scope.effect(() => scope.slots.register({
					name: "conversation.input.dock",
					id: "progress",
					order: 20,
					locale: NS
				}, SessionProgressBar), "ui-progress: session progress strip");
			});
			ctx.effect(() => ctx.slots.register({
				name: "conversation.chat.toolview",
				key: "report_progress",
				locale: NS
			}, ProgressCard), "ui-progress: toolview registration");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
