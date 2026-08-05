/** `progress` namespace dictionaries. */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'card.title': '任务进度',
  'card.done': '完成',
  'card.stage': '阶段',
  'card.note': '备注',
  'card.empty': '（无进度数据）',
  'bar.idle': '会话就绪',
  'bar.running': '正在执行',
  'bar.thinking': '正在思考',
  'bar.todos': '已完成 {done}/{total}',
  'bar.turn': '第 {turn} 轮',
  'bar.tools': '{count} 个工具调用',
  'bar.tool': '工具 {name}',
  'bar.waiting': '等待输入',
} satisfies Record<string, string>

/** The progress namespace key union. */
export type ProgressKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'card.title': 'Task progress',
  'card.done': 'Done',
  'card.stage': 'Stage',
  'card.note': 'Note',
  'card.empty': '(no progress data)',
  'bar.idle': 'Session idle',
  'bar.running': 'Executing',
  'bar.thinking': 'Thinking',
  'bar.todos': 'Done {done}/{total}',
  'bar.turn': 'Turn {turn}',
  'bar.tools': '{count} tool calls',
  'bar.tool': 'Tool {name}',
  'bar.waiting': 'Waiting for input',
} satisfies Record<ProgressKey, string>
