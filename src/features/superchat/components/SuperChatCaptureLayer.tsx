import type { Settings } from "~settings"
import type { SuperChatCard } from "./SuperChatItem"
import type { StreamInfo } from "~api/bilibili"
import { useBLiveMessageCommand } from "~hooks/message"
import { useRef, useState } from "react"
import { useInterval } from "@react-hooks-library/core"
import SuperChatFloatingButton from "./SuperChatFloatingButton"


export type SuperChatCaptureLayerProps = {
    offlineRecords: SuperChatCard[]
    settings: Settings
    info: StreamInfo
}


function SuperChatCaptureLayer(props: SuperChatCaptureLayerProps): JSX.Element {

    const { settings, info, offlineRecords } = props

    const [superchat, setSuperChat] = useState<SuperChatCard[]>(offlineRecords)
    const transactions = useRef<SuperChatCard[]>([])

    useBLiveMessageCommand('SUPER_CHAT_MESSAGE', ({ data }) => {
        const superChatProps: SuperChatCard = {
            id: data.id,
            backgroundColor: data.background_bottom_color,
            backgroundImage: data.background_image,
            backgroundHeaderColor: data.background_color,
            userIcon: data.user_info.face,
            nameColor: '#646c7a',
            uid: data.uid,
            uname: data.user_info.uname,
            price: data.price,
            message: data.message,
        }
        transactions.current.push(superChatProps)
    })


    useInterval(() => {
        if (transactions.current.length === 0) return
        const superchat = transactions.current.shift()
        setSuperChat(prev => [superchat, ...prev])
    }, 500)

    return (
        <>
            <SuperChatFloatingButton superchats={superchat} settings={settings} info={info} />
        </>
    )
}


export default SuperChatCaptureLayer