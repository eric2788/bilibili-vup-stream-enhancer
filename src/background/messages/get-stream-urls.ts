import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { StreamUrlResponse } from "~types/bilibili";
import { fetchSameCredentialV1 } from '~utils/fetch';

export type RequestBody = {
    roomid: number | string
}


async function getStreamUrl(roomid: number | string) {
    const url = `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomid}&protocol=0,1&format=0,2&codec=0,1&qn=10000&platform=web&ptype=16`
    const data = await fetchSameCredentialV1<StreamUrlResponse>(url)

    if (data.is_hidden) {
        console.warn('此直播間被隱藏')
        return []
    }

    if (data.is_locked) {
        console.warn('此直播間已被封鎖')
        return []
    }

    if (data.encrypted && !data.pwd_verified) {
        console.warn('此直播間已被上鎖')
        return []
    }

    const streams = data?.playurl_info?.playurl?.stream ?? []
    if (streams.length == 0) {
        console.warn('没有可用的直播视频流')
        return []
    }

    return streams.flatMap(st =>
        st.format.flatMap(format => {
            if (format.format_name !== 'flv') {
                console.warn(`线路 ${st.protocol_name} 格式 ${format.format_name} 并不是 flv, 已经略过`)
                return []
            }

            return format.codec
                .toSorted((a, b) => b.current_qn - a.current_qn)
                .flatMap(codec =>
                    codec.url_info.map(url_info => url_info.host + codec.base_url + url_info.extra)
                )
        })
    )
}


const handler: PlasmoMessaging.MessageHandler<RequestBody> = async (req, res) => {

    const { roomid } = req.body
    const urls = await getStreamUrl(roomid)
    res.send(urls)
}


export default handler