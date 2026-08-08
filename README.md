# @dsh-external/dsh-ui-progress

DSH Web UI 任务进度插件：为 DeepSeek Harness 的 Web GUI 提供两处进度呈现，**零核心改动**（纯 client 插件，不触碰 agent-loop）。

## 版本对应 / Version compatibility

构建产物随 DSH 快照版本更新，安装时按快照选择对应版本：

| 插件版本 | DSH 快照 | 说明 |
| --- | --- | --- |
| `v0.1.0` | `snapshots/20260805T134133Z-ce1fc03f95`（snapshot0805） | 旧构建，按旧安装方式（`~/.dsh/config.yaml` + `pnpm add -w link:`） |
| `v0.2.0` | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 同快照早期构建（无耗时/ETA/失败态/阶段时间线） |
| `v0.3.0` | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 同快照上一构建（卡片耗时/ETA 文案插值缺失） |
| `v0.3.1` | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 同快照上一构建（ETA 为线性外推） |
| `v0.4.0` | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 同快照上一构建（ETA 仅来自模型上报） |
| `v0.5.0` | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 同快照上一构建：自带工具 + 上报引导 |
| `v0.5.1` | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 同快照上一构建：会话完成进度条浅绿色 |
| `v0.6.0`（默认） | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 新构建：已耗时 0.1s 步进（满分钟折叠）+ subagent 待办琥珀提示 |

> git 依赖方式固定 tag：`pnpm add '@dsh-external/dsh-ui-progress@github:dsh-external/dsh-ui-progress#v0.6.0'`（0805 用户用 `#v0.1.0`）。

## 功能

- **常驻会话进度条**（`conversation.input.dock`，输入框停靠区）：读取框架 `useSession` 快照渲染真实执行状态——运行中/空闲、当前在飞的工具名、当前窗口已结算的工具结果数、当前轮次。运行中左侧加载圈**旋转**，进度条 shimmer 扫光 + 品牌色光环脉冲，填充宽度缓动；每个已结算工具结果推进一格（窗口上限 10）。运行中额外显示**实时已耗时**（自当前回合开始，0.1s 步进跳动，满一分钟折叠为 `XmYs` 后按秒递增）与 **ETA 预计剩余时间**（仅当模型在最近的 `report_progress` 上报里给出 `eta` 估计——不做线性外推，模型没报就不显示）；空闲时显示上一回合耗时。**会话完成（跑过至少一轮后空闲）进度条切换为浅绿色**，从未运行过的会话保持中性蓝灰。
- **待办提醒（attention）**：本会话或其后代 subagent 会话存在**等待人处理的交互**（沙箱命令审批 / 选项选择 / 计划审阅）时，进度条切换为**琥珀色警告态**（浅琥珀背景 + 琥珀填充/图标 + 慢速脉冲），文字提示来源与类型——`等待审批` / `需要选择`（本会话）、`子代理等待审批` / `子代理需要选择`（subagent）、`等待审批 · 子代理 2 项待处理`（并存时）。subagent 会话被官方侧边栏隐藏，其 pending 状态从全局会话列表（`origin: 'subagent'` 行的 `pendingInteraction`）读取——这是主 agent 感知子代理等待的主要出口。优先级：pending(琥珀) > running(蓝) > done(绿) > idle(中性)。
- **`report_progress` 工具卡片**（`conversation.chat.toolview`，按工具名注册）：把模型手动上报的进度渲染成紧凑动画卡片——调用进行中左侧加载圈**旋转**，完成后打勾，显示百分比与可选的阶段/备注行；100% 时脉冲成功色光晕。卡片实时显示**耗时**（运行中走动、结算后定格）与 **ETA**（仅来自模型上报的 `eta`，未上报不显示；运行中与已结算的中间阶段卡片都显示，100% 完成与失败卡片隐藏）；工具结果为错误时整卡切换**失败样式**（警告图标 + 错误色）。同一任务名的多次上报按窗口聚合出**阶段时间线**（阶段链，当前阶段高亮）。
- **自带 `report_progress` 工具与上报引导**（宿主 half）：v0.5.0 起插件直接注册 `report_progress` 工具（若其他宿主插件已注册同名工具则自动跳过，共存优先），并向系统提示词注入引导段落（`dsh-ui-progress:report-guidance`，order 150，tool guidance 惯例区间）——长任务执行中逐步调用 `report_progress`，eta 只在模型真正有把握时上报。

### report_progress 工具契约（本插件注册，工具宿主共存时以其为准）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `task` | string（必填） | 任务名（阶段时间线按此聚合） |
| `percent` | number（必填） | 完成百分比 0–100 |
| `stage` | string? | 当前阶段名 |
| `note` | string? | 备注 |
| `eta` | string \| number? | **可选**：大致剩余时间。字符串直接展示（`"约5小时"`、`"~5h"`），数字按**秒**格式化（`18000` → `5h`）。模型不确定时省略该字段——界面不显示 ETA。

## Model Experience

模型可见输入（均随装配进入模型请求，可从会话日志完整重建）：

- **`report_progress` 工具**（宿主 half 注册；其他宿主插件已注册同名工具时自动跳过）：schema 见上文契约表；执行仅返回确认，进度呈现由浏览器 half 完成。工具调用与结果作为普通工具事件落入会话日志。
- **系统提示词段落** `dsh-ui-progress:report-guidance`（order 150）：引导长任务执行中调用 `report_progress`，并按诚实原则上报 `eta`——无时间把握时省略、绝不编造。

不注入任何用户消息内容；会话文本与上下文注入不受影响。

## 安装

见 [INSTALL.md](INSTALL.md)（组织内成员）。

## 配置

无配置键。安装后只需在配置树里插入一行：

```yaml
- insert:
    - id: dsh-ui-progress
      name: '@dsh-external/dsh-ui-progress'
```

## Export shape

浏览器半 `./client`（`apply`/`inject` 命名空间插件）、空 Node half `./index`、标准 invariant companion `./invariant`。

## Known Limitations and Deferred Work

- 进度条填充按窗口分段（每结算一个工具结果进一格，上限 10），不是未知总量的真实百分比；会话整体进度的长视图需要专门的投影。
- ETA 完全依赖模型在 `report_progress` 的 `eta` 字段上报：模型不报或报错（非字符串/非正数）就不显示；进度条取窗口内**最近一次**上报的 eta，若最近一次未带 eta 则隐藏（即使更早的上报带过）。
- 工具卡片严格按 `report_progress` 工具名注册；改名或加命名空间的进度工具需要第二条注册。
- 宿主 half（工具 + 提示词段落）在插件加载时注册：升级安装后需**重启一次 `dsh web`** 生效；浏览器 half 刷新页面即生效。
- 阶段时间线按当前窗口聚合（分页/压缩后旧阶段截断，链从头开始）；同一任务名在窗口内有多个 `report_progress` 调用时才有链。
- CSS 动效常量（时长/缓动）为本地字面量（当前样式体系尚无 motion token 族）。
