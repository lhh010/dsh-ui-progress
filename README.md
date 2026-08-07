# @dsh-external/dsh-ui-progress

DSH Web UI 任务进度插件：为 DeepSeek Harness 的 Web GUI 提供两处进度呈现，**零核心改动**（纯 client 插件，不触碰 agent-loop）。

## 版本对应 / Version compatibility

构建产物随 DSH 快照版本更新，安装时按快照选择对应版本：

| 插件版本 | DSH 快照 | 说明 |
| --- | --- | --- |
| `v0.1.0` | `snapshots/20260805T134133Z-ce1fc03f95`（snapshot0805） | 旧构建，按旧安装方式（`~/.dsh/config.yaml` + `pnpm add -w link:`） |
| `v0.2.0`（默认） | `snapshots/20260806T160212Z-279244acb0`（snapshot0806） | 新构建，按新安装方式（`dsh plugin --profile web add` + profile `cordis.patch.yml`） |

> git 依赖方式固定 tag：`pnpm add '@dsh-external/dsh-ui-progress@github:dsh-external/dsh-ui-progress#v0.2.0'`（0805 用户用 `#v0.1.0`）。

## 功能

- **常驻会话进度条**（`conversation.input.dock`，输入框停靠区）：读取框架 `useSession` 快照渲染真实执行状态——运行中/空闲、当前在飞的工具名、当前窗口已结算的工具结果数、当前轮次。运行中左侧加载圈**旋转**，进度条 shimmer 扫光 + 品牌色光环脉冲，填充宽度缓动。每个已结算工具结果推进一格（窗口上限 10）。
- **`report_progress` 工具卡片**（`conversation.chat.toolview`，按工具名注册）：把模型手动上报的进度渲染成紧凑动画卡片——调用进行中左侧加载圈**旋转**，完成后打勾，显示百分比与可选的阶段/备注行；100% 时脉冲成功色光晕。

`report_progress` 工具本体是独立的宿主插件（如挂载的 demo 或常驻工具插件）；本插件只负责**呈现**。

## Model Experience

无——纯浏览器端 UI 呈现：不向模型请求注入任何内容，工具 schema 与文案均不改动。

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
- 工具卡片严格按 `report_progress` 工具名注册；改名或加命名空间的进度工具需要第二条注册。
- CSS 动效常量（时长/缓动）为本地字面量（当前样式体系尚无 motion token 族）。
