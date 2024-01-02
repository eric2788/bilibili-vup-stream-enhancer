import type { PlasmoMessaging } from "@plasmohq/messaging";
import { sendBackground } from "~utils/messaging";
import storage from "~utils/storage";

export type RequestBody = {
    command: 'add' | 'remove'
    roomId: number | string
}

const handler: PlasmoMessaging.PortHandler<RequestBody> = async (req, res) => {
    const { command, roomId } = req.body;
    const settings = await storage.get<any>('settings')

    //TODO: this settings is not final version
    if (command === 'add') {
        if (!settings.blacklistRooms.includes(roomId)) {
            await sendBackground('notify', {
                title: '已添加到黑名单',
                message: `房间 ${roomId} 已添加到黑名单。`
            })
            settings.blacklistRooms.push(roomId)
        } else {
            await sendBackground('notify', {
                title: '你已添加过此房间到黑名单。',
                message: '已略过操作。'
            })
        }
    } else if (command === 'remove') {
        const index = settings.blacklistRooms.indexOf(roomId)
        if (index !== -1) {
            await sendBackground('notify', {
                title: '已从黑名单中移除',
                message: `房间 ${roomId} 已从黑名单中移除。`
            })
            settings.blacklistRooms.splice(index, 1)
        } else {
            await sendBackground('notify', {
                title: '你未添加过此房间到黑名单。',
                message: '已略过操作。'
            })
        }
    }
}


export default handler