import type { V1Response, WebInterfaceNavResponse } from "~types/bilibili"

import { md5 } from 'hash-wasm'
import type { StreamInfo } from "~api/bilibili"
import type { Settings } from "~options/fragments"
import { sendRequest } from "./fetch"
import { localStorage } from './storage'

/**
 * Retrieves the room ID from the given URL or the current location pathname.
 * @param url - The URL to extract the room ID from. If not provided, the current location pathname will be used.
 * @returns The room ID extracted from the URL.
 */
export function getRoomId(url: string = location.pathname): string {
    return /^\/(blanc\/)?(?<id>\d+)/g.exec(url)?.groups?.id
}


/**
 * Generates a wbi key by sending a request to the Bilibili API.
 * @returns A promise that resolves to the wbi key.
 * @throws An error if the Bilibili API request fails.
 */
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


/**
 * Generates a w_rid hash for Bilibili API requests using the wbi_salt
 * @param query - The query string to be hashed
 * @param wts - Timestamp in seconds
 * @returns Promise that resolves to the MD5 hash of the query + wts + salt
 * @remarks
 * The function checks if a cached wbi_salt exists and is not expired (24h).
 * If no valid salt exists, it generates a new one via generateWbi().
 * The salt is stored in localStorage with an expiration timestamp.
 * The final hash is created by concatenating: query + wts + salt
 */
export async function w_rid(query: string, wts: number): Promise<string> {
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
    const a: string = `${query}&wts=${wts}${c}` // mid + platform + token + web_location + 时间戳wts + 一个固定值
    return await md5(a)
}


/**
 * Checks if the current Bilibili theme is dark.
 * @returns {boolean} True if the theme is dark, false otherwise.
 */
export function isDarkThemeBilbili(): boolean {
    return document.documentElement.getAttribute('lab-style')?.includes('dark')
}

/**
 * Retrieves the stream information from the DOM based on the provided room and settings.
 * @param room - The room identifier.
 * @param settings - The settings object.
 * @returns The stream information.
 */
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

/**
 * Parses the given danmaku string using the provided regex pattern.
 * 
 * @param danmaku - The danmaku string to parse.
 * @param regex - The regex pattern to use for parsing.
 * @returns The parsed danmaku string, or undefined if the input danmaku is undefined or empty.
 */
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

// TODO: this become secondary function, primary function use fetch room info instead
/**
 * Checks if the current page is a theme page.
 * @returns {boolean} True if the current page is a theme page, false otherwise.
 */
export function isThemePage(): boolean {
    return location.pathname.indexOf('blanc') > -1 && location.search.indexOf('liteVersion') > -1
}

// TODO: this become secondary function, primary function use fetch room info instead
/**
 * Checks if the current page is a theme page out of live page.
 * @returns {boolean} True if the current page is a live page, false otherwise.
 */
export function isOutThemedPage(): boolean {
    return !document.documentElement.hasAttribute('lab-style')
}