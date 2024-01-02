import type { GetInfoByRoomResponse, RoomInitResponse, V1Response, WbiAccInfoResponse, WebInterfaceNavResponse } from "~types/bilibili";
import type { SpecAreaRankResponse } from "~types/bilibili/api/spec-area-rank";
import { catcher, fetchSameOrigin, fetchSameOriginV1, retryCatcher, withRetries } from "~utils/fetch";
import { identifyVup } from "./vtb-moe";
import func from "~utils/func";
import { sendMessager } from "~utils/messaging";
import { md5 } from "hash-wasm";
import { localStorage } from "~utils/storage";



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
    const vup = await retryCatcher(() => identifyVup(response.uid), 3)

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

    while (true) {
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

async function generateWbi(): Promise<string> {
    const url = 'https://api.bilibili.com/x/web-interface/nav';
    // get wbi keys
    const res = await sendMessager('request', {
        url,
        options: {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://www.bilibili.com',
                'Origin': 'https://www.bilibili.com'
            },
        }
    }) as V1Response<WebInterfaceNavResponse>

    if (res.code !== 0) throw new Error(`B站API请求错误: ${res.message}`)

    const { img_url, sub_url } = res.data.wbi_img;

    const img_key = img_url.substring(img_url.lastIndexOf('/') + 1, img_url.length).split('.')[0];
    const sub_key = sub_url.substring(sub_url.lastIndexOf('/') + 1, sub_url.length).split('.')[0]

    const mixinKeyEncTab = [
        46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
        33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
        61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
        36, 20, 34, 44, 52
    ]

    const orig = img_key + sub_key;

    let temp = ''
    mixinKeyEncTab.forEach((n) => {
        temp += orig[n]
    })

    return temp.slice(0, 32)
}

async function w_rid(uid: string, wts: number): Promise<string> {
    let salt = await localStorage.get<string>('wbi_salt')
    const lastUpdate = await localStorage.get<number>('wbi_salt_last_update')
    if (!salt || !lastUpdate || Date.now() - lastUpdate > 1000 * 60 * 60 * 24) {
        console.info(`wbi_salt is not found or expired, generating new one...`)
        salt = await generateWbi()
        console.info(`wbi_salt generated: ${salt}`)
        await localStorage.set('wbi_salt', salt)
        await localStorage.set('wbi_salt_last_update', Date.now())
        console.info(`wbi_salt saved to local storage`)
    }
    const c: string = salt;
    const b: string = `mid=${uid}&platform=web&token=&web_location=1550101`;
    const a: string = `${b}&wts=${wts}${c}`; // mid + platform + token + web_location + 时间戳wts + 一个固定值
    return await md5(a)
}

export async function requestUserInfo(mid: string): Promise<WbiAccInfoResponse> {

    const now: number = Math.round(Date.now() / 1000);
    const wrid = await w_rid(mid, now);
    const url = `https://api.bilibili.com/x/space/wbi/acc/info?platform=web&token=&web_location=1550101&wts=${now}&mid=${mid}&w_rid=${wrid}`;

    const res = await sendMessager('request', {
        url,
        options: {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://space.bilibili.com',
                'Origin': 'https://space.bilibili.com'
            },
        }
    }) as V1Response<WbiAccInfoResponse>

    if (res.code !== 0) throw new Error(`B站API请求错误: ${res.message}`)
    return res.data
}


// window.__NEPTUNE_IS_MY_WAIFU__
export type NeptuneIsMyWaifu = {
    'roomInfoRes': V1Response<GetInfoByRoomResponse>
    'roomInitRes': V1Response<RoomInitResponse>
}


export async function getNeptuneIsMyWaifu<K extends keyof NeptuneIsMyWaifu>(key: K): Promise<NeptuneIsMyWaifu[K]> {
    const result = await sendMessager('inject-js', {
        func: (key) => window['__NEPTUNE_IS_MY_WAIFU__'][key],
        args: [key],
        world: 'MAIN',
    })
    if (!result || result.length === 0) return undefined
    return result[0].result
}