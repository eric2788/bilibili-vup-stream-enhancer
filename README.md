# bilibili 直播同传字幕过滤插件


## > 下载

[火狐及更新记录](https://github.com/eric2788/bilibili-jimaku-filter/releases)

[Edge](https://microsoftedge.microsoft.com/addons/detail/ehdhihncinoejihhmhpdoeloadihnfio)

[Chrome](https://chrome.google.com/webstore/detail/nhomlepkjglilcahfcfnggebkaabeiog)

## > 简介

本插件采用WebSocket侦测弹幕文字，因此不需要担心挂后台弹幕没出现而错过同传字幕。(有时候你甚至会发现字幕比同传弹幕快)

然后开启字幕记录后可以离线储存上次的字幕记录，重入直播间可以获取先前所有的字幕记录，删除记录需要手动

## ➵ 功能简介

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
<summary>醒目留言记录</summary>

防止SC时间过后消失。

没有离线记录，因此F5后所有记录会被清空。

![](https://media.discordapp.net/attachments/786944895138005033/794528423304888350/unknown.png)
</details>

<details>
    <summary>SC导出记录</summary>
    
![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/sc-output.gif)

</details>

<details>
    <summary>一键添加黑名单</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/blacklist-btn.gif)
</details>


<details>
<summary>字幕动画设定</summary>

右移

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/animate-left.gif)

下移

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/animate-top.gif)

缩放

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/aniamte-size.gif)


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

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/remember-size.gif)

</details>

<details>
<summary>同传弹幕弹出式视窗</summary>

![](https://media.discordapp.net/attachments/786944895138005033/808695474835423302/unknown.png)

</details>

<details>
<summary>下载同传字幕记录</summary>

![](https://github.com/eric2788/bilibili-jimaku-filter/raw/web/assets/download-log.gif)

</details>

<details>
<summary>弹幕置顶置底</summary>

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/ws-top.png)

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/ws-top-2.png)

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

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/stream-ts.png)

`[03:51]` => 直播时间: 直播了三分五十一秒

真实时间戳记

![](https://raw.githubusercontent.com/eric2788/bilibili-jimaku-filter/web/assets/real-ts.png)

`[18:16:50]` => 真实时间: 下午六点十六分五十秒

</details>

<details>
<summary>仅限虚拟主播</summary>

![](https://media.discordapp.net/attachments/415882741092057088/787286599947517962/unknown.png)

</details>

<details>
<summary>过滤国V(试验阶段)</summary>

![](https://media.discordapp.net/attachments/415882741092057088/787286308790861824/unknown.png)

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

## ➵ 把本插件使用到Chrome

[点击這裏查看](https://github.com/eric2788/bilibili-jimaku-filter/wiki/%E6%8A%8A%E7%81%AB%E7%8B%90%E6%8F%92%E4%BB%B6%E4%BD%BF%E7%94%A8%E5%88%B0%E5%85%B6%E4%BB%96%E6%B5%8F%E8%A7%88%E5%99%A8)

## ➵ 有用连结

[NGA帖文](https://ngabbs.com/read.php?tid=24434809)

[问题回报和功能请求帖](https://github.com/eric2788/bilibili-jimaku-filter/issues)
