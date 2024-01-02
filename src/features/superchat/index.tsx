import type { StreamInfo } from "~api/bilibili";
import type { Settings } from "~settings";
import type { FeatureHookRender } from "..";


import OfflineRecordsProvider from "~components/OfflineRecordsProvider";
import type { SuperChatList } from "~types/bilibili";
import { fetchSameCredentialBase } from "~utils/fetch";
import { type SuperChatCard } from "./components/SuperChatItem";
import SuperChatCaptureLayer from "./components/SuperChatCaptureLayer";
import { randomString, toStreamingTime, toTimer } from "~utils/misc";

const handler: FeatureHookRender = async (settings, info) => {

    const { useStreamingTime } = settings['settings.features']

    const { list } = await fetchSameCredentialBase<SuperChatList>(`https://api.live.bilibili.com/av/v1/SuperChat/getMessageList?room_id=${info.room}`)
    const superchats: SuperChatCard[] = (list ?? [])
        .sort((a, b) => b.start_time - a.start_time)
        .map((item) => ({
            id: item.id,
            backgroundColor: item.background_bottom_color,
            backgroundImage: item.background_image,
            backgroundHeaderColor: item.background_color,
            userIcon: item.user_info.face,
            nameColor: item.font_color,
            uid: item.uid,
            uname: item.user_info.uname,
            price: item.price,
            message: item.message,
            timestamp: item.start_time,
            date: useStreamingTime ? toTimer(info.liveTime - item.start_time) : toStreamingTime(item.start_time),
            hash: `${randomString()}${item.id}`
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
                const offlineRecords = [...superchats, ...records.map((r) => ({ ...r, id: r.scId }))]
                return (
                    <SuperChatCaptureLayer offlineRecords={offlineRecords} settings={settings} info={info} />
                )
            }}
        </OfflineRecordsProvider>
    ]
}


export default handler