# 安装（组织内成员）

> **版本选择**：`v0.7.0`（默认）面向 DSH 快照 snapshot0808（`snapshots/20260808T121140Z-7f25d3e98c`）；`v0.6.0` 面向 snapshot0807（`snapshots/20260807T130646Z-e8a0f1a758`）；`v0.1.0` 面向 snapshot0805（`snapshots/20260805T134133Z-ce1fc03f95`），按旧方式安装。版本对应详见 [README.md](README.md#版本对应--version-compatibility)。

前置：**DSH 已构建快照**（`~/.dsh/source/current` 指向含 `lib/` 产物的快照——`cordis` 与各 `@deepseek-ai/dsh-client-*` 的 `link:` 开发依赖从该快照解析）+ `dsh web` 运行中 + **dsh-external 组织读权限**。本插件是**双 half 插件**（宿主 half：`report_progress` 工具 + 系统提示词引导；浏览器 half：进度呈现），安装 = ① 包可被配置树解析 + ② 配置里加一行。

## snapshot0808（v0.7.0）——profile 安装方式

```sh
# 1. 克隆私有仓库（需要组织读权限），构建产物已入库，无需构建
git clone https://github.com/dsh-external/dsh-ui-progress.git
cd dsh-ui-progress && pnpm install

# 2. 装进 web profile（等价于在 $DSH_HOME/profiles/web 下执行 pnpm add）
dsh plugin --profile web add link:/path/to/dsh-ui-progress
#   或固定 tag 的 git 依赖：
#   dsh plugin --profile web add '@dsh-external/dsh-ui-progress@github:dsh-external/dsh-ui-progress#v0.7.0'
```

> snapshot0807 用户固定 `#v0.6.0`（旧 slot 契约 `conversation.chat.toolview`，不适用于 0808）。

> v0.5.0 起宿主 half 注册 `report_progress` 工具与上报引导：升级安装后请**重启一次 `dsh web`** 使宿主 half 生效（浏览器 half 刷新页面即生效）。若你的宿主插件也已注册同名工具，本插件会自动跳过工具注册（提示词引导照常注入）。

配置行（`$DSH_HOME/profiles/web/cordis.patch.yml`，热重载，无需重启）：

```yaml
- insert:
    - id: dsh-ui-progress
      name: '@dsh-external/dsh-ui-progress'
```

## snapshot0805（v0.1.0）——旧安装方式

### 路径一：克隆 + link 装进 harness（推荐）

```sh
# 1. 克隆私有仓库（需要组织读权限），构建产物已入库，无需构建
git clone https://github.com/dsh-external/dsh-ui-progress.git
cd dsh-ui-progress && pnpm install

# 2. 让包装进 harness 依赖链（在 DSH 快照根目录，~/.dsh/source/current 指向的那个）
pnpm add -w link:/path/to/dsh-ui-progress
```

> 若你的 pnpm 因 store 版本不匹配拒绝 `pnpm add -w`，可手动 symlink 代替：
> `mkdir -p node_modules/@dsh-external && ln -s /path/to/dsh-ui-progress node_modules/@dsh-external/dsh-ui-progress`

### 路径二：git 依赖（固定 commit/tag，无隐式 latest）

```sh
# 在 harness 根目录执行；<commit> 为发布 commit（0805 用 tag v0.1.0）
pnpm add '@dsh-external/dsh-ui-progress@github:dsh-external/dsh-ui-progress#v0.1.0'
```

### 配置行（0805 旧机制）

`~/.dsh/config.yaml`（不存在则创建）：

```yaml
- insert:
    - id: dsh-ui-progress
      name: '@dsh-external/dsh-ui-progress'
```

## 重启 `dsh web`

插件集合变更按「重启生效」纪律（0805 旧机制下适用；0806 profile 方式配置行热重载，无需重启）。停掉当前 web（Ctrl+C）后重新启动。

## 验证

会话运行中：输入框上方常驻进度条左侧加载圈旋转；模型调用 `report_progress` 时对话流出现进度卡片（左侧圈同样旋转，100% 时脉冲成功色光晕）。
