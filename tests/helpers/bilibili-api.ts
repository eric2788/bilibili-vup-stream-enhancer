import { request, type APIRequestContext } from "@playwright/test";

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


export default class BilbiliApi {

    static async init(): Promise<BilbiliApi> {
        const context = await request.newContext({
            baseURL: 'https://api.live.bilibili.com'
        })
        return new BilbiliApi(context)
    }

    constructor(private readonly context: APIRequestContext) { }

    private async fetch(path: string): Promise<any> {
        const res = await this.context.get(path)
        if (!res.ok()) throw new Error(`failed to fetch bilibili api: ${res.statusText()}`)
        return await res.json()
    }

    async getRoomStatus(room: number): Promise<'online' | 'offline'> {
        const data = await this.fetch('/room/v1/Room/room_init?id=' + room)
        if (data.code !== 0) throw new Error(`bili error: ${data.message}`)
        return data.data.live_status === 1 ? 'online' : 'offline'
    }

    async findLiveRoom(room: number): Promise<LiveRoomInfo | null> {
        const data = await this.fetch('/xlive/web-room/v1/index/getInfoByRoom?room_id=' + room)
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

    async getLiveRoomsRange(pages: number): Promise<LiveRoomInfo[]> {
        const rooms: LiveRoomInfo[] = []
        for (let i = 0; i < pages; i++) {
            const page = await this.getLiveRooms(i + 1)
            await new Promise(r => setTimeout(r, 500))
            rooms.push(...page)
        }
        return rooms
    }

    async getLiveRooms(page: number = 1): Promise<LiveRoomInfo[]> {
        const data = await this.fetch(`/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=9&area_id=0&sort_type=online&page=${page}`)
        if (data.code !== 0) throw new Error(`failed to fetch bilibili live room list: ${data.message}`)
        return data.data.list as LiveRoomInfo[]
    }

}