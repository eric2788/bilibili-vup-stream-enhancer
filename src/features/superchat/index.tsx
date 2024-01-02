import type { StreamInfo } from "~api/bilibili";
import type { Settings } from "~settings";
import type { FeatureHookRender } from "..";


import OfflineRecordsProvider from "~components/OfflineRecordsProvider";
import type { SuperChatList } from "~types/bilibili";
import { fetchSameCredentialBase } from "~utils/fetch";
import { type SuperChatCard } from "./components/SuperChatItem";
import SuperChatCaptureLayer from "./components/SuperChatCaptureLayer";




export function App({ settings, info }: { settings: Settings, info: StreamInfo }): JSX.Element {
    return null
}


const handler: FeatureHookRender = async (settings, info) => {

    const { list } = await fetchSameCredentialBase<SuperChatList>(`https://api.live.bilibili.com/av/v1/SuperChat/getMessageList?room_id=${info.room}`)
    const superchats: SuperChatCard[] = (list ?? [])
        .sort((a, b) => b.start_time - a.start_time)
        .map((item) => ({
            id: item.id,
            backgroundColor: item.background_bottom_color,
            backgroundImage: item.background_image,
            backgroundHeaderColor: item.background_color,
            userIcon: item.user_info.face,
            nameColor: '#646c7a',
            uid: item.uid,
            uname: item.user_info.uname,
            price: item.price,
            message: item.message,
        }))

    return [
        <OfflineRecordsProvider
            feature="superchat"
            room={info.room}
            settings={settings}
            table="superchats"
            sortBy="timestamp"
            reverse={true}
            loading={<></>}
            error={(err) => <></>}
        >
            {(records) => {
                const offlineRecords = [...superchats, ...records.map((r) => ({...r, id: r.scId }))]
                return (
                    <SuperChatCaptureLayer offlineRecords={offlineRecords} settings={settings} info={info} />
                )
            }}
        </OfflineRecordsProvider>
    ]
}


export default handler