

# 使用指南

以下的指南内容只针对一些使用者比较难以察觉的功能进行介绍，一些明面上的功能不会在这里介绍。

## 目录

- [通用](#通用)
  - [弹出直播视窗](#1-弹出直播视窗)
  - [画中画视窗的支援](#2-画中画视窗的支援)
- [同传字幕过滤](#同传字幕过滤)
    - [右键菜单来屏蔽同传字幕发送者](#1-右键菜单来屏蔽同传字幕发送者)
    - [同传弹幕彈出式视窗](#2-同传弹幕彈出式视窗)
- [醒目留言](#醒目留言)
    - [醒目留言按钮可以被拖拽](#1-醒目留言按钮可以被拖拽)
- [快速切片](#快速切片)
    - [可改为手动录制](#1-可改为手动录制)
    - [透过热键进行切片和截图操作](#2-透过热键进行切片和截图操作)
    - [可选择完整编译](#3-可选择完整编译)

## 通用

### 1. 彈出直播视窗

在直播间内，透过展开功能菜单，可以看到`弹出直播视窗`的选项，点击后会弹出一个新的窗口，这个窗口可以随意调整大小，方便多任务操作。

![popup-2](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/content/popup-2.png)

打开后的效果如下：

![popup-3](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/content/popup-3.png)

此选项默认是关闭的，你需要在设置中打开该选项。

![popup-1](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/content/popup-1.png)

另外，你也可以多开多个直播视窗，方便同时观看多个直播间。

![popup-4](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/content/popup-4.png)

同时他们也支援显示字幕和弹幕!

![popup-5](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/content/popup-5.png)

### 2. 画中画视窗的支援

透过启用画中画视窗功能，将使窗口永远置顶，方便你在其他窗口上操作，同时也可以随意调整大小。

![pip-1](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/content/pip-1.png)

启用后，连带按住 `ctrl` 键点击彈出视窗按钮即可生效：

![pip-2](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/content/pip-2.png)

> **注意**: 画中画直播视窗目前依然处于实验阶段，且只支援部分的浏览器。[(详细参考)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Picture-in-Picture_API)


## 同传字幕过滤

### 1. 右键菜单来屏蔽同传字幕发送者

在同传字幕上按下右键，可以看到`屏蔽选中同传发送者`的选项，点击后会彈出是否屏蔽该发送者的同传字幕的确认弹窗。

![context-menu-1](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/jimaku/context-menu-1.png)

点击`确定`后，该发送者的同传字幕将不再显示。

![context-menu-2](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/jimaku/context-menu-2.png)

日后若果想要解除屏蔽，可以在设置中找到 `同传黑名单`，进行解除。

![context-menu-3](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/jimaku/context-menu-3.png)

### 2. 同传弹幕彈出式视窗

> 此功能同样支援画中画视窗!

跟直播视窗一样，同传字幕也可以弹出一个新的窗口，这个窗口可以随意调整大小，方便多任务操作。

![jimaku-popup-2](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/jimaku/jimaku-popup-2.png)

打开后的效果如下：

![jimaku-popup-3](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/jimaku/jimaku-popup-3.png)

同样地，此选项默认是关闭的，你需要在设置中打开该选项。

![jimaku-popup-1](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/jimaku/jimaku-popup-1.png)


## 醒目留言

### 1. 醒目留言按钮可以被拖拽

在醒目留言按钮上，对锚点按钮按住左键，可以拖拽到任意位置，方便你在直播间内随意调整位置。

![drag-1](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/superchat/drag-1.png)

拖拽效果如下:

![drag-2](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/superchat/drag-2.gif)

## 快速切片

### 1. 可改为手动录制

目前启用快速切片功能后，默认会**进入直播间后立刻开始录制**，然后在按下按钮后截取 **前5分钟** 的视频下载。

你可以在设置中将其改为手动录制，以手动控制录制的开始和结束时间。

![duration-1](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/recorder/duration-1.png)

设置后，你需要在直播间内按下按钮后，再按下按钮结束录制。

![duration-2](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/recorder/duration-2.png)

### 2. 透过热键进行切片和截图操作

除了按下按钮进行切片和截图操作外，你也可以透过热键进行操作。

在设置中，你可以自定义热键。

![hotkey-1](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/recorder/hotkey-1.png)

### 3. 可选择完整编译

在设置中，你可以选择是否要在录制结束后，进行完整编译。

![encode-1](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/recorder/encode-1.png)

启用完整编译后，录制结束后会打开新的编译页面，以进行多线程编译。

![encode-2](https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/tutorials/recorder/encode-2.png)

