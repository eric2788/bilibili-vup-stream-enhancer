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


/**
 * Represents the Bilibili API.
 */
export default class BilbiliApi {

    /**
     * 初始化Bilibili API。
     * @returns 一个解析为BilbiliApi实例的Promise。
     */
    static async init(): Promise<BilbiliApi> {
        const context = await request.newContext({
            baseURL: 'https://api.live.bilibili.com'
        })
        return new BilbiliApi(context)
    }

    /**
     * 构造BilbiliApi的新实例。
     * @param context - API请求的上下文。
     */
    constructor(private readonly context: APIRequestContext) { }

    /**
     * 从指定路径获取数据。
     * @param path - 要获取数据的路径。
     * @returns 一个解析为获取的数据的Promise。
     * @throws 如果获取操作失败，则抛出错误。
     */
    private async fetch(path: string): Promise<any> {
        const res = await this.context.get(path)
        if (!res.ok()) throw new Error(`获取bilibili API失败：${res.statusText()}`)
        return await res.json()
    }

    /**
     * 获取房间的状态。
     * @param room - 房间号。
     * @returns 一个解析为房间状态（'online'或'offline'）的Promise。
     * @throws 如果无法获取房间状态，则抛出错误。
     */
    async getRoomStatus(room: number): Promise<'online' | 'offline'> {
        const data = await this.fetch('/room/v1/Room/room_init?id=' + room)
        if (data.code !== 0) throw new Error(`bili错误：${data.message}`)
        return data.data.live_status === 1 ? 'online' : 'offline'
    }

    /**
     * 查找直播房间的信息。
     * @param room - 房间号。
     * @returns 一个解析为直播房间信息的Promise，如果找不到房间则返回null。
     */
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

    /**
     * 获取一定范围内的直播房间。
     * @param pages - 要获取的页数。
     * @returns 一个解析为直播房间信息数组的Promise。
     */
    async getLiveRoomsRange(pages: number): Promise<LiveRoomInfo[]> {
        const rooms: LiveRoomInfo[] = []
        for (let i = 0; i < pages; i++) {
            const page = await this.getLiveRooms(i + 1)
            await new Promise(r => setTimeout(r, 500))
            rooms.push(...page)
        }
        return rooms
    }

    /**
     * 获取一页的直播房间。
     * @param page - 要获取的页码, 默认为 1。
     * @param area - 要获取的分区，默认为 9 (虚拟主播分区)。
     * @returns 一个解析为直播房间信息数组的Promise。
     * @throws 如果无法获取直播房间列表，则抛出错误。
     */
    async getLiveRooms(page: number = 1, area: number = 9): Promise<LiveRoomInfo[]> {
        const data = await this.fetch(`/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=${area}&area_id=0&sort_type=online&page=${page}`)
        if (data.code !== 0) throw new Error(`获取bilibili直播房间列表失败：${data.message}`)
        return data.data.list as LiveRoomInfo[]
    }

}