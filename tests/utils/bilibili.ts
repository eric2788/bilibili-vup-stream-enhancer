import type { Frame, Page } from "@playwright/test";
import logger from "@tests/helpers/logger";
import type { PageFrame } from "@tests/helpers/page-frame";

export interface LiveRoomInfo {
    roomid: number;
    uid: number;
    title: string;
    uname: string;
    online: number;
    cover: string;
    face: string;
    parent_id: number;
    parent_name: string;
    area_id: number;
    area_name: string;
}

export async function findLiveRoom(room: number): Promise<LiveRoomInfo | null> {
    const res = await fetch('https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id='+room)
    if (!res.ok) throw new Error(`failed to fetch bilibili live room: ${res.statusText}`)
    const data = await res.json()
    if (data.code !== 0) return null
    return {
        roomid: data.data.room_info.room_id,
        uid: data.data.room_info.uid,
        title: data.data.room_info.title,
        uname: data.data.anchor_info.base_info.uname,
        online: data.data.room_info.online,
        cover: data.data.room_info.cover,
        face: data.data.anchor_info.base_info.face,
        parent_id: data.data.room_info.parent_area_id,
        parent_name: data.data.room_info.parent_area_name,
        area_id: data.data.room_info.area_id,
        area_name: data.data.room_info.area_name
    }
}

export async function getLiveRoomsRange(pages: number): Promise<LiveRoomInfo[]> {
    const rooms: LiveRoomInfo[] = []
    for (let i = 0; i < pages; i++) {
        const page = await getLiveRooms(i + 1)
        await new Promise(r => setTimeout(r, 500))
        rooms.push(...page)
    }
    return rooms
}

export async function getLiveRooms(page: number = 1): Promise<LiveRoomInfo[]> {
    const res = await fetch(`https://api.live.bilibili.com/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=9&area_id=0&sort_type=online&page=${page}`)
    if (!res.ok) throw new Error(`failed to fetch bilibili live room list: ${res.statusText}`)
    const data = await res.json()
    if (data.code !== 0) throw new Error(`failed to fetch bilibili live room list: ${data.message}`)
    return data.data.list as LiveRoomInfo[]
}

export function sendFakeBLiveMessage(content: PageFrame, cmd: string, command: object) {
    logger.debug('sending blive fake message into: ', cmd, content.url())
    return content.evaluate(([cmd, command]) => {
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

export function receiveOneBLiveMessage(content: PageFrame, cmd: string = ''): Promise<any> {
    logger.debug('waiting for blive fake message: ', cmd, content.url())
    return content.evaluate(([cmd]) => {
        return new Promise((res, rej) => {
            window.addEventListener('message', (e) => {
                if (e.source !== window) return
                if (e.data.source === 'bilibili-vup-stream-enhancer' && e.data.data.command === 'blive-ws') {
                    const content = e.data.data.body
                    if (cmd && content.cmd !== cmd) return
                    res(content)
                }
            })
            setTimeout(() => rej(new Error('timeout')), 60000)
        })
    }, [cmd])
}