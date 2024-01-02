import type { FeatureHookRender } from "..";


import OfflineRecordsProvider from "~components/OfflineRecordsProvider";
import type { SuperChatList } from "~types/bilibili";
import { fetchSameCredentialBase } from "~utils/fetch";
import { randomString, toStreamingTime, toTimer } from "~utils/misc";
import SuperChatCaptureLayer from "./components/SuperChatCaptureLayer";
import { type SuperChatCard } from "./components/SuperChatItem";
import { Spinner } from "@material-tailwind/react";

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
            nameColor: '#646c7a',
            uid: item.uid,
            uname: item.user_info.uname,
            price: item.price,
            message: item.message,
            timestamp: item.start_time,
            date: useStreamingTime ? toTimer(item.start_time - info.liveTime) : toStreamingTime(item.start_time),
            hash: `${randomString()}${item.id}`
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
            loading={
                <button
                    style={{
                        left: 48,
                        top: 96,
                        width: 85,
                        height: 85
                    }}
                    className="absolute rounded-full bg-white p-3 drop-shadow-lg flex flex-col justify-center items-center gap-3 text-black">
                    <Spinner />
                    <div>醒目留言</div>
                </button>
            }
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