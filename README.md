# bilibili 直播同传字幕过滤插件

[下载及更新记录](https://github.com/eric2788/bilibili-jimaku-filter/releases)

## > 简介

[原帖](https://ngabbs.com/read.php?tid=17690584)

太久没更新而且用上去不怎么上手，所以就自己重写了一个, 顺便加了些新功能

另外这次重写不再采用隔毫秒侦测屏幕弹幕，而是采用mutation observer监控捕捉聊天室栏dom变动(更新: 现在可以支援WebSocket了)，因此不需要担心挂后台弹幕没出现而错过同传字幕。(有时候你甚至会发现字幕比同传弹幕快)

然后开启字幕记录后可以离线储存上次的字幕记录，重入直播间可以获取先前所有的字幕记录，删除记录需要手动

## > 功能简介

### ➵ 设定界面

![icon](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/icon.png)

[此处可查看范本](https://eric2788.github.io/bilibili-jimaku-filter/)

*黑名单用于过滤国v等等的名单*

### ➵ 支援各种全屏

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/screen-show.gif)


### ➵ 字幕版面縮放

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/sub-resize.gif)

### ➵ 同传弹幕风格

主要是颜色和透明度

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/jimaku-style-change.gif)

### ➵ 隐藏同传弹幕

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/hide-jimaku.gif)

### ➵ 记住上一次全屏的字幕背景位置/大小 

别问为什么我盖住了主播 

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/remember-size.gif)

### ➵ 下载同传字幕记录

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/download-log.gif)

### ➵ 弹幕置顶置底(仅限采用WebSocket监控时)

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/ws-top.png)

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/ws-top-2.png)

### ➵ 带名同传

新增了带名为 n 的正则捕捉群组

目前推荐使用 [这个](https://github.com/eric2788/bilibili-jimaku-filter/issues/1) 作为默认正则表达式，其可捕捉的格式如下

    "你【你是谁】"
    "我: 【你是谁】"
    "我:【你是谁】"
    "你 【是谁啊】"

### ➵ 字幕记录的时间戳记

串流时间戳记

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/stream-ts.png)

`[03:51]` => 直播时间: 直播了三分五十一秒

真实时间戳记

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/real-ts.png)

`[18:16:50]` => 真实时间: 下午六点十六分五十秒

### ➵ 自动更新(仅限火狐)

可手动更新或者勾选自动更新(默认每天检查一次)

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/auto-update.png)

检测到有可用更新的时会出现通知，点击更新

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/auto-update-2.png)

更新后版本将会改变，点击释出日志可以看看更新了什么

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/auto-update-3.png)

### ➵ 仅限虚拟主播

![](https://media.discordapp.net/attachments/415882741092057088/787286599947517962/unknown.png)

### ➵ 过滤国V(试验阶段)

![](https://media.discordapp.net/attachments/415882741092057088/787286308790861824/unknown.png)

### ➵ 其他功能

一些小功能我就不上图了，直接列出来

- 字幕行距与缩放
- 按钮风格设定
- 字幕文字与背景风格设定

## > 把本插件使用到Chrome

### ➵ 把插件载入到 Chrome

首先下载xpi档案

然后把 xpi 档案使用 压缩档打开

把所有东西放到一个文件夹

然后到 chrome 扩充功能

打开 开发人员模式

然后按下载入未封装项目

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/to-chrome.png)

选择刚刚解压缩的那个文件夹

最后成功加载

因为不是chrome插件，所以有错误是正常的

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/to-chrome-2.png)

### ➵ Chrome 打开设定页面

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/icon-see.png)

这个点一下就有 icon 按钮出现了

### ➵ Chrome 更新而不影响之前的设定

1. 关闭浏览器
2. 把文件夹内旧的东西删掉
3. 下载新的档案并把压缩档打开
4. 把里面的东西放到文件夹
5. 重新打开浏览器

### ➵ 目前已知放Chrome的bug

- 无法使用置顶置底弹幕

## > 有用连结

[NGA帖文](https://ngabbs.com/read.php?tid=24434809)

[问题回报和功能请求帖](https://github.com/eric2788/bilibili-jimaku-filter/issues)
