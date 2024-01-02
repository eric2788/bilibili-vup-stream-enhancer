
import storage from '~/utils/storage'
import { sendBackground } from '~utils/messaging'
import { sendViaRelay } from '@plasmohq/messaging/relay'
import { getRoomId } from '~utils/misc'

export const properties: chrome.contextMenus.CreateProperties = {
    id: 'add-black-list',
    title: '添加到黑名单',
    documentUrlPatterns: ['https://live.bilibili.com/*'],
    contexts: ['page'],
    enabled: true
}


export default async function (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab): Promise<void> {
    const settings = await storage.get<any>('settings')
    const url = new URL(info.pageUrl)
    const roomId = getRoomId(url.pathname)
    if (!roomId) {
        console.warn(`unknown room id (${url.pathname})`)
        return;
    }
    if (!settings.blacklistRooms.includes(roomId)) {
        await sendViaRelay({
            name: 'black-list',
            body: { roomId }
        })
    } else {
        await sendBackground('notify', {
            title: '你已添加过此房间到黑名单。',
            message: '已略过操作。'
        })
    }
}