import { request, type APIRequestContext } from "@playwright/test";
import { sendInternal } from "~background/messages";
import type { StreamUrls } from "~background/messages/get-stream-urls";
import type { V1Response, StreamUrlResponse } from "~types/bilibili";
import logger from "./logger";

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
    private async fetch<T = any>(path: string): Promise<T> {
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


    /**
     * Retrieves the stream URLs for a given room.
     * @param room - The room ID or room number.
     * @returns A promise that resolves to an array of stream URLs.
     * @throws An error if the room is hidden, locked, or encrypted without verification.
     * @throws An error if there are no available stream URLs.
     */
    async getStreamUrls(room: number | string): Promise<StreamUrls> {
        const res = await this.fetch<V1Response<StreamUrlResponse>>(`/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${room}&protocol=0,1&format=0,2&codec=0,1&qn=10000&platform=web&ptype=16`)
        if (res.code !== 0) throw new Error(res.message)
        const data = res.data

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
        const names = data?.playurl_info?.playurl?.g_qn_desc ?? []

        logger.debug('stream urls:', JSON.stringify(streams, null, 2))

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

}