import { useInterval } from "@react-hooks-library/core"
import { useCallback, useMemo, useRef, useState } from "react"
import type { StreamInfo } from "~api/bilibili"
import SuperChatContext from "~contexts/SuperChatContext"
import db from "~database"
import { useBLiveMessageCommand } from "~hooks/message"
import type { Settings } from "~settings"
import { getTimeStamp, randomString, toStreamingTime } from "~utils/misc"
import SuperChatFloatingButton from "./SuperChatFloatingButton"
import type { SuperChatCard } from "./SuperChatItem"


export type SuperChatCaptureLayerProps = {
    offlineRecords: SuperChatCard[]
    settings: Settings
    info: StreamInfo
}


function SuperChatCaptureLayer(props: SuperChatCaptureLayerProps): JSX.Element {

    const { settings, info, offlineRecords } = props

    const { enabledRecording, useStreamingTime } = settings['settings.features']
    const [superchat, setSuperChat] = useState<SuperChatCard[]>(offlineRecords)
    const transactions = useRef<SuperChatCard[]>([])

    useBLiveMessageCommand('SUPER_CHAT_MESSAGE', ({ data }) => {
        const superChatProps: SuperChatCard = {
            id: data.id,
            backgroundColor: data.background_bottom_color,
            backgroundImage: data.background_image,
            backgroundHeaderColor: data.background_color,
            userIcon: data.user_info.face,
            nameColor: data.user_info.name_color,
            uid: data.uid,
            uname: data.user_info.uname,
            price: data.price,
            message: data.message,
            timestamp: data.start_time,
            date: useStreamingTime ? toStreamingTime(info.liveTime) : getTimeStamp(),
            hash: `${randomString()}${data.id}`
        }
        transactions.current.push(superChatProps)
    })


    useInterval(() => {
        if (transactions.current.length === 0) return
        const superchat = transactions.current.shift()
        setSuperChat(prev => [superchat, ...prev])
        if (enabledRecording.includes('superchat')) {
            db.superchats
                .add({
                    ...superchat,
                    scId: superchat.id,
                    room: info.room,
                })
                .then(() => console.debug(`[BJF] SuperChat: ${superchat.uname}(${superchat.price}) 的醒目留言已记录`))
                .catch(err => console.error(`[BJF] SuperChat: ${superchat.uname}(${superchat.price}) 的醒目留言记录失败`, err))
        }
    }, 500)


    const clearSuperChat = useCallback(() => setSuperChat([]), [])
    const context = useMemo(() => ({ superchats: superchat, clearSuperChat }), [superchat, clearSuperChat])


    return (
        <SuperChatContext.Provider value={context}>
            <SuperChatFloatingButton settings={settings} info={info} />
        </SuperChatContext.Provider>
    )
}


export default SuperChatCaptureLayer