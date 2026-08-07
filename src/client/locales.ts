/** `progress` namespace dictionaries. */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'card.title': '任务进度',
  'card.done': '完成',
  'card.error': '失败',
  'card.stage': '阶段',
  'card.note': '备注',
  'card.stages': '阶段链',
  'card.elapsed': '耗时',
  'card.eta': '预计剩余',
  'card.empty': '（无进度数据）',
  'bar.idle': '会话就绪',
  'bar.running': '正在执行',
  'bar.thinking': '正在思考',
  'bar.todos': '已完成 {done}/{total}',
  'bar.turn': '第 {turn} 轮',
  'bar.tools': '{count} 个工具调用',
  'bar.tool': '工具 {name}',
  'bar.waiting': '等待输入',
  'bar.elapsed': '已耗时 {duration}',
  'bar.eta': '预计剩余 {duration}',
  'bar.lastTurn': '上回合 {duration}',
} satisfies Record<string, string>

/** The progress namespace key union. */
export type ProgressKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'card.title': 'Task progress',
  'card.done': 'Done',
  'card.error': 'Failed',
  'card.stage': 'Stage',
  'card.note': 'Note',
  'card.stages': 'Stages',
  'card.elapsed': 'Elapsed',
  'card.eta': 'ETA',
  'card.empty': '(no progress data)',
  'bar.idle': 'Session idle',
  'bar.running': 'Executing',
  'bar.thinking': 'Thinking',
  'bar.todos': 'Done {done}/{total}',
  'bar.turn': 'Turn {turn}',
  'bar.tools': '{count} tool calls',
  'bar.tool': 'Tool {name}',
  'bar.waiting': 'Waiting for input',
  'bar.elapsed': 'Elapsed {duration}',
  'bar.eta': 'ETA {duration}',
  'bar.lastTurn': 'Last turn {duration}',
} satisfies Record<ProgressKey, string>
