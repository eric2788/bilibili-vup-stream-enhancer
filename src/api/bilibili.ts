import type { GetInfoByRoomResponse, V1Response } from "~types/bilibili";
import type { SpecAreaRankResponse } from "~types/bilibili/api/spec-area-rank";
import { catcher, fetchSameOriginV1, withRetries } from "~utils/fetch";
import { identifyVup } from "./vtb-moe";



export type StreamInfo = {
    room: string
    title: string
    uid: string,
    username: string
    isVtuber: boolean
    status: 'online' | 'offline'
}

export async function getStreamInfo(room: string | number): Promise<StreamInfo> {
    const data = await fetchSameOriginV1<GetInfoByRoomResponse>(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${room}`)
    const response: StreamInfo = {
        room: room.toString(),
        title: data.room_info.title,
        uid: data.room_info.uid.toString(),
        username: data.anchor_info.base_info.uname,
        isVtuber: data.room_info.parent_area_id != 9, // 分區辨識
        status: data.room_info.live_status === 1 ? 'online' : 'offline'
    }

    // real vtuber identification
    const vup = await catcher(withRetries(flatFunc(identifyVup, response.uid), 3))

    // if not undefined
    if (vup) {
        response.isVtuber = true
        console.log(`成功辨識虛擬主播: ${vup.name}`)
    }

    // if not identiied, keep the original value
    return response
}


export async function isNativeVtuber(uid: string | number): Promise<boolean> {
    
    let page = 0

    while(true) {
        const data = await fetchSameOriginV1<SpecAreaRankResponse>(`https://api.live.bilibili.com/xlive/activity-interface/v1/bls2020/getSpecAreaRank?act_id=23&_=1607569699845&period=1&team=1&page=${page}`)
        if (data.list === null) return false // 沒有資料了

        for (const { uid: user, tag } of data.list) {
            if (user.toString() === uid.toString()) {
                return tag === '汉语'
            }
        }

        page++
    }

}
