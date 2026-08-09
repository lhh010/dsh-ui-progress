# @dsh-external/dsh-ui-progress

DSH Web UI 会话进度插件：为 DeepSeek Harness 的 Web GUI 的输入框停靠区提供常驻会话进度条，**零核心改动**（纯 client 插件，不触碰 agent-loop）。

## 版本对应 / Version compatibility

构建产物随 DSH 快照版本更新，安装时按快照选择对应版本：

| 插件版本 | DSH 快照 | 说明 |
| --- | --- | --- |
| `v0.1.0` | `snapshots/20260805T134133Z-ce1fc03f95`（snapshot0805） | 旧构建，按旧安装方式（`~/.dsh/config.yaml` + `pnpm add -w link:`） |
| `v0.2.0` | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 同快照早期构建（无耗时/ETA/失败态/阶段时间线） |
| `v0.3.0` | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 同快照上一构建（卡片耗时/ETA 文案插值缺失） |
| `v0.3.1` | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 同快照上一构建（ETA 为线性外推） |
| `v0.4.0` | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 同快照上一构建（ETA 仅来自模型上报） |
| `v0.5.0` | `snapshots/20260807T130646Z-e8a0f1a758`（snapshot0807） | 同快照上一构建：自带工具 + 上报引导 |
| `v0.5.1` | `snapshots/20260807T130646Z-e8a0f1a758`（snapshot0807） | 同快照上一构建：会话完成进度条浅绿色 |
| `v0.6.0` | `snapshots/20260807T130646Z-e8a0f1a758`（snapshot0807） | 新构建：已耗时 0.1s 步进（满分钟折叠）+ subagent 待办琥珀提示 |
| `v0.7.0` | `snapshots/20260808T121140Z-7f25d3e98c`（snapshot0808） | 新构建：适配 0808 的 slot 迁移（`conversation.chat.toolview` → `tool.call.toolview`，注册经 `slots.inject` 等待声明） |
| `v0.8.0`（默认） | `snapshots/20260808T121140Z-7f25d3e98c`（snapshot0808） | 新构建：移除自带 `report_progress` 工具与上报引导（宿主 half 置空）、移除工具卡片；填充改为 todos 真实比例（无 todos 默认 100%）；新增中断橘红态（手动打断/API 错误等意外停止） |

> git 依赖方式固定 tag：`pnpm add '@dsh-external/dsh-ui-progress@github:dsh-external/dsh-ui-progress#v0.8.0'`（0807 用户用 `#v0.6.0`，0805 用户用 `#v0.1.0`）。

## 功能

- **常驻会话进度条**（`conversation.input.dock`，输入框停靠区）：读取框架 `useSession` 快照渲染真实执行状态——运行中/空闲、当前在飞的工具名、当前窗口已结算的工具结果数、当前轮次。运行中左侧加载圈**旋转**，进度条 shimmer 扫光 + 品牌色光环脉冲，填充宽度缓动。**填充宽度**：有 `todos` 投影时按真实完成比例（(已完成+进行中)/总数，进行中任务计入进度）；无 todos 时固定默认 **100%**——会话整体进度没有专门投影，不展示伪百分比（v0.8.0 起移除旧的"每个已结算工具结果进一格、窗口上限 10"分段填充）。运行中额外显示**实时已耗时**（自当前回合开始，0.1s 步进跳动，满一分钟折叠为 `XmYs` 后按秒递增）与 **ETA 预计剩余时间**（仅当模型在最近的 `report_progress` 上报里给出 `eta` 估计——不做线性外推，模型没报就不显示）；空闲时显示上一回合耗时。**会话完成（跑过至少一轮后空闲）进度条切换为浅绿色**，从未运行过的会话保持中性蓝灰。
- **中断橘红态**（v0.8.0 新增）：本会话**最近一个已结束回合被中断/停止**——手动打断、API 故障或其他意外原因——进度条切换为**橘红色**（浅橘背景 + 橘红填充/图标/百分比 + 慢速脉冲），标签显示"已中断"，优先于运行中/完成态的常规配色。只按**最近一个**回合判定：中断后继续发送并正常完成的新回合会让进度条恢复正常配色（中断遗留标记仍保留在窗口内但不再触发）。注意态（琥珀，见下）仍优先于中断态。
- **待办提醒（attention）**：本会话或其后代 subagent 会话存在**等待人处理的交互**（沙箱命令审批 / 选项选择 / 计划审阅）时，进度条切换为**琥珀色警告态**（浅琥珀背景 + 琥珀填充/图标 + 慢速脉冲），文字提示来源与类型——`等待审批` / `需要选择`（本会话）、`子代理等待审批` / `子代理需要选择`（subagent）、`等待审批 · 子代理 2 项待处理`（并存时）。subagent 会话被官方侧边栏隐藏，其 pending 状态从全局会话列表（`origin: 'subagent'` 行的 `pendingInteraction`）读取——这是主 agent 感知子代理等待的主要出口。优先级：pending(琥珀) > running(蓝) > interrupted(橘红) > done(绿) > idle(中性)。

## Model Experience

v0.8.0 起本插件**不再注入任何模型可见输入**：`report_progress` 工具与上报引导段落已移除（宿主 half 为空），插件只做浏览器端呈现。若其他宿主插件注册 `report_progress` 工具，会话进度条的 ETA 行仍会读取其上报的 `eta` 字段（见上文）。

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

- 会话整体进度无专门投影：无 todos 时填充固定 100%，不展示伪百分比；todos 比例只反映当前 todos 列表，不代表会话全程进度。
- 中断检测按当前窗口 + 最新回合判定：中断回合**既无 partial 内容又无在飞工具调用**时不留痕迹，无法检出；分页/压缩后旧标记被截断，中断态随之消退。处于重试路径（model-retry）的回合不显示中断态。
- ETA 完全依赖模型在 `report_progress` 的 `eta` 字段上报：模型不报或报错（非字符串/非正数）就不显示；进度条取窗口内**最近一次**上报的 eta，若最近一次未带 eta 则隐藏（即使更早的上报带过）。
- 浏览器 half 刷新页面即生效（宿主 half 为空，升级安装无需重启 `dsh web`）。
- CSS 动效常量（时长/缓动）为本地字面量（当前样式体系尚无 motion token 族）；中断橘红色为 warn/error token 的 `color-mix`（样式体系无独立橘色 token）。
