import { chromium, type Browser, type Page } from "@playwright/test";
import type { LiveRoomInfo } from "@tests/utils/bilibili";
import { deferAsync } from "@tests/utils/misc";
import BilibiliPage from "./bilibili-page";
import logger from "./logger";

export type RoomTypeChecker = (page: BilibiliPage) => Promise<boolean>

export default class RoomTypeFinder {

    private readonly checkers: { type: string, checker: RoomTypeChecker }[] = []
    private readonly cached: Record<string, LiveRoomInfo> = {}
    private readonly browser: Browser

    constructor(broser: Browser) {
        this.browser = broser
    }

    registerRoomType(name: string, checker: RoomTypeChecker) {
        if (this.checkers.find(c => c.type === name)) {
            console.warn(`Room checker type ${name} already registered.`)
            return
        }
        this.checkers.push({ type: name, checker })
    }

    async getRoomType(page: BilibiliPage): Promise<string> {
        for (const { type, checker } of this.checkers) {
            if (await checker(page)) return type
        }
        return 'normal'
    }

    isCached(check: string): boolean {
        return !!this.cached[check]
    }

    async validateCache(page: BilibiliPage, check: string): Promise<void> {
        if (!this.cached[check]) return
        const roomType = await this.getRoomType(page)
        if (roomType === check) return
        logger.info(`${page.roomid} 的緩存策略失效，已清除其 ${check} 的緩存。`)
        delete this.cached[check]
    }

    async findRoomType(check: string, rooms: Generator<LiveRoomInfo>): Promise<LiveRoomInfo | null> {
        const p = await this.browser.newPage()
        await using page = new BilibiliPage(p)
        for (const room of rooms) {
            await page.enterToRoom(room)
            const roomType = await this.getRoomType(page)
            if (roomType === check) {
                logger.info(`成功搜索到屬於 ${check} 類型的直播房間: ${page.roomid}`)
                return room
            }
        }
        logger.info(`找不到屬於 ${check} 類型的直播房間`)
        return null
    }

    findRoomTypeFromCache(check: string): LiveRoomInfo | undefined {
        logger.debug(`${check} 在緩存的直播間: `, this.cached[check])
        return this.cached[check]
    }

    async findRoomTypeWithCache(check: string, rooms: Generator<LiveRoomInfo>): Promise<LiveRoomInfo | null> {
        if (this.cached[check]) {
            logger.debug(`已從緩存中找到屬於 ${check} 類型的直播房間: ${this.cached[check].roomid}`)
            return this.cached[check]
        }
        logger.debug(`正在搜索屬於 ${check} 類型的直播房間...`)
        const info = await this.findRoomType(check, rooms)
        if (info) this.cached[check] = info
        return info
    }

}