import type { PlasmoMessaging } from "@plasmohq/messaging";
import { sendInternal } from "~background/messages";
import { getSettingStorage, setSettingStorage } from "~utils/storage";

export type RequestBody = {
    command: 'add' | 'remove'
    roomId: string
}

const handler: PlasmoMessaging.PortHandler<RequestBody> = async (req, res) => {
    const { command, roomId } = req.body;
    const settings = await getSettingStorage('settings.listings')

    const containRoom = (roomId: string) => settings.blackListRooms.map(r => r.room).includes(roomId)

    const addRoom = async (room: string) => {
        settings.blackListRooms.push({
            room,
            addedDate: new Date().toLocaleString()
        })
        await setSettingStorage('settings.listings', settings)
        // send to CS
        res.send({
            command: 'blacklisted',
            room: roomId
        })
    }

    const removeRoom = async (room: string) => {
        settings.blackListRooms = settings.blackListRooms.filter(r => r.room !== room)
        await setSettingStorage('settings.listings', settings)
    }

    if (command === 'add') {
        if (!containRoom(roomId)) {
            await addRoom(roomId)
            await sendInternal('notify', {
                title: '已添加到黑名单',
                message: `房间 ${roomId} 已添加到黑名单。`
            })
        } else {
            await sendInternal('notify', {
                title: '你已添加过此房间到黑名单。',
                message: '已略过操作。'
            })
        }
    } else if (command === 'remove') {
        if (!containRoom(roomId)) {
            await removeRoom(roomId)
            await sendInternal('notify', {
                title: '已从黑名单中移除',
                message: `房间 ${roomId} 已从黑名单中移除。`
            })
        } else {
            await sendInternal('notify', {
                title: '你未添加过此房间到黑名单。',
                message: '已略过操作。'
            })
        }
    }


}


export default handler