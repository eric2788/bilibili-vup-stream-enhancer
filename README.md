# bilibili 直播同传字幕过滤插件

**此分支已過時**, 目前主分支是 manifest v3 的 master


## ➵ 下载

[火狐及更新记录](https://github.com/eric2788/bilibili-jimaku-filter/releases)

[Edge](https://microsoftedge.microsoft.com/addons/detail/ehdhihncinoejihhmhpdoeloadihnfio)

[Chrome](https://chrome.google.com/webstore/detail/nhomlepkjglilcahfcfnggebkaabeiog)

## ➵ 简介

本浏览器插件透过挂接 WebSocket 为同传字幕做过滤，并且把其放到更好的画面上展示。
本插件虽然功能众多，但大部分功能基本上为可选，你仍可为界面保持简化。

功能将在以下一一详述。

## ➵ 功能简介

__如破图，请自行到 [web/assets](https://github.com/eric2788/bilibili-jimaku-filter/tree/web/assets) 查看图片__

<details>
<summary>设定界面</summary>

![icon](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/icon.png)

[此处可查看范本](https://eric2788.github.io/bilibili-jimaku-filter/)

*黑名单用于过滤国v等等的名单*

</details>

<details>
<summary>支援各种全屏</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/screen-show.gif)

</details>

<details>
<summary>字幕版面縮放</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/sub-resize.gif)
</details>

<details>
<summary>字幕位置排版</summary>

除了置中的显示

![left](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/jimaku-pos-left.png)

![right](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/jimaku-pos-right.png)

</details>

<details>
<summary>醒目留言记录 + 导出记录</summary>

防止SC时间过后消失。

没有离线记录，因此F5后所有记录会被清空。

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/sc-output.gif)

</details>

<details>
    <summary>一键添加黑名单</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/blacklist-btn.gif)

你也可以右键页面打开菜单来添加黑名单

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/blacklist-context-menu.png)

</details>

<details>
    <summary>右键字幕屏蔽同传用户，防止同传污染</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/blacklist-tc.gif)

</details>


<details>
<summary>字幕动画设定</summary>

右移

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/animate-left.gif)

下移

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/animate-top.gif)

缩放

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/aniamte-size.gif)


</details>

<details>
<summary>同传弹幕风格</summary>

主要是颜色和透明度

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/jimaku-style-change.gif)

</details>

<details>
<summary>隐藏同传弹幕</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/hide-jimaku.gif)

</details>

<details>
<summary>记住上一次全屏的字幕背景位置/大小</summary>

别问为什么我盖住了主播 

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/remember-size.gif)

</details>

<details>
<summary>同传弹幕弹出式视窗</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/popup-jimaku.jpg)

</details>

<details>
<summary>DD监控式视窗</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/dd-monitor.png)

</details>

<details>
<summary>下载同传字幕记录</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/download-log.gif)

</details>

<details>
<summary>弹幕置顶置底</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/ws-top.png)

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/ws-top-2.png)

</details>

<details>
<summary>带名同传</summary>

新增了带名为 n 的正则捕捉群组

目前推荐使用 [这个](https://github.com/eric2788/bilibili-jimaku-filter/issues/1) 作为默认正则表达式，其可捕捉的格式如下

    "你【你是谁】"
    "我: 【你是谁】"
    "我:【你是谁】"
    "你 【是谁啊】"

</details>

<details>
<summary>字幕记录的时间戳记</summary>

串流时间戳记

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/stream-ts.png)

`[03:51]` => 直播时间: 直播了三分五十一秒

真实时间戳记

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/real-ts.png)

`[18:16:50]` => 真实时间: 下午六点十六分五十秒

</details>

<details>
<summary>仅限虚拟主播</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/only-vtb.jpg)

</details>

<details>
<summary>过滤国V(试验阶段)</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/filter-cnv.png)

</details>

<details>
<summary>对大海报活动房间的支援(试验阶段)</summary>
        
![image.png](https://i.loli.net/2021/01/31/oRcQt7GgvuBLmdi.png)
        
</details>

<details>
<summary>其他功能</summary>

一些小功能我就不上图了，直接列出来

- 字幕行距与缩放
- 按钮风格设定
- 字幕文字与背景风格设定
- 用戶黑名单
- 同传用户名单(名单内用户的弹幕直接为字幕)
- 自动更新(火狐/Chrome/Edge)

</details>

## ➵ 其他连结

[NGA帖文](https://ngabbs.com/read.php?tid=24434809)

[问题回报和功能请求帖](https://github.com/eric2788/bilibili-jimaku-filter/issues)
