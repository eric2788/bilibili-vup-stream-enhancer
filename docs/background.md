## 后台脚本

> 后台脚本的架构基于 Plasmo 中的 [messaging API](https://docs.plasmo.com/framework/messaging) 。

后台脚本的架构如下:

```
background/ 
├── context-menus/      # 右键菜单的定义和处理。
├── forwards/           # 用于内容脚本和后台脚本之间的数据转换。 
├── functions/          # 用于放在网页上内嵌运行的函数。
├── messages/           # 基于 Plasmo，从内容脚本到后台脚本的指令传输。
├── scripts/            # 用于放在网页上注入运行的脚本。
├── forwards.ts         # 用于引入和存放所有的指令传输。
├── index.ts            # 后台脚本的入口文件。
├── messages.ts         # 用于引入和存放所有的消息传输。
├── ports.ts            # 基于 Plasmo 的 Ports API, 目前暂不使用
└── update-listener.ts  # 用于监听扩展更新的事件。
```

## messages/

此目录用于存放基于 Plasmo, 从内容脚本到后台脚本的消息传输。
有关其新增方式，请参阅 [Plasmo 文档](https://docs.plasmo.com/framework/messaging#message-flow)。

```ts
// 定义输入类型
export type RequestBody = {
    url?: string
    tab?: string
}

// 定义输出类型为可选
const handler: PlasmoMessaging.MessageHandler<RequestBody, chrome.tabs.Tab> = async (req, res) => {
    const { url, tab } = req.body
    const result = await chrome.tabs.create({ url: tab ? chrome.runtime.getURL(`/tabs/${tab}.html`) : url })
    res.send(result) // 定义输出类型后，必须用 res.send() 方法进行返回
}


export default handler
```

完成后，你需要到 `background/messages.ts` 中新增你的消息处理器：

```ts
import * as addBlackList from './messages/add-black-list'
// ...
import * as openTab from './messages/open-tab' // 新增的消息处理器

// ...

const messagers = {
    'notify': notify,
    // ...
    'open-tab': openTab, // 新增的消息处理器
}
```

### 使用

在内容脚本中，你可以使用 `sendMessager` 方法发送消息：

```ts
await sendMessager('open-tab', { tab: 'hello-world' })
```

在后台脚本中，你可以使用 `sendInternal` 方法发送消息：

```ts
await sendInternal('open-tab', { tab: 'hello-world' })
```

> 以上的函数都有类型定义，你可以在编辑器中查看其使用方法。


## context-menus/

在 `background/context-menus/` 目录下定义右键菜单，例如 `background/context-menus/add-black-list`。

```ts
export const properties: chrome.contextMenus.CreateProperties = {
    id: 'add-black-list',
    title: '添加到黑名单',
    documentUrlPatterns: ['https://live.bilibili.com/*'],
    contexts: ['page'],
    enabled: true
}


export default async function (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab): Promise<void> {
    const url = new URL(info.pageUrl)
    const roomId = getRoomId(url.pathname)

    if (!roomId) {
        console.warn(`unknown room id (${url.pathname})`)
        // sendInternal 基于 messaging 发送指令传输(后台对后台)
        return await sendInternal('notify', {
            title: '添加失败',
            message: `未知的直播间: ${url.pathname}`
        })
    }

    await sendInternal('add-black-list', { roomId, sourceUrl: tab.url })

}
```

完成后，你需要到 `background/context-menus/index.ts` 中新增你的右键菜单处理器：

```ts
import * as blacklist from './add-black-list' // 新增的右键菜单处理器

const { contextMenus } = chrome

const menus = [
    blacklist // 新增的右键菜单处理器
]
// ...
```

## forwards/

`forwards/` 主要用于内容脚本和后台脚本之间的数据转换。在本扩展使用例子有:

- 把内容脚本的弹幕数据发送到扩展页面
- 把内容脚本的同传字幕发送到扩展页面
- 扩展页面的重启指令发送到内容脚本
- 发送预编译的视频数据到扩展页面

例子如下:
```ts
// 输入数据结构
export type ResponseBody = {
    uname: string
    text: string
    color: string
    pos: 'scroll' | 'top' | 'bottom'
    room: string
}

// 输出数据结构
export type ForwardBody = {
    uname: string
    text: string
    color: number
    position: number
    room: string
}

// 支援 async 函数
const handler: ForwardHandler<ForwardBody, ResponseBody> = (req) => {

    let pos: 'scroll' | 'top' | 'bottom' = 'scroll'
    switch (req.body.position) {
        case 5:
            pos = 'top'
            break
        case 4:
            pos = 'bottom'
            break
    }

    return {
        ...req,
        body: {
            room: req.body.room,
            uname: req.body.uname,
            text: req.body.text,
            color: `#${req.body.color.toString(16)}`,
            pos,
        }
    }
}

export default handler
```

完成后，你需要到 `background/forwards.ts` 中新增你的数据转换处理器：

```ts
import * as bliveData from './forwards/blive-data'
import * as command from './forwards/command'
import * as jimaku from './forwards/jimaku'
import * as redirect from './forwards/redirect'
import * as danmaku from './forwards/danmaku' // 新增的数据转换处理器

// ...

const forwards = {
    'jimaku': jimaku,
    'command': command,
    'redirect': redirect,
    'blive-data': bliveData,
    'danmaku': danmaku // 新增的数据转换处理器
}
```

### 使用

使用方式有以下几种，你可以在 [`background/forwards.ts`](/src/background/forwards.ts) 或 [`hooks/forwarder.ts`](/src/hooks/forwarder.ts) 中查看更多的使用方式。

- 使用 `getFowarder`


```ts
// contents/index/index.tsx

    // 参数1: 频道
    // 参数2: 来源
    const forwarder = getForwarder('command', 'content-script')

    const app = createApp(roomId, { rootContainer }, info)

    const start = withProcessingFlag(app.start)
    const stop = withProcessingFlag(app.stop)

    // addhandler 为接收消息处理
    removeHandler = forwarder.addHandler(async data => {
      if (data.command === 'stop') {
        await stop()
      } else if (data.command === 'restart') {
        await stop()
        await start()
      }
    })
    // start the app
    await start()
```

- 使用 `sendForward`

```ts
// features/jimaku/components/JimakuCaptureLayer.tsx
// ...
const jimakuBlock = {
    date: datetime,
    text: jimaku,
    uid: data.info[2][0],
    uname: data.info[2][1],
    hash: randomString() + Date.now() + data.info[0][5],
}
push(jimakuBlock)
if (jimakuPopupWindow) {
    // 参数1: 目标
    // 参数2: 频道
    // 参数3: 传入数据
    sendForward('pages', 'jimaku', { date: datetime, text: jimaku, room: info.room })
}
// ...
```

- 使用 `useForwarder` (仅限 React 组件内)


> 跟 `getForwarder` 不同之处在于，`useForwarder` 是一个 React Hook，它会在组件卸载时自动清理消息处理器。

```ts
// tabs/jimaku.tsx

    const forwarder = useForwarder('jimaku', 'pages')

    useEffect(() => {
        if (bottomRef.current) {
            window.scrollTo(0, document.body.scrollHeight)
        }
    }, [messages])

    useEffect(() => {
        if (roomId) {
            setTitle(roomTitle ?? `B站直播间 ${roomId} 的同传弹幕视窗`)
            forwarder.addHandler((message) => {
                if (message.room !== roomId) return
                setMessages(messages => [...messages, message])
            })
        } else {
            alert('未知房间Id, 此同传弹幕视窗不会运行。')
        }
    }, []);
```

## functions/

`functions/` 主要用于放在网页上内嵌运行的函数。

> 此原理是基于 manifest v3 的 `chrome.scripting` API。

```ts
function getWindowVariable(key: string): any {
    const nested = key.split('.')
    if (nested.length === 1) return window[key]
    let current = window
    for (const k of nested) {
        current = current[k]
    }
    return current
}

export default getWindowVariable
```

完成后，你需要到 `background/functions/index.ts` 中新增你的函数：

```ts
import boostWebSocketHook from './boostWebsocketHook'
import getBLiveCachedData from './getBLiveCachedData'
import getWindowVariable from './getWindowVariable' // 新增的函数

// ...

const functions = {
    getWindowVariable, // 新增的函数
    getBLiveCachedData,
    boostWebSocketHook
}


export default functions
```

### 使用

你可以借助 [`utils/injector.ts`](/src/utils/injector.ts) 中的 `injectFunction` 方法注入你的函数到网页上。

```ts
const chrome = await injectFunction('getWindowVariable', 'chrome')
```

## scripts/

`scripts/` 主要用于放在网页上注入运行的脚本。
与 `functions/` 不同之处在于，`scripts/` 注入的是一个完整的脚本文件，而 `functions/` 只注入一个函数。

> 此原理同样是基于 manifest v3 的 `chrome.scripting` API。

现在比起新增一个文件，你需要新增一个文件夹，例如 `scripts/alert-hello-world`。

文件夹内的文件结构如下:

```
alert-hello-world/
├── function.ts
├── index.ts
└── script.ts
```

`function.ts` 用于定义你的函数:

```ts
async function alertHelloWorld(): Promise<void> {
    await sleep(5000)
    alert('Hello, World!')
}
export default alertHelloWorld
```

`script.ts` 用于注入你的脚本:

```ts
import { injectFuncAsListener } from '~utils/event'

import alertHelloWorld from './function'

injectFuncAsListener(alertHelloWorld)
```

`index.ts` 用于引入两者:

```ts
// 注意此处，你需要以 url 形式注入你的脚本
import url from 'url:./script.ts'

import prototype from './function'

export default { url, prototype }
```

最后，你需要到 `background/scripts/index.ts` 中新增你的脚本：

```ts
import clearIndexedDbTable from './clearIndexedDbTable'
import alertHelloWorld from './alert-hello-world' // 新增的脚本

// ...

const scripts = {
    clearIndexedDbTable,
    alertHelloWorld // 新增的脚本
}

export default scripts
```

> 注意: 目前 development 环境下首次运行脚本时会出现报错，目前原因未知。

### 使用

你可以借助 [`utils/injector.ts`](/src/utils/injector.ts) 中的 `injectScript` 方法注入你的脚本到网页上。

```ts
await injectScript('alert-hello-world')
```


## 进阶开发

你可以参考以下的源码以进行更进阶的后台开发:

- [现成的后台脚本参考](/src/background/)
- [自定义消息传输](/src/background/messages/)
- [自定义右键菜单](/src/background/context-menus/)
- [自定义数据转换](/src/background/forwards/)
- [自定义函数](/src/background/functions/)
- [自定义脚本](/src/background/scripts/)
- [自定义事件注入](/src/background/events/)
- [辅助函数](/src/utils/)
