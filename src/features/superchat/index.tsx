import type { FeatureHookRender } from "..";


import { getSuperChatList } from "~api/bilibili";
import OfflineRecordsProvider from "~components/OfflineRecordsProvider";
import SuperChatFeatureContext from "~contexts/SuperChatFeatureContext";
import { randomString, toStreamingTime, toTimer } from "~utils/misc";
import SuperChatButtonSkeleton from "./components/SuperChatButtonSkeleton";
import SuperChatCaptureLayer from "./components/SuperChatCaptureLayer";
import { type SuperChatCard } from "./components/SuperChatItem";


export const FeatureContext = SuperChatFeatureContext

const handler: FeatureHookRender = async (settings, info) => {

    const { common: { useStreamingTime }, enabledRecording } = settings['settings.features']

    const list = await getSuperChatList(info.room)
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
            timestamp: item.start_time,
            date: useStreamingTime ? toTimer(item.start_time - info.liveTime) : toStreamingTime(item.start_time),
            hash: `${randomString()}${item.id}`,
            persist: false
        }))

    return [
        <OfflineRecordsProvider
            key={info.room}
            feature="superchat"
            room={info.room}
            settings={settings}
            table="superchats"
            filter={(superchat) => superchats.every(s => s.id !== superchat.scId)}
            sortBy="timestamp"
            reverse={true}
            loading={<SuperChatButtonSkeleton />}
            error={(err) => <></>}
        >
            {(records) => {
                const offlineRecords = [...superchats, ...records.map((r) => ({ ...r, id: r.scId, persist: true }))]
                return (info.status === 'online' || (enabledRecording.includes('superchat') && offlineRecords.length > 0)) && <SuperChatCaptureLayer offlineRecords={offlineRecords} />
            }}
        </OfflineRecordsProvider>
    ]
}


export default handler