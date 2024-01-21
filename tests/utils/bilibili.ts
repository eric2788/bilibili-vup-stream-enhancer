import type { Page } from "@playwright/test";

export interface LiveRoomInfo {
    roomid: number;
    uid: number;
    title: string;
    uname: string;
    online: number;
    user_cover: string;
    user_cover_flag: number;
    system_cover: string;
    cover: string;
    show_cover: string;
    link: string;
    face: string;
    parent_id: number;
    parent_name: string;
    area_id: number;
    area_name: string;
}

export async function getLiveRooms(page: number = 1): Promise<LiveRoomInfo[]> {
    const res = await fetch(`https://api.live.bilibili.com/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=9&area_id=0&sort_type=online&page=${page}`)
    if (!res.ok) throw new Error(`failed to fetch bilibili live room list: ${res.statusText}`)
    const data = await res.json()
    if (data.code !== 0) throw new Error(`failed to fetch bilibili live room list: ${data.message}`)
    return data.data.list as LiveRoomInfo[]
}

export function sendFakeBLiveMessage(page: Page, cmd: string, command: object) {
    return page.evaluate(([cmd, command]) => {
        const eventId = window.crypto.randomUUID()
        console.info(`[bilibili-vup-stream-enhancer-test] send fake blive message: ${cmd}`, command)
        window.postMessage({
            source: 'bilibili-vup-stream-enhancer',
            data: {
                command: 'blive-ws',
                body: { cmd, command, eventId }
            }
        }, '*')
    }, [cmd, command])
}