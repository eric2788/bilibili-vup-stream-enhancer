import type { StreamUrlResponse, V1Response } from "~types/bilibili"

import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendInternal } from "~background/messages"
import type { PlayerType } from "~players"

export type RequestBody = {
    roomId: number | string,
    withCredentials?: boolean
}

export type StreamUrls = {
    desc: string
    url: string
    type: PlayerType
    codec: string
    track: string
    quality: number
}[]

export type ResponseBody = {
    error?: string
    data: StreamUrls
}


async function getStreamUrl(roomid: number | string): Promise<StreamUrls> {
    const url = `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomid}&protocol=0,1&format=0,2&codec=0,1&qn=10000&platform=web&ptype=16`
    const res = await sendInternal('request', {
        url,
        timeout: 10000
    })
    if (res.error) throw new Error(res.error)

    const biliData = res.data as V1Response<StreamUrlResponse>
    if (biliData.code !== 0) throw new Error(biliData.message)
    const data = biliData.data

    if (data.is_hidden) {
        throw new Error('此直播間被隱藏')
    }

    if (data.is_locked) {
        throw new Error('此直播間已被封鎖')
    }

    if (data.encrypted && !data.pwd_verified) {
        throw new Error('此直播間已被上鎖')
    }

    const streams = data?.playurl_info?.playurl?.stream ?? []
    if (streams.length == 0) {
        throw new Error('没有可用的直播视频流')
    }

    const names = data?.playurl_info?.playurl?.g_qn_desc ?? []

    return streams
        .filter(st => ['http_stream', 'http_hls'].includes(st.protocol_name))
        .flatMap(st =>
            st.format
                .filter(format => st.protocol_name === 'http_hls' || format.format_name === 'flv')
                .flatMap(format => {
                    return format.codec
                        .toSorted((a, b) => b.current_qn - a.current_qn)
                        .flatMap(codec =>
                            codec.url_info.map(url_info => {
                                const queries = new URLSearchParams(url_info.extra)
                                const order = queries.get('order') ?? '0'
                                return ({
                                    desc: `${names.find(n => n.qn === codec.current_qn)?.desc ?? codec.current_qn}`,
                                    url: url_info.host + codec.base_url + url_info.extra,
                                    type: format.format_name === 'flv' ? 'flv' : 'hls',
                                    codec: codec.codec_name,
                                    track: order,
                                    quality: codec.current_qn
                                })
                            })
                        )
                })
        )
}


const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {
    const { roomId } = req.body
    try {
        const urls = await getStreamUrl(roomId)
        res.send({ data: urls })
    } catch (err: Error | any) {
        res.send({ error: err.message, data: [] })
    }
}


export default handler