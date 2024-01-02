import type { PlasmoMessaging } from "@plasmohq/messaging";
import { fetchSameOrigin } from "~utils/bilibili";

export type RequestBody = {
    roomid: number | string
}

interface StreamUrlResponse {
    code: number;
    message: string;
    ttl: number;
    data: {
        room_id: number;
        short_id: number;
        uid: number;
        is_hidden: boolean;
        is_locked: boolean;
        is_portrait: boolean;
        live_status: number;
        hidden_till: number;
        lock_till: number;
        encrypted: boolean;
        pwd_verified: boolean;
        live_time: number;
        room_shield: number;
        all_special_types: number[];
        playurl_info: {
            conf_json: string;
            playurl: {
                cid: number;
                g_qn_desc: {
                    qn: number;
                    desc: string;
                    hdr_desc: string;
                    attr_desc: null | string;
                }[];
                stream: {
                    protocol_name: string;
                    format: {
                        format_name: string;
                        codec: {
                            codec_name: string;
                            current_qn: number;
                            accept_qn: number[];
                            base_url: string;
                            url_info: {
                                host: string;
                                extra: string;
                                stream_ttl: number;
                            }[];
                            hdr_qn: null | number;
                            dolby_type: number;
                            attr_name: string;
                        }[];
                    }[];
                }[];
                p2p_data: {
                    p2p: boolean;
                    p2p_type: number;
                    m_p2p: boolean;
                    m_servers: null | string;
                };
                dolby_qn: null | number;
            };
        };
        official_type: number;
        official_room_id: number;
    };
}

async function getStreamUrl(roomid: number | string) {
    const url = `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomid}&protocol=0,1&format=0,2&codec=0,1&qn=10000&platform=web&ptype=16`
    const res = await fetchSameOrigin<StreamUrlResponse>(url)

    if (res.data.is_hidden) {
        console.warn('此直播間被隱藏')
        return []
    }

    if (res.data.is_locked) {
        console.warn('此直播間已被封鎖')
        return []
    }

    if (res.data.encrypted && !res.data.pwd_verified) {
        console.warn('此直播間已被上鎖')
        return []
    }

    const streams = res?.data?.playurl_info?.playurl?.stream ?? []
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