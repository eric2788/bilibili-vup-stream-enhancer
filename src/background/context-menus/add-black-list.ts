import { getRoomId } from '~utils/misc'
import { getPort } from '@plasmohq/messaging/port'
import { sendBackground } from '~utils/messaging'

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
        await sendBackground('notify', {
            title: '添加失败',
            message: `未知的直播间: ${url.pathname}`
        })
    }
    const blackList = getPort('blacklist')
    blackList.postMessage({ roomId, command: 'add' })
}