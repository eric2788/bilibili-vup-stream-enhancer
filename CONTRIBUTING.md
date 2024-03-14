# 贡献指南

欢迎您对本项目进行贡献！在开始之前，请先阅读以下内容。

## 目录

- [事前准备](#事前准备)
- [贡献流程](#贡献流程)
- [程式码规范](#程式码规范)
    - [提交规范](#提交规范)
- [项目架构](#项目架构)
    - [源代码](#源代码)
    - [测试代码](#测试代码)
    - [快速开始](#快速开始)
    - [关于自动测试](#关于自动测试)
- [问题回报](#问题回报)
- [讨论与支援](#讨论与支援)

## 事前准备

在开始贡献本项目之前，请确保您拥有以下条件：

- 拥有 NodeJS v20+ 运行环境
- 具备开发 TypeScript, React, TailwindCSS 的知识
- 具备开发 ManifestV3 浏览器扩展 的知识
- 初步掌握 [Plasmo](https://www.plasmo.com) 开发框架 的知识
- 初步掌握 [PlayWright](https://playwright.dev) 测试框架 的知识 (如开发新功能)

## 贡献流程

请按照以下步骤进行贡献：

1. Fork 本仓库到你的本地仓库
2. 在你的本地仓库中进行修改
3. 如开发新功能，请自行添加合理且可行的端到端测试
4. 完成后，确保你的代码通过所有端到端测试
5. 提交 Pull Request 到本仓库的 `develop` 分支

## 程式码规范

请遵守以下程式码规范：

- 各个编程语言的官方标准写法
- 本仓库原有的代码及项目架构

> 请放心，我们会在您提交 Pull Request 时进行代码检查，如有任何问题我们会在检查时提出。

### 提交规范

- 本项目在 commit message 上没有限制, 清晰明了即可
- PR分支请确保是基于 `develop` 分支创建，且分支名称应该为 `[类型]/[issue号]-[概要]` 的格式；例如 `feature/123-new-feature`
- 请确保你的每一条 commits 都有意义，如有必要请使用 `git rebase` 合并 commits
- 如果你的 PR 是为了修复某个 issue，请在 PR 描述中写明 `Fixed|Resolved #issue号`，以便自动连结 issue

## 项目架构

本项目的架构如下：
```plaintext
assets/        # 项目资源文件
src/           # 项目源代码
tests/         # 项目测试代码
```

### 源代码

本项目的源代码位于 `src/` 目录下，其架构如下：
```
src/
├── adapters/       # 适配器代码，用于连接或转换不同的数据源以供内容脚本使用。
├── api/            # 不同 API 的接口定义和实现。
├── background/     # 浏览器扩展的后台脚本。
├── components/     # 全局用 React 组件，适用于内容脚本和扩展页面。
├── contents/       # 内容脚本，用于挂钩在网页上运行的脚本。
├── contexts/       # 全局用 React 状态管理。
├── database/       # 数据库相关代码，包括模型定义和数据库迁移操作。
├── features/       # 特性模块，每个特性模块包含一组相关的功能。
├── hooks/          # 全局用的自定义 React Hooks。
├── migrations/     # 设定迁移脚本(从MV2到MV3)。
├── players/        # 直播解析器相关代码。
├── settings/       # 设定库相关代码，包括对设定区块和功能设定区块的定义。
├── tabs/           # 浏览器扩展页面。
├── types/          # 类型定义文件。
├── updaters/       # 更新器代码，用于处理扩展的更新逻辑。(目前仅限 Chrome)
├── utils/          # 实用工具函数。
├── logger.ts       # 日志前缀注入。
├── style.css       # 包含 TailwindCSS 的全局样式。
└── toaster.ts      # 消息提示（Toast）相关代码。
```

### 测试代码

本项目的测试代码位于 `tests/` 目录下，其架构如下：

```
tests/ 
├── features/       # 功能模块的端到端测试代码。 
├── fixtures/       # 测试中需要用到的前置依赖。 
├── helpers/        # 使用类形式包装的测试辅助工具。
├── pages/          # 扩展页面的端到端测试代码。
├── utils/          # 辅助测试的函数和工具。
├── content.spec.ts # 内容脚本的端到端测试代码。
├── options.ts      # fixtures 选项类型定义文件。
└── theme.setup.ts  # 大海报房间测试的前置依赖。
```

### 快速开始

1. 首先，完成安装 `nodejs v20+` 和 `pnpm` 等环境；
2. 克隆本仓库到本地；
3. 运行 `pnpm install` 安装依赖；
4. 最后，运行 `pnpm dev` 开始开发。
5. 有关如何编写贡献代码，请参阅 [入门指南](#入门指南) 。


#### 如要在本地运行端到端测试:
- 请先运行 `pnpm dlx playwright install` 安装 PlayWright 的浏览器引擎
- 完成后，运行 `pnpm build && pnpm test:prepare` 编译并部署测试环境
- 最后，运行 `pnpm test` 运行测试 (或者用 playwright vscode 插件运行测试)
- 每次更新后可以运行 `pnpm test:rebuild` 重新编译并部署测试环境

### 关于自动测试

本项目的自动测试分为两种类型：快速测试和完整测试。

快速测试: 只测试所有刻上了 `@scoped` 标签的测试用例。

完整测试: 从头开始测试所有测试用例，进行前需要先移除所有 `@scoped` 标签。

- 当以下格式的分支被推送时，会触发快速测试：
    - `feature/**`: 新功能分支
    - `hotfix/**`: 修复分支

- 当向 `develop` 分支提交 PR 时，以下条件会触发完整测试:
    - 当用户开启了 PR 时
    - 当用户从草稿状态转为正式状态时
    - 当用户请求检查时

- 必要时，我们会在 PR 检查时手动触发完整测试。

#### 入门指南

请参阅 [`docs/`](/docs/) 下的 `.md` 文件来查看详细的代码编写流程。

目录如下:
```
docs/
├── adapters.md     # 适配器的模块
├── background.md   # 后台脚本的模块
├── database.md     # 数据库的结构定义
├── features.md     # 新增功能模块
├── pages.md        # 新增扩展页面
└── settings.md     # 新增设定区块
```

## 问题回报

如果您在使用本项目时遇到任何问题，请按照以下方式回报：

>(基于问题严重性程度排序)

1. 在 [Discussion](https://github.com/eric2788/bilibili-vup-stream-enhancer/discussions) 发文
2. 在 [Issue](https://github.com/eric2788/bilibili-vup-stream-enhancer/issues) 发文
3. 联络[作者](https://t.me/eric1008818)

## 讨论与支援

如果您有任何疑问或需要支援，请参考以下资源：

- [Typescript 官方文档](https://www.typescriptlang.org/docs/)
- [Plasmo 官方文档](https://www.plasmo.com/docs/)
- [TailwindCSS 官方文档](https://tailwindcss.com/docs)
- [PlayWright 官方文档](https://playwright.dev/docs/intro)
- 或其他相关技术的文档或讨论区

感谢您的贡献！
