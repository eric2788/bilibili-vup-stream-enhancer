import { useCallback, useContext, useRef, useState } from "react"
import { getTimeStamp, randomString, toStreamingTime } from "~utils/misc"

import { useInterval } from "@react-hooks-library/core"
import StreamInfoContext from "~contexts/SteamInfoContexts"
import db from "~database"
import { useBLiveSubscriber } from "~hooks/message"
import SuperChatArea from "./SuperChatArea"
import SuperChatFloatingButton from "./SuperChatFloatingButton"
import type { SuperChatCard } from "./SuperChatItem"

export type SuperChatCaptureLayerProps = {
    offlineRecords: SuperChatCard[]
}

function SuperChatCaptureLayer(props: SuperChatCaptureLayerProps): JSX.Element {

    const { settings, info } = useContext(StreamInfoContext)
    const { offlineRecords } = props
    const { enabledRecording, useStreamingTime } = settings['settings.features']

    const [superchat, setSuperChat] = useState<SuperChatCard[]>(offlineRecords)
    const clearSuperChat = useCallback(() => setSuperChat([]), [])
    const transactions = useRef<SuperChatCard[]>([])

    useBLiveSubscriber('SUPER_CHAT_MESSAGE', ({ data }) => {
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
            hash: `${randomString()}${data.id}`,
            persist: true
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

    return (
        <SuperChatFloatingButton>
            <SuperChatArea
                superchats={superchat}
                clearSuperChat={clearSuperChat}
            />
        </SuperChatFloatingButton>
    )
}


export default SuperChatCaptureLayer