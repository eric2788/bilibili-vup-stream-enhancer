import type { Browser } from "@playwright/test";
import type { LiveRoomInfo } from "@tests/utils/bilibili";
import BilibiliPage from "./bilibili-page";
import logger from "./logger";

export type RoomTypeChecker = (page: BilibiliPage) => Promise<boolean>

export default class RoomTypeCacher {

    private readonly checkers: Record<string, RoomTypeChecker> = {}
    private readonly cached: Record<string, LiveRoomInfo> = {}
    private readonly browser: Browser

    constructor(context: Browser) {
        this.browser = context
    }

    registerRoomType(name: string, checker: RoomTypeChecker) {
        this.checkers[name] = checker
    }

    async getRoomType(page: BilibiliPage): Promise<string> {
        for (const [name, checker] of Object.entries(this.checkers)) {
            if (await checker(page)) return name
        }
        return 'normal'
    }

    async findRoomType(check: string, rooms: Generator<LiveRoomInfo>, useCache: boolean = true): Promise<LiveRoomInfo | null> {
        if (useCache && this.cached[check]) return this.cached[check]
        const page = await this.browser.newPage()
        using biliPage = new BilibiliPage(page)
        for (const room of rooms) {
            await biliPage.enterToRoom(room)
            const roomType = await this.getRoomType(biliPage)
            if (roomType === check) {
                logger.info(`cached ${check} room ${room.roomid}`)
                this.cached[check] = room
                return room
            }
        }
        logger.info(`cached ${check} room null`)
        this.cached[check] = null
        return null
    }

}