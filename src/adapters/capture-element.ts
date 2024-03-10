import { injectFuncAsListener } from '~utils/event'
import { sendBLiveMessage } from '~utils/messaging'
import { md5 } from 'hash-wasm'

import type { Settings } from "~settings"
// mutation observer danmaku must be text node
type DanmakuMutation = {
    content: string
    color: number
    position: number
    size: number
    uid: number
    uname: string
}


const danmakuCache = new Map<number, DanmakuMutation>()

const config: MutationObserverInit = { attributes: false, childList: true, subtree: true }

const observers: MutationObserver[] = []
let keepBottomInterval: number = 0 

async function hash(str: string): Promise<number> {
    const hex = await md5(str)
    return parseInt(hex, 16)
}

function startDanmakuMonitor(settings: Settings): MutationObserver {
    const { attr: attribute, elements } = settings['settings.developer']
    const chatList = document.querySelector(elements.chatItems)
    const observer = new MutationObserver(async (mutationsList: MutationRecord[]) => {
        for (const node of mutationsList.flatMap(mu => mu.addedNodes).flatMap(n => [...n.values()])) {
            if (!(node instanceof HTMLElement)) continue
            const danmaku = node.getAttribute(attribute.chatDanmaku)?.trim()
            const userId = node.getAttribute(attribute.chatUserId)?.trim()
            if (!danmaku || !userId) continue
            const danmakuId = await hash(danmaku)
            const modified = await sendBLiveMessage('DANMU_MSG', {
                cmd: 'DANMU_MSG',
                info: [
                    [
                        undefined,
                        undefined, // 弹幕显示模式（滚动、顶部、底部）
                        undefined, // 字体尺寸
                        undefined, // 颜色
                        Date.now(), // 时间戳（毫秒）
                        danmakuId, // 随机数，前端叫作弹幕ID，可能是去重用的
                        undefined,
                        undefined, // 用户ID文本的CRC32
                        undefined,
                        0, // 是否礼物弹幕（节奏风暴）
                        undefined, // 右侧评论栏气泡
                        undefined,
                        undefined,
                        "{}", // 弹幕类型，0文本，1表情，2语音
                        "{}", // 表情参数
                        undefined,
                        undefined
                    ],
                    danmaku,
                    [
                        parseInt(userId),
                        "username",
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined
                    ],
                    undefined,
                    [ 99, 99, 99, '', 99 ],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined
                ],
                dm_v2: ""
            })
            if (!modified) continue
            danmakuCache.set(danmakuId, {
                content: danmaku,
                color: modified.info[0][3],
                position: modified.info[0][1],
                size: modified.info[0][2],
                uid: modified.info[2][0],
                uname: modified.info[2][1]
            })
        }
    })
    observer.observe(chatList, config)
    return observer
}

// opacity and hide should be handle from features because they are not common mutation
// please note that the modification of mutation observer is limited due to lack of information
function startDanmakuStyleMonitor(settings: Settings): MutationObserver {
    const { elements: { danmakuArea } } = settings['settings.developer']
    const danmakuContainer = document.querySelector(danmakuArea)
    const danmakuObserver = new MutationObserver(async (mutationsList: MutationRecord[]) => {
        for (const node of mutationsList.flatMap(mu => mu.addedNodes).flatMap(n => [...n.values()])) {
            let danmaku: string = undefined
            let danmakuNode: HTMLElement = undefined
            if (node instanceof Text) {
                danmaku = node.textContent?.trim() ?? node.data?.trim()
                danmakuNode = node.parentElement
            } else if (node instanceof HTMLElement) {
                danmaku = node.innerText?.trim()
                danmakuNode = node
            }
            console.log('danmaku', danmaku)
            if (danmaku === undefined || danmaku === '') continue
            const danmakuId = await hash(danmaku)
            if (!danmakuCache.has(danmakuId)) continue
            const modified = danmakuCache.get(danmakuId)
            // currently only these 3 attributes are supported to modify in mutation observer
            if (modified.color) {
                danmakuNode.style.color = `#${modified.color.toString(16)}`
            }
            if (modified.size) {
                danmakuNode.style.fontSize = `${modified.size}px`
            }
            if (modified.content !== danmaku) {
                danmakuNode.textContent = `${modified.content}`
            }
            danmakuCache.delete(danmakuId)
        }
    })
    danmakuObserver.observe(danmakuContainer, config)
    return danmakuObserver
}

function startKeepBottom(settings: Settings): number {
    const msgButton = document.querySelector(settings['settings.developer'].elements.newMsgButton) as HTMLElement
    return window.setInterval(() => {
        if (msgButton.style.display !== 'none') {
            msgButton.click()
        }
    }, 1000)
}


async function hook(settings: Settings) {
    observers.push(startDanmakuMonitor(settings))
    observers.push(startDanmakuStyleMonitor(settings))
    keepBottomInterval = startKeepBottom(settings)
}


async function unhook() {
    clearInterval(keepBottomInterval)
    while (observers.length) {
        observers.pop().disconnect()
    }
}


injectFuncAsListener(hook)
injectFuncAsListener(unhook)