import { getPort } from '@plasmohq/messaging/port'
import { sendForward } from '~background/forwards'
import command from '~background/forwards/command'
import { sendInternal } from '~background/messages'
import { getRoomId } from '~utils/bilibili'
import { sendMessager } from '~utils/messaging'
import { getSettingStorage, setSettingStorage } from '~utils/storage'

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
        await sendMessager('notify', {
            title: '添加失败',
            message: `未知的直播间: ${url.pathname}`
        })
    }

    await sendInternal('add-black-list', { roomId, sourceUrl: tab.url })
   
}