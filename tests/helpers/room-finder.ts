import { type Browser } from "@playwright/test";
import { existsSync } from "node:fs";
import fs from 'node:fs/promises';
import BilbiliApi, { type LiveRoomInfo } from "./bilibili-api";
import BilibiliPage from "./bilibili-page";
import logger from "./logger";

export type RoomTypeChecker = (page: BilibiliPage) => Promise<boolean>

export default class RoomTypeFinder {

    private readonly checkers: { type: string, checker: RoomTypeChecker }[] = []
    private readonly cached: Record<string, LiveRoomInfo> = {}
    private readonly browser: Browser
    private readonly api: BilbiliApi

    constructor(broser: Browser, api: BilbiliApi) {
        this.browser = broser
        this.api = api
        this.registerRoomType('404', async page => page.page.url().includes('www.bilibili.com/404'))
        this.registerRoomType('offline', page => page.isStatus('offline'))
        this.registerRoomType('theme', page => page.isThemePage())
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
            if (await checker(page)) {
                logger.info(`room ${page.roomid} type is: ${type}`)
                return type
            }
        }
        logger.info(`room ${page.roomid} type is: normal`)
        return 'normal'
    }

    isCached(check: string): boolean {
        return !!this.cached[check]
    }

    async validateCache(info: LiveRoomInfo, check: string): Promise<void> {
        if (!this.cached[check]) return
        const p = await this.browser.newPage()
        await using page = new BilibiliPage(p, this.api)
        await page.enterToRoom(info)
        const roomType = await this.getRoomType(page)
        if (roomType === check) return
        console.info(`${page.roomid} 的緩存策略失效，已清除其 ${check} 的緩存。`)
        delete this.cached[check]
        await this.deleteToFileCache(check)
    }

    async findRoomType(check: string, rooms: Generator<LiveRoomInfo>): Promise<LiveRoomInfo | null> {
        const p = await this.browser.newPage()
        await using page = new BilibiliPage(p, this.api)
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

    async findRoomTypeWithCache(check: string, rooms: Generator<LiveRoomInfo>, saveFile: boolean = false): Promise<LiveRoomInfo | null> {
        if (this.cached[check]) {
            logger.debug(`已從緩存中找到屬於 ${check} 類型的直播房間: ${this.cached[check].roomid}`)
            return this.cached[check]
        }
        logger.debug(`正在搜索屬於 ${check} 類型的直播房間...`)
        const info = await this.findRoomType(check, rooms)
        this.cached[check] = info
        if (saveFile) {
            await this.writeToFileCache(check, info)
            logger.info(`已成功緩存屬於 ${check} 類型的直播房間: ${info?.roomid ?? '無'}`)
        }
        return info
    }

    async deleteToFileCache(check: string): Promise<void> {
        if (existsSync(`room.${check}.cache.json`)) {
            await fs.unlink(`room.${check}.cache.json`)
        }
    }


    async writeToFileCache(check: string, room: LiveRoomInfo | null): Promise<void> {
        await fs.writeFile(`room.${check}.cache.json`, room ? JSON.stringify(room) : JSON.stringify({}))
    }

    async loadFromFileCache(check: string): Promise<LiveRoomInfo | 'none' | 'null'> {
        try {
            if (!existsSync(`room.${check}.cache.json`)) {
                logger.debug(`找不到 ${check} 的緩存檔案`)
                return 'null'
            }
            const data = await fs.readFile(`room.${check}.cache.json`)
            const room = JSON.parse(data.toString()) as LiveRoomInfo
            if (room.roomid === undefined) {
                logger.debug(`緩存檔案 ${check} 返回無直播間`)
                return 'none'
            }
            this.cached[check] = room
            return room
        } catch (error) {
            logger.debug(`讀取 ${check} 的緩存檔案時錯誤: `, error)
            return 'null'
        }
    }
}