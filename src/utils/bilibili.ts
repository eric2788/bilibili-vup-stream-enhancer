import type { V1Response, WebInterfaceNavResponse } from "~types/bilibili"

import type { Settings } from "~settings"
import type { StreamInfo } from "~api/bilibili"
import { localStorage } from './storage'
import { md5 } from 'hash-wasm'
import { sendMessager } from './messaging'
import { sendRequest } from "./fetch"

export function getRoomId(url: string = location.pathname): string {
    return /^\/(blanc\/)?(?<id>\d+)/g.exec(url)?.groups?.id
}


export async function generateWbi(): Promise<string> {
    const url = 'https://api.bilibili.com/x/web-interface/nav'
    // get wbi keys
    const res = await sendRequest<V1Response<WebInterfaceNavResponse>>({
        url,
        options: {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://www.bilibili.com',
                'Origin': 'https://www.bilibili.com'
            },
        }
    })

    // because -101 also can be a valid response
    if (res.code !== 0 && res.code !== -101) throw new Error(`B站API请求错误: ${res.message}`)

    const { img_url, sub_url } = res.data.wbi_img

    const img_key = img_url.substring(img_url.lastIndexOf('/') + 1, img_url.length).split('.')[0]
    const sub_key = sub_url.substring(sub_url.lastIndexOf('/') + 1, sub_url.length).split('.')[0]

    const mixinKeyEncTab = [
        46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
        33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
        61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
        36, 20, 34, 44, 52
    ]

    const orig = img_key + sub_key

    let temp = ''
    mixinKeyEncTab.forEach((n) => {
        temp += orig[n]
    })

    return temp.slice(0, 32)
}

export async function w_rid(uid: string, wts: number): Promise<string> {
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
    const c: string = salt
    const b: string = `mid=${uid}&platform=web&token=&web_location=1550101`
    const a: string = `${b}&wts=${wts}${c}` // mid + platform + token + web_location + 时间戳wts + 一个固定值
    return await md5(a)
}


export function isDarkThemeBilbili(): boolean {
    return document.documentElement.getAttribute('lab-style')?.includes('dark')
}

// 使用 DOM query
export function getStreamInfoByDom(room: string, settings: Settings): StreamInfo {
    const developer = settings["settings.developer"]

    const title = document.querySelector<HTMLDivElement>(developer.elements.liveTitle)?.innerText ?? ''
    const username = document.querySelector<HTMLAnchorElement>(developer.elements.userName)?.innerText ?? ''

    const replay = document.querySelector(developer.elements.liveReplay)
    const ending = document.querySelector(developer.elements.liveIdle)

    return {
        room: room,
        shortRoom: room,
        title,
        uid: '0', // 暫時不知道怎麼從dom取得
        username,
        isVtuber: true,
        status: (replay !== null || ending !== null) ? 'offline' : 'online'
    } as StreamInfo
}



export function parseJimaku(danmaku: string, regex: string) {
    if (danmaku === undefined) return undefined
    const reg = new RegExp(regex)
    const g = reg.exec(danmaku)?.groups
    danmaku = g?.cc
    const name = g?.n
    if (danmaku === "") {
        danmaku = undefined
    }
    return name && danmaku ? `${name}: ${danmaku}` : danmaku
}

export function isThemePage(): boolean {
    return location.pathname.indexOf('blanc') > -1 && location.search.indexOf('liteVersion') > -1
}

