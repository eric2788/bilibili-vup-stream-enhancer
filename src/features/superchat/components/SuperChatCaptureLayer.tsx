import { useCallback, useContext, useRef, useState } from "react"
import { getTimeStamp, randomString, toStreamingTime } from "~utils/misc"

import { useInterval } from "@react-hooks-library/core"
import ContentContext from "~contexts/ContentContexts"
import db from "~database"
import { useBLiveSubscriber } from "~hooks/message"
import SuperChatArea from "./SuperChatArea"
import SuperChatFloatingButton from "./SuperChatFloatingButton"
import type { SuperChatCard } from "./SuperChatItem"
import { useTransaction } from "~hooks/optimizer"

export type SuperChatCaptureLayerProps = {
    offlineRecords: SuperChatCard[]
}

function SuperChatCaptureLayer(props: SuperChatCaptureLayerProps): JSX.Element {

    const { settings, info } = useContext(ContentContext)
    const { offlineRecords } = props
    const { 
        enabledRecording, 
        common: { useStreamingTime } 
    } = settings['settings.features']

    const [superchat, setSuperChat] = useState<SuperChatCard[]>(offlineRecords)
    const clearSuperChat = useCallback(() => setSuperChat([]), [])

    const push = useTransaction<SuperChatCard>(500, (superchat) => {
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
    })

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
        push(superChatProps)
    })

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