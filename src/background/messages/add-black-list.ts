import { sendForward } from '~background/forwards'
import { sendInternal } from '~background/messages'
import { getSettingStorage, setSettingStorage } from '~utils/storage'


import type { PlasmoMessaging } from "@plasmohq/messaging"
export type RequestBody = {
    roomId: string,
    sourceUrl?: string
}



const handler: PlasmoMessaging.MessageHandler<RequestBody> = async (req, res) => {

    const { roomId, sourceUrl } = req.body

    const settings = await getSettingStorage('settings.listings')

    if (settings.blackListRooms.map(r => r.room).includes(roomId)) {
        return sendInternal('notify', {
            title: '你已添加过此房间到黑名单。',
            message: '已略过操作。'
        })
    }

    settings.blackListRooms.push({
        room: roomId,
        addedDate: new Date().toLocaleDateString()
    })

    await setSettingStorage('settings.listings', settings)
    await sendInternal('notify', {
        title: '已添加到黑名单',
        message: `房间 ${roomId} 已添加到黑名单。`
    })

    const url = sourceUrl ?? req?.sender?.tab?.url ?? '*://live.bilibili.com/*'
    sendForward('content-script', 'command', { command: 'stop' }, { url })
}

export default handler