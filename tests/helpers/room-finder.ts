import { type Browser } from "@playwright/test";
import { existsSync } from "node:fs";
import fs from 'node:fs/promises';
import BilbiliApi, { type LiveRoomInfo } from "./bilibili-api";
import BilibiliPage from "./bilibili-page";
import logger from "./logger";

export type RoomTypeChecker = (page: BilibiliPage) => Promise<boolean>

/**
 * 房间类型查找器
 */
export default class RoomTypeFinder {
    private readonly checkers: { type: string, checker: RoomTypeChecker }[] = []
    private readonly cached: Record<string, LiveRoomInfo> = {}

    /**
     * 创建一个房间类型查找器实例
     * @param browser 浏览器实例
     * @param api Bilibili API 实例
     */
    constructor(
        private readonly browser: Browser,
        private readonly api: BilbiliApi
    ) {
        this.registerRoomType('404', async page => page.page.url().includes('www.bilibili.com/404'))
        this.registerRoomType('offline', page => page.isStatus('offline'))
        this.registerRoomType('theme', page => page.isThemePage())
    }

    /**
     * 注册房间类型
     * @param name 类型名称
     * @param checker 类型检查器
     */
    registerRoomType(name: string, checker: RoomTypeChecker) {
        if (this.checkers.find(c => c.type === name)) {
            console.warn(`房间类型 ${name} 已经注册。`)
            return
        }
        this.checkers.push({ type: name, checker })
    }

    /**
     * 获取房间类型
     * @param page Bilibili 页面
     * @returns 房间类型
     */
    async getRoomType(page: BilibiliPage): Promise<string> {
        for (const { type, checker } of this.checkers) {
            if (await checker(page)) {
                logger.info(`房间 ${page.info.roomid} 的类型是: ${type}`)
                return type
            }
        }
        logger.info(`房间 ${page.info.roomid} 的类型是: normal`)
        return 'normal'
    }

    /**
     * 检查缓存是否存在
     * @param check 检查项
     * @returns 如果缓存存在则返回 true，否则返回 false
     */
    isCached(check: string): boolean {
        return !!this.cached[check]
    }

    /**
     * 验证缓存是否有效
     * @param info 直播间信息
     * @param check 检查项
     */
    async validateCache(info: LiveRoomInfo, check: string): Promise<void> {
        if (!this.cached[check]) return
        const p = await this.browser.newPage()
        await using page = new BilibiliPage(p, this.api)
        await page.enterToRoom(info)
        const roomType = await this.getRoomType(page)
        if (roomType === check) return
        console.info(`${page.info.roomid} 的缓存策略失效，已清除其 ${check} 的缓存。`)
        delete this.cached[check]
        await this.deleteToFileCache(check)
    }

    /**
     * 查找房间类型
     * @param check 检查项
     * @param rooms 直播间生成器
     * @returns 如果找到符合条件的直播间则返回直播间信息，否则返回 null
     */
    async findRoomType(check: string, rooms: Generator<LiveRoomInfo>): Promise<LiveRoomInfo | null> {
        const p = await this.browser.newPage()
        await using page = new BilibiliPage(p, this.api)
        for (const room of rooms) {
            await page.enterToRoom(room)
            const roomType = await this.getRoomType(page)
            if (roomType === check) {
                logger.info(`成功搜索到属于 ${check} 类型的直播房间: ${page.info.roomid}`)
                return room
            }
        }
        logger.info(`找不到属于 ${check} 类型的直播房间`)
        return null
    }

    /**
     * 从缓存中查找房间类型
     * @param check 检查项
     * @returns 如果缓存中存在符合条件的直播间则返回直播间信息，否则返回 undefined
     */
    findRoomTypeFromCache(check: string): LiveRoomInfo | undefined {
        logger.debug(`${check} 在缓存的直播间: `, this.cached[check])
        return this.cached[check]
    }

    /**
     * 使用缓存查找房间类型
     * @param check 检查项
     * @param rooms 直播间生成器
     * @param saveFile 是否保存到文件缓存
     * @returns 如果找到符合条件的直播间则返回直播间信息，否则返回 null
     */
    async findRoomTypeWithCache(check: string, rooms: Generator<LiveRoomInfo>, saveFile: boolean = false): Promise<LiveRoomInfo | null> {
        if (this.cached[check]) {
            logger.debug(`已从缓存中找到属于 ${check} 类型的直播房间: ${this.cached[check].roomid}`)
            return this.cached[check]
        }
        logger.debug(`正在搜索属于 ${check} 类型的直播房间...`)
        const info = await this.findRoomType(check, rooms)
        this.cached[check] = info
        if (saveFile) {
            await this.writeToFileCache(check, info)
            logger.info(`已成功缓存属于 ${check} 类型的直播房间: ${info?.roomid ?? '无'}`)
        }
        return info
    }

    /**
     * 删除文件缓存
     * @param check 检查项
     */
    async deleteToFileCache(check: string): Promise<void> {
        if (existsSync(`room.${check}.cache.json`)) {
            await fs.unlink(`room.${check}.cache.json`)
        }
    }

    /**
     * 将房间信息写入文件缓存
     * @param check 检查项
     * @param room 直播间信息
     */
    async writeToFileCache(check: string, room: LiveRoomInfo | null): Promise<void> {
        await fs.writeFile(`room.${check}.cache.json`, room ? JSON.stringify(room) : JSON.stringify({}))
    }

    /**
     * 从文件缓存中加载房间信息
     * @param check 检查项
     * @returns 如果缓存文件存在则返回房间信息，如果缓存文件中无直播间则返回 'none'，如果读取缓存文件出错则返回 'null'
     */
    async loadFromFileCache(check: string): Promise<LiveRoomInfo | 'none' | 'null'> {
        try {
            if (!existsSync(`room.${check}.cache.json`)) {
                logger.debug(`找不到 ${check} 的缓存文件`)
                return 'null'
            }
            const data = await fs.readFile(`room.${check}.cache.json`)
            const room = JSON.parse(data.toString()) as LiveRoomInfo
            if (room.roomid === undefined) {
                logger.debug(`缓存文件 ${check} 返回无直播间`)
                return 'none'
            }
            this.cached[check] = room
            return room
        } catch (error) {
            logger.debug(`读取 ${check} 的缓存文件时错误: `, error)
            return 'null'
        }
    }
}