# bilibili vup观众直播增强扩展

![thumgnail](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/assets_v2/main.png)

> 前身为 bilibili-jimaku-filter 同传字幕过滤插件

## ➵ 简介

本浏览器插件透过挂接 WebSocket 为管人观众提供众多功能。 本插件虽然功能众多，但全部主要功能均为可选，你仍可为界面保持简化。

### 功能

> [!NOTE]
> **所有主要功能已全部改为可选**，例如: 你可以启用醒目留言记录而不启用同传字幕过滤, 且每个主要功能都有各自的房间黑/白名单

目前实装功能有:

<details>
<summary>同传字幕记录</summary>

- 自定义字幕过滤 (支援多角色)
- 支援全屏显示
- 离线记录及下载
- 自定义字幕样式及位置
- 自定义弹幕样式及位置
- 弹出同传字幕黑听视窗
- 同传字幕AI总结
- 右键字幕屏蔽发送者
- 同传黑/白名单
- 房间黑/白名单

![](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/assets_v2/jimaku.png)

![](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/jimaku/jimaku-popup-3.png)

![](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/jimaku/jimaku-summarize-1.png)

</details>

<details>
<summary>醒目留言记录</summary>

- 离线记录及下载
- 支援全屏显示
- 没有时间限制
- 房间黑/白名单

![](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/assets_v2/superchat.png)

</details>

<details>
<summary>即时录制/截图</summary>

- 支援热键操作
- 可选手动录制/进入直播间自动录制
- 截取前 X 分钟以避免错过精彩时刻
- 修复资讯损坏的录制文件
- 房间黑/白名单

![](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/assets_v2/record.png)
</details>

<details>
<summary>黑听直播视窗</summary>

- 可多开直播间
- 在部分浏览器支援画中画视窗
- 支持弹幕推送

![](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/content/popup-4.png)

</details>

... 以及其他 bilibili-jimaku-filter 原有的功能

## ➵ 使用方式

1. [下载](#-下载)本扩展。
2. 点击扩展图标进入设定页面，并根据你的偏好进行设定。完成后，按下保存设定。
3. 进入B站任一直播间即可开始使用。

> 本扩展的所有功能基本上可以到设定页面自行探索和试用，便不再加篇章一一赘述。
>
> 不过考虑到有些功能可能比较难以察觉，故写了篇 [使用指南](https://eric2788.github.io/bilibili-vup-stream-enhancer/tutorials) (仅限难以察觉的功能)。

## ➵ 下载

[FireFox (请使用 MV2 版本 v0.12.4)](https://github.com/eric2788/bilibili-vup-stream-enhancer/releases/tag/0.12.4)

[Edge](https://microsoftedge.microsoft.com/addons/detail/ehdhihncinoejihhmhpdoeloadihnfio)

[Chrome](https://chrome.google.com/webstore/detail/nhomlepkjglilcahfcfnggebkaabeiog)

> [!IMPORTANT]
> ### 我们暂不支援 FireFox 进入 v2.0 版本。
> 
> 此乃基于以下原因:
> 
> - FireFox 不需要在 2024 年 6 月前强制进入 mv3 阶段。
> - FireFox 目前对于 mv3 支援依然尚未完善，包括众多的BUG和未知问题。

## 先行版本

安装先行版本需要手动下载及安装，且可能会有未知问题。
如发现问题，欢迎到 issue 进行回报。(连带 `先行版本` 标签)


- [从 Artifacts 下载](https://github.com/eric2788/bilibili-vup-stream-enhancer/actions/workflows/build-test.yml?query=branch%3Adevelop)

- [安装方式](https://jingyan.baidu.com/article/3065b3b6cc6cf6ffcef8a444.html)

## ➵ 贡献

请参阅 [贡献指南](CONTRIBUTING.md)。

## ➵ 其他连结

[NGA帖文](https://ngabbs.com/read.php?tid=24434809)

[问题回报和功能请求帖](https://github.com/eric2788/bilibili-vup-stream-enhancer/issues)
