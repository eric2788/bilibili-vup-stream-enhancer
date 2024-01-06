import type { GetInfoByRoomResponse, SpecAreaRankResponse, StreamUrlResponse, SuperChatList, V1Response, WbiAccInfoResponse, WebInterfaceNavResponse } from "~types/bilibili"
import { fetchSameCredentialBase, fetchSameCredentialV1, retryCatcher, sendRequest } from '~utils/fetch'

import type { NeptuneIsMyWaifu } from "~background/functions/getBLiveCachedData"
import func from '~utils/func'
import { identifyVup } from './vtb-moe'
import { sendMessager } from '~utils/messaging'
import { w_rid } from '~utils/bilibili'

export type StreamInfo = {
    room: string
    shortRoom: string
    title: string
    uid: string
    username: string
    isVtuber: boolean
    status: 'online' | 'offline'
    liveTime: number
}

export async function getStreamInfo(room: string): Promise<StreamInfo> {
    const data = await fetchSameCredentialV1<GetInfoByRoomResponse>(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${room}`)
    return {
        room: data.room_info.room_id.toString(),
        shortRoom: data.room_info.short_id.toString(),
        title: data.room_info.title,
        uid: data.room_info.uid.toString(),
        username: data.anchor_info.base_info.uname,
        isVtuber: data.room_info.parent_area_id !== 9, // 分區辨識
        status: data.room_info.live_status === 1 ? 'online' : 'offline',
        liveTime: data.room_info.live_start_time
    }
}

// content-script only, for using in service worker / extension pages, use sendMessager('get-stream-urls', { roomId: roomid }) instead
export async function getStreamUrls(room: string): Promise<StreamUrlResponse> {
    return await fetchSameCredentialV1<StreamUrlResponse>(`https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${room}&protocol=0,1&format=0,2&codec=0,1&qn=10000&platform=web&ptype=16`)
}

export async function getSuperChatList(room: string): Promise<SuperChatList['list']> {
    const { list } = await fetchSameCredentialBase<SuperChatList>(`https://api.live.bilibili.com/av/v1/SuperChat/getMessageList?room_id=${room}`)
    return list
}

export async function ensureLogin(): Promise<boolean> {
    try {
        const data = await fetchSameCredentialV1<WebInterfaceNavResponse>('https://api.bilibili.com/x/web-interface/nav')
        return data.isLogin
    } catch (err: Error | any) {
        if (err instanceof Error) {
            throw err
        }
        const res = (err as V1Response<WebInterfaceNavResponse>)
        if (res.data) {
            return res.data.isLogin
        }
        throw res
    }
}

export async function ensureIsVtuber(info: StreamInfo): Promise<StreamInfo> {
    // real vtuber identification
    const vup = await retryCatcher(() => identifyVup(info.uid), 3,
        { id: info.uid, name: info.username, locale: 'idk' } // if failed, always return is vtuber = true
    )

    // if not undefined
    if (vup) {
        info.isVtuber = true
        console.log(`成功辨識虛擬主播: ${vup.name}`)
    }

    return info
}


export async function isNativeVtuber(uid: string | number): Promise<boolean> {

    let page = 1

    while (true) {
        const data = await fetchSameCredentialV1<SpecAreaRankResponse>(`https://api.live.bilibili.com/xlive/activity-interface/v1/bls2020/getSpecAreaRank?act_id=23&_=1607569699845&period=1&team=1&page=${page}`)
        if (data.list === null) return false // 沒有資料了

        for (const { uid: user, tag } of data.list) {
            if (user.toString() === uid.toString()) {
                return tag === '汉语'
            }
        }

        page++
    }

}

export async function requestUserInfo(mid: string): Promise<WbiAccInfoResponse> {

    const now: number = Math.round(Date.now() / 1000)
    const wrid = await w_rid(mid, now)
    const url = `https://api.bilibili.com/x/space/wbi/acc/info?platform=web&token=&web_location=1550101&wts=${now}&mid=${mid}&w_rid=${wrid}`

    const res = await sendRequest<V1Response<WbiAccInfoResponse>>({
        url,
        options: {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://space.bilibili.com',
                'Origin': 'https://space.bilibili.com'
            },
        }
    })
    
    if (res.code !== 0) throw new Error(`B站API请求错误: ${res.message}`)
    return res.data
}


export async function getNeptuneIsMyWaifu<K extends keyof NeptuneIsMyWaifu>(key: K): Promise<NeptuneIsMyWaifu[K]> {
    const result = await sendMessager('inject-func', {
        function: func.inject('getBLiveCachedData')(key)
    })
    if (!result || result.length === 0) return undefined
    return result[0].result
}