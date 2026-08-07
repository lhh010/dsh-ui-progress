window.__ModuleLoader__.load({
	id: "@dsh-external/dsh-ui-progress",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react = require("react");
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
		//#region src/client/args.ts
		/**
		* Parse the call head's args JSON into a record; malformed or non-object
		* input reads as null.
		* @param argsRaw - the raw JSON string from the call block.
		* @returns the parsed record, or null when it is not a JSON object.
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
		/**
		* Clamp a model-reported percent into 0..100; non-numeric input reads as 0.
		* @param value - the raw percent field.
		* @returns the clamped integer percent.
		*/
		function toPercent(value) {
			const n = typeof value === "number" ? value : Number(value);
			if (!Number.isFinite(n)) return 0;
			return Math.max(0, Math.min(100, n));
		}
		/**
		* The task name, or null when absent or empty (the fallback title is not a
		* task identity — timeline correlation uses only real task names).
		* @param args - the parsed args record.
		* @returns the raw task string, or null.
		*/
		function taskOf(args) {
			const task = args?.task;
			return typeof task === "string" && task !== "" ? task : null;
		}
		/**
		* The stage name, or null when absent or empty.
		* @param args - the parsed args record.
		* @returns the raw stage string, or null.
		*/
		function stageOf(args) {
			const stage = args?.stage;
			return typeof stage === "string" && stage !== "" ? stage : null;
		}
		//#endregion
		//#region \0dsh-css:/mnt/e/deepseek-harness/dsh-ui-progress/src/client/ProgressCard.module.css.mjs
		const css$1 = ".qXDXGq_root{flex-direction:column;gap:8px;padding:8px 0;display:flex}.qXDXGq_row{align-items:center;gap:8px;min-height:24px;display:flex}.qXDXGq_leading{width:16px;height:16px;color:var(--dsw-alias-state-business-primary);justify-content:center;align-items:center;display:flex}.qXDXGq_leadingRunning{animation:1s linear infinite qXDXGq_dsh-progress-spin}.qXDXGq_leadingError{color:var(--dsw-alias-state-error-primary)}@keyframes qXDXGq_dsh-progress-spin{to{transform:rotate(360deg)}}.qXDXGq_titleLine{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:14px;font-weight:600;line-height:22px;overflow:hidden}.qXDXGq_status{color:var(--dsw-alias-label-tertiary);flex-shrink:0;font-size:12px;line-height:18px}.qXDXGq_statusDone{color:var(--dsw-alias-state-success-primary)}.qXDXGq_statusError{color:var(--dsw-alias-state-error-primary)}.qXDXGq_inspect{color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:4px;flex-shrink:0;padding:2px 4px;font-size:12px;line-height:18px}.qXDXGq_inspect:hover{background:var(--dsw-alias-interactive-bg-hover)}.qXDXGq_card{flex-direction:column;gap:6px;margin-left:24px;display:flex}.qXDXGq_head{justify-content:space-between;align-items:baseline;gap:8px;display:flex}.qXDXGq_title{color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}.qXDXGq_percent{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;transition:color .2s}.qXDXGq_percentDone{color:var(--dsw-alias-state-success-primary);font-weight:600}.qXDXGq_percentError{color:var(--dsw-alias-state-error-primary)}.qXDXGq_track{background:var(--dsw-alias-bg-layer-2);border-radius:999px;height:8px;position:relative;overflow:hidden}.qXDXGq_fill{background:linear-gradient(90deg, var(--dsw-alias-brand-primary), var(--dsw-alias-state-business-primary));border-radius:999px;transition:width .5s cubic-bezier(.4,0,.2,1);position:absolute;top:0;bottom:0;left:0}.qXDXGq_fillDone{background:var(--dsw-alias-state-success-primary);animation:1.6s ease-in-out infinite qXDXGq_dsh-progress-glow}.qXDXGq_fillError{background:var(--dsw-alias-state-error-primary)}@keyframes qXDXGq_dsh-progress-glow{0%,to{box-shadow:0 0 0 0 color-mix(in srgb, var(--dsw-alias-state-success-primary) 0%, transparent)}50%{box-shadow:0 0 8px 1px color-mix(in srgb, var(--dsw-alias-state-success-primary) 45%, transparent)}}.qXDXGq_shimmer{background:linear-gradient(90deg, transparent, color-mix(in srgb, var(--dsw-alias-bg-base) 55%, transparent), transparent);pointer-events:none;border-radius:999px;width:40%;animation:1.4s ease-in-out infinite qXDXGq_dsh-progress-shimmer;position:absolute;top:0;bottom:0;left:0}@keyframes qXDXGq_dsh-progress-shimmer{0%{transform:translate(-120%)}to{transform:translate(320%)}}.qXDXGq_line{align-items:baseline;gap:8px;font-size:12px;line-height:18px;display:flex}.qXDXGq_lineLabel{color:var(--dsw-alias-label-tertiary);flex-shrink:0}.qXDXGq_lineValue{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-secondary);overflow:hidden}.qXDXGq_timeline{flex-direction:column;gap:2px;display:flex}.qXDXGq_timelineLabel{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.qXDXGq_timelineRow{align-items:center;gap:8px;min-width:0;font-size:12px;line-height:18px;display:flex}.qXDXGq_timelineDot{background:var(--dsw-alias-state-business-tertiary);border-radius:50%;flex:none;width:6px;height:6px}.qXDXGq_timelineDotCurrent{background:var(--dsw-alias-brand-primary)}.qXDXGq_timelineStage{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-secondary);flex:1;overflow:hidden}.qXDXGq_timelinePercent{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-tertiary);flex:none}";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=\"@dsh-external/dsh-ui-progress/ProgressCard.module.css\"]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@dsh-external/dsh-ui-progress";
			tag.dataset.pluginCss = "@dsh-external/dsh-ui-progress/ProgressCard.module.css";
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var ProgressCard_module_css_default = {
			"card": "qXDXGq_card",
			"head": "qXDXGq_head",
			"percentDone": "qXDXGq_percentDone",
			"dsh-progress-shimmer": "qXDXGq_dsh-progress-shimmer",
			"line": "qXDXGq_line",
			"statusDone": "qXDXGq_statusDone",
			"status": "qXDXGq_status",
			"fillError": "qXDXGq_fillError",
			"timelineRow": "qXDXGq_timelineRow",
			"timelineDot": "qXDXGq_timelineDot",
			"dsh-progress-glow": "qXDXGq_dsh-progress-glow",
			"leadingError": "qXDXGq_leadingError",
			"dsh-progress-spin": "qXDXGq_dsh-progress-spin",
			"leading": "qXDXGq_leading",
			"title": "qXDXGq_title",
			"lineLabel": "qXDXGq_lineLabel",
			"timelineLabel": "qXDXGq_timelineLabel",
			"timelineDotCurrent": "qXDXGq_timelineDotCurrent",
			"timelinePercent": "qXDXGq_timelinePercent",
			"row": "qXDXGq_row",
			"statusError": "qXDXGq_statusError",
			"shimmer": "qXDXGq_shimmer",
			"fill": "qXDXGq_fill",
			"lineValue": "qXDXGq_lineValue",
			"percentError": "qXDXGq_percentError",
			"fillDone": "qXDXGq_fillDone",
			"inspect": "qXDXGq_inspect",
			"timeline": "qXDXGq_timeline",
			"timelineStage": "qXDXGq_timelineStage",
			"percent": "qXDXGq_percent",
			"track": "qXDXGq_track",
			"root": "qXDXGq_root",
			"titleLine": "qXDXGq_titleLine",
			"leadingRunning": "qXDXGq_leadingRunning"
		};
		//#endregion
		//#region src/client/stage-timeline.ts
		/**
		* Derive the ordered stage chain for one task from the snapshot slices.
		* Consecutive repeats of the same stage collapse into one row (the run's last
		* percent wins); non-consecutive repeats stay as separate rows.
		* @param nodes - the settled conversation nodes.
		* @param runningCalls - the in-flight tool calls.
		* @param task - the exact task name to correlate on.
		* @returns the ordered chain; empty when no report matches the task.
		*/
		function deriveStageTimeline(nodes, runningCalls, task) {
			const entries = [];
			for (const node of nodes) {
				if (node.kind !== "tool-result" || node.call?.name !== "report_progress") continue;
				const args = parseArgs(node.call.argsRaw);
				if (args === null || taskOf(args) !== task) continue;
				const stage = stageOf(args);
				if (stage === null) continue;
				entries.push({
					stage,
					percent: toPercent(args.percent),
					time: node.callTime ?? node.time
				});
			}
			for (const call of runningCalls) {
				if (call.name !== "report_progress") continue;
				const args = parseArgs(call.argsRaw);
				if (args === null || taskOf(args) !== task) continue;
				const stage = stageOf(args);
				if (stage === null) continue;
				entries.push({
					stage,
					percent: toPercent(args.percent),
					time: call.time
				});
			}
			entries.sort((a, b) => a.time - b.time);
			const chain = [];
			for (const entry of entries) {
				const last = chain[chain.length - 1];
				if (last !== void 0 && last.stage === entry.stage) chain[chain.length - 1] = {
					stage: entry.stage,
					percent: entry.percent,
					time: last.time
				};
				else chain.push(entry);
			}
			return chain;
		}
		//#endregion
		//#region src/client/timing.ts
		/**
		* Shared timing helpers for the progress surfaces: compact duration
		* formatting and a ticking clock for the live elapsed/ETA readouts. The
		* clock is a component-internal behavioral hook — it subscribes to nothing
		* external (no session or framework state), so it stays inside presentation
		* components.
		*/
		/**
		* Compact duration: 45.2s under a minute, 2m42s from there on (same shape as
		* the conversation stats strip).
		* @param ms - duration in milliseconds.
		* @returns display string.
		*/
		function formatElapsed(ms) {
			const s = ms / 1e3;
			if (s < 60) return `${Math.round(s * 10) / 10}s`;
			const whole = Math.round(s);
			return `${Math.floor(whole / 60)}m${whole % 60}s`;
		}
		/**
		* Whole-second ETA: 45s / 2m42s. An estimate, so no sub-second precision.
		* @param ms - remaining-time estimate in milliseconds.
		* @returns display string.
		*/
		function formatEta(ms) {
			const s = Math.max(0, Math.round(ms / 1e3));
			if (s < 60) return `${s}s`;
			return `${Math.floor(s / 60)}m${s % 60}s`;
		}
		/**
		* Ticking clock: Date.now() refreshed once per second while `enabled`, frozen
		* otherwise (callers gate reads on the same flag). The effect ticks once
		* immediately on enable so a resumed readout is not stale for up to a second.
		* @param enabled - whether the clock should tick.
		* @returns the latest epoch-ms timestamp.
		*/
		function useNow(enabled) {
			const [now, setNow] = (0, react.useState)(() => Date.now());
			(0, react.useEffect)(() => {
				if (!enabled) return;
				const tick = () => setNow(Date.now());
				tick();
				const id = setInterval(tick, 1e3);
				return () => clearInterval(id);
			}, [enabled]);
			return now;
		}
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
		*
		* Live chrome on top of the bar: while the call runs the card ticks an
		* elapsed readout and, when a percent is reported, an ETA extrapolated from
		* progress × elapsed; a settled call shows its total wall time. A failed
		* result (isError) switches the whole card to the error state — warning
		* glyph, error-tinted fill and copy. When several in-window calls share the
		* same task name, the card replaces the single stage line with the derived
		* stage timeline (chain of distinct reported stages).
		*/
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
		function ProgressCard({ toolName, block, inspect, t, useSession }) {
			const args = parseArgs(("kind" in block ? block.call?.argsRaw : block.argsRaw) ?? "");
			const running = !("kind" in block);
			const failed = "kind" in block && block.kind === "tool-result" && block.isError;
			const percent = toPercent(args?.percent);
			const done = percent >= 100;
			const stage = typeof args?.stage === "string" && args.stage !== "" ? args.stage : void 0;
			const note = typeof args?.note === "string" && args.note !== "" ? args.note : void 0;
			const task = taskOf(args);
			const now = useNow(running);
			const elapsedMs = running ? Math.max(0, now - block.time) : "kind" in block && block.callTime !== null ? Math.max(0, block.time - block.callTime) : null;
			const etaMs = running && percent > 0 && percent < 100 && elapsedMs !== null ? Math.round(elapsedMs * (100 - percent) / percent) : null;
			const nodes = useSession((s) => s.nodes);
			const runningCalls = useSession((s) => s.runningCalls);
			const timeline = (0, react.useMemo)(() => task !== null ? deriveStageTimeline(nodes, runningCalls, task) : [], [
				nodes,
				runningCalls,
				task
			]);
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
							className: clsx(ProgressCard_module_css_default.percent, done && ProgressCard_module_css_default.percentDone, failed && ProgressCard_module_css_default.percentError),
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
							className: clsx(ProgressCard_module_css_default.fill, running && ProgressCard_module_css_default.fillRunning, done && !failed && ProgressCard_module_css_default.fillDone, failed && ProgressCard_module_css_default.fillError),
							style: { width: `${percent}%` }
						}), running && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: ProgressCard_module_css_default.shimmer })]
					}),
					elapsedMs !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ProgressCard_module_css_default.line,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.lineLabel,
							children: t("card.elapsed")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.lineValue,
							children: formatElapsed(elapsedMs)
						})]
					}),
					running && etaMs !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ProgressCard_module_css_default.line,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.lineLabel,
							children: t("card.eta")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.lineValue,
							children: formatEta(etaMs)
						})]
					}),
					timeline.length >= 2 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ProgressCard_module_css_default.timeline,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.timelineLabel,
							children: t("card.stages")
						}), timeline.map((entry, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: ProgressCard_module_css_default.timelineRow,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: clsx(ProgressCard_module_css_default.timelineDot, index === timeline.length - 1 && ProgressCard_module_css_default.timelineDotCurrent) }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: ProgressCard_module_css_default.timelineStage,
									children: entry.stage
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: ProgressCard_module_css_default.timelinePercent,
									children: [entry.percent, "%"]
								})
							]
						}, `${entry.stage}-${index}`))]
					}) : stage !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
				"data-state": running ? "running" : failed ? "error" : done ? "done" : "idle",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: ProgressCard_module_css_default.row,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: clsx(ProgressCard_module_css_default.leading, running && ProgressCard_module_css_default.leadingRunning, failed && ProgressCard_module_css_default.leadingError),
							children: failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}) : done ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, {}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: ProgressCard_module_css_default.titleLine,
							children: taskLabel(args, t)
						}),
						running && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ProgressCard_module_css_default.status,
							children: t("card.title")
						}),
						failed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: clsx(ProgressCard_module_css_default.status, ProgressCard_module_css_default.statusError),
							children: t("card.error")
						}),
						done && !failed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
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
		//#region \0dsh-css:/mnt/e/deepseek-harness/dsh-ui-progress/src/client/SessionProgressBar.module.css.mjs
		const css = ".oQ02Ea_dock{box-sizing:border-box;width:calc(100% - var(--dsh-composer-side-clearance) - var(--dsh-composer-side-clearance) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset));margin:0 auto}.oQ02Ea_bar{box-sizing:border-box;width:100%;max-width:calc(var(--dsh-composer-card-max-width) - 4 * var(--dsh-composer-dock-inset));border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);border-radius:12px;align-items:center;gap:10px;height:36px;margin:0 auto;padding:4px 5px 4px 12px;display:flex}.oQ02Ea_bar[data-state=running]{border-color:color-mix(in srgb, var(--dsw-alias-state-business-primary) 40%, transparent);animation:2s ease-in-out infinite oQ02Ea_dsh-session-progress-glow}@keyframes oQ02Ea_dsh-session-progress-glow{0%,to{box-shadow:0 0 0 0 color-mix(in srgb, var(--dsw-alias-state-business-primary) 0%, transparent)}50%{box-shadow:0 0 10px 1px color-mix(in srgb, var(--dsw-alias-state-business-primary) 28%, transparent)}}.oQ02Ea_glyph{color:var(--dsw-alias-state-business-primary);flex:none;display:inline-flex}.oQ02Ea_glyphRunning{animation:1s linear infinite oQ02Ea_dsh-session-progress-spin}@keyframes oQ02Ea_dsh-session-progress-spin{to{transform:rotate(360deg)}}.oQ02Ea_label{color:var(--dsw-alias-label-primary);flex:none;font-size:13px;font-weight:500;line-height:24px}.oQ02Ea_track{background:var(--dsw-alias-bg-layer-2);border-radius:999px;flex:1;min-width:60px;height:6px;position:relative;overflow:hidden}.oQ02Ea_fill{background:var(--dsw-alias-state-business-primary);border-radius:999px;transition:width .5s cubic-bezier(.4,0,.2,1);position:absolute;top:0;bottom:0;left:0}.oQ02Ea_fillRunning{background:linear-gradient(90deg, var(--dsw-alias-state-business-primary), var(--dsw-alias-brand-primary))}.oQ02Ea_shimmer{background:linear-gradient(90deg, transparent, color-mix(in srgb, var(--dsw-alias-bg-base) 55%, transparent), transparent);pointer-events:none;border-radius:999px;width:40%;animation:1.4s ease-in-out infinite oQ02Ea_dsh-session-progress-shimmer;position:absolute;top:0;bottom:0;left:0}@keyframes oQ02Ea_dsh-session-progress-shimmer{0%{transform:translate(-120%)}to{transform:translate(320%)}}.oQ02Ea_counter{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-tertiary);white-space:nowrap;flex:none;font-size:12px;line-height:18px}.oQ02Ea_eta{font-variant-numeric:tabular-nums;color:var(--dsw-alias-state-business-primary);white-space:nowrap;flex:none;font-size:12px;font-weight:500;line-height:18px}.oQ02Ea_percent{text-align:right;font-variant-numeric:tabular-nums;min-width:34px;color:var(--dsw-alias-label-secondary);white-space:nowrap;flex:none;font-size:12px;line-height:18px}";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=\"@dsh-external/dsh-ui-progress/SessionProgressBar.module.css\"]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@dsh-external/dsh-ui-progress";
			tag.dataset.pluginCss = "@dsh-external/dsh-ui-progress/SessionProgressBar.module.css";
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var SessionProgressBar_module_css_default = {
			"label": "oQ02Ea_label",
			"glyph": "oQ02Ea_glyph",
			"percent": "oQ02Ea_percent",
			"glyphRunning": "oQ02Ea_glyphRunning",
			"bar": "oQ02Ea_bar",
			"counter": "oQ02Ea_counter",
			"fill": "oQ02Ea_fill",
			"dsh-session-progress-glow": "oQ02Ea_dsh-session-progress-glow",
			"eta": "oQ02Ea_eta",
			"shimmer": "oQ02Ea_shimmer",
			"dsh-session-progress-spin": "oQ02Ea_dsh-session-progress-spin",
			"track": "oQ02Ea_track",
			"fillRunning": "oQ02Ea_fillRunning",
			"dsh-session-progress-shimmer": "oQ02Ea_dsh-session-progress-shimmer",
			"dock": "oQ02Ea_dock"
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
		*
		* While running, the strip also shows a live elapsed readout (since the
		* current turn started) and, when the fill reflects real todo completion, an
		* ETA extrapolated from progress × elapsed — the segment heuristic carries
		* no time meaning, so it never yields an ETA.
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
		/**
		* Start time of the running turn — the in-window turn entry with no end yet.
		* Null when running but no in-window turn start exists.
		*/
		function runningTurnStart(snapshot) {
			let start = null;
			for (const timing of snapshot.turnTimings.values()) if (timing.endTime === void 0) start = timing.startTime;
			return start;
		}
		/**
		* Wall duration of the last settled in-window turn; null when no turn has
		* finished yet. Only read while idle (the running turn has no end entry).
		*/
		function lastTurnDuration(snapshot) {
			let duration = null;
			for (const timing of snapshot.turnTimings.values()) if (timing.endTime !== void 0) duration = Math.max(0, timing.endTime - timing.startTime);
			return duration;
		}
		/** Completed/active/total from a live todos projection; null when unavailable or empty. */
		function todoCounts(todos) {
			if (todos === void 0 || todos === null || todos.length === 0) return null;
			let done = 0;
			let active = 0;
			for (const item of todos) if (item.status === "completed") done += 1;
			else if (item.status === "in_progress") active += 1;
			return {
				done,
				active,
				total: todos.length
			};
		}
		/**
		* The bar's progress value in 0..100. A live `todos` projection wins: the
		* (completed + in-progress)/total ratio is the real task completion — the
		* in-flight task counts toward progress, so five tasks with two done and one
		* in progress reads 60%. Without one, each settled tool result advances the
		* bar by one fixed segment (window cap 10), a visually bounded heuristic for
		* sessions that never write a todo list.
		*/
		function progressPercent(snapshot, todos) {
			const counts = todoCounts(todos);
			if (counts !== null) return Math.round((counts.done + counts.active) / counts.total * 100);
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
				active: counts.active,
				total: counts.total
			});
			return t("bar.idle");
		}
		/**
		* Resident progress strip. Renders nothing until a session snapshot exists
		* (the no-session hero has no dock content), then shows the state text, the
		* animated fill bar with a live percent readout, the turn/tool counters, and
		* — while running — the live elapsed and the todos-based ETA (or the last
		* settled turn's duration when idle).
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
			const turnStart = runningTurnStart(session);
			const now = useNow(running);
			const elapsed = turnStart !== null ? Math.max(0, now - turnStart) : null;
			const eta = running && elapsed !== null && counts !== null && percent > 0 && percent < 100 ? Math.round(elapsed * (100 - percent) / percent) : null;
			const lastTurn = running ? null : lastTurnDuration(session);
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
						running && eta !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: SessionProgressBar_module_css_default.eta,
							children: t("bar.eta", { duration: formatEta(eta) })
						}),
						running && elapsed !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: SessionProgressBar_module_css_default.counter,
							children: t("bar.elapsed", { duration: formatElapsed(elapsed) })
						}),
						!running && lastTurn !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: SessionProgressBar_module_css_default.counter,
							children: t("bar.lastTurn", { duration: formatElapsed(lastTurn) })
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
			"card.error": "失败",
			"card.stage": "阶段",
			"card.note": "备注",
			"card.stages": "阶段链",
			"card.elapsed": "耗时 {duration}",
			"card.eta": "预计剩余 {duration}",
			"card.empty": "（无进度数据）",
			"bar.idle": "会话就绪",
			"bar.running": "正在执行",
			"bar.thinking": "正在思考",
			"bar.todos": "已完成 {done}/{total}",
			"bar.turn": "第 {turn} 轮",
			"bar.tools": "{count} 个工具调用",
			"bar.tool": "工具 {name}",
			"bar.waiting": "等待输入",
			"bar.elapsed": "已耗时 {duration}",
			"bar.eta": "预计剩余 {duration}",
			"bar.lastTurn": "上回合 {duration}"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"card.title": "Task progress",
			"card.done": "Done",
			"card.error": "Failed",
			"card.stage": "Stage",
			"card.note": "Note",
			"card.stages": "Stages",
			"card.elapsed": "Elapsed {duration}",
			"card.eta": "ETA {duration}",
			"card.empty": "(no progress data)",
			"bar.idle": "Session idle",
			"bar.running": "Executing",
			"bar.thinking": "Thinking",
			"bar.todos": "Done {done}/{total}",
			"bar.turn": "Turn {turn}",
			"bar.tools": "{count} tool calls",
			"bar.tool": "Tool {name}",
			"bar.waiting": "Waiting for input",
			"bar.elapsed": "Elapsed {duration}",
			"bar.eta": "ETA {duration}",
			"bar.lastTurn": "Last turn {duration}"
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
