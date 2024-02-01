import type { Page } from "@playwright/test";
import { getRoomStatus, sendFakeBLiveMessage, type LiveRoomInfo } from "../utils/bilibili";
import logger from "./logger";
import { isClosed, type PageFrame } from "./page-frame";
import { randomNumber } from "@tests/utils/misc";


export class BilibiliPage implements LiveRoomInfo, AsyncDisposable {

    private listener: NodeJS.Timeout | null

    readonly page: Page

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

    constructor(page: Page, info?: LiveRoomInfo) {
        if (info) Object.assign(this, info)
        this.page = page
    }

    async enterToRoom(info?: LiveRoomInfo): Promise<void> {
        if (info) {
            if (info.roomid === this.roomid) return
            Object.assign(this, info)
        }
        await this.page.goto("https://live.bilibili.com/" + this.roomid, { waitUntil: 'domcontentloaded', timeout: 10000 })
        await this.page.waitForTimeout(3000)
        await this.startDismissLoginDialogListener()
    }

    async isStatus(status: 'online' | 'offline'): Promise<boolean> {
        return await getRoomStatus(this.roomid) === status
    }

    async isThemePage(): Promise<boolean> {
        return this.page.frame({ url: `https://live.bilibili.com/blanc/${this.roomid}?liteVersion=true` }) !== null
    }

    async getContentLocator(): Promise<PageFrame> {
        const isTheme = await this.isThemePage()
        if (isTheme) {
            await this.page.waitForTimeout(2000)
            logger.info('returned frame for content locator')
            return this.page.frame({ url: `https://live.bilibili.com/blanc/${this.roomid}?liteVersion=true` })
        }
        logger.info('returned page for content locator')
        return this.page
    }

    async sendDanmaku(danmaku: string): Promise<void> {
        const f = await this.getContentLocator()
        await sendFakeBLiveMessage(f, 'DANMU_MSG', {
            cmd: 'DANMU_MSG',
            info: [
                [
                    undefined,
                    undefined, // 弹幕显示模式（滚动、顶部、底部）
                    undefined, // 字体尺寸
                    undefined, // 颜色
                    Date.now(), // 时间戳（毫秒）
                    randomNumber(), // 随机数，前端叫作弹幕ID，可能是去重用的
                    undefined,
                    undefined, // 用户ID文本的CRC32
                    undefined,
                    0, // 是否礼物弹幕（节奏风暴）
                    undefined, // 右侧评论栏气泡
                    undefined,
                    undefined,
                    "{}", // 弹幕类型，0文本，1表情，2语音
                    "{}", // 表情参数
                    undefined,
                    undefined
                ],
                danmaku,
                [
                    randomNumber(),
                    "username",
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined
                ],
                undefined,
                [99, 99, 99, '', 99],
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],
            dm_v2: ""
        })
        await this.page.waitForTimeout(1000)
    }

    async sendSuperChat(user: string, price: number, message: string): Promise<void> {
        const f = await this.getContentLocator()
        await sendFakeBLiveMessage(f, 'SUPER_CHAT_MESSAGE', {
            cmd: 'SUPER_CHAT_MESSAGE',
            data: {
                id: randomNumber(),
                background_bottom_color: '#123456',
                background_image: '',
                background_color: '#787878',
                user_info: {
                    face: '',
                    name_color: '#444444',
                    uname: user
                },
                uid: randomNumber(),
                price: price,
                message: message,
                start_time: Date.now()
            }
        })
        await this.page.waitForTimeout(1000)
    }

    async reloadAndGetLocator(): Promise<PageFrame> {
        await this.page.reload({ waitUntil: 'domcontentloaded' })
        await this.page.waitForTimeout(3000)
        await this.startDismissLoginDialogListener()
        return this.getContentLocator()
    }

    async startDismissLoginDialogListener(): Promise<void> {
        if (this.listener) {
            logger.info('cleared last interval')
            clearInterval(this.listener)
        }
        const page = await this.getContentLocator()
        if (page === null) {
            logger.warn('page is null, cannot start dismiss login dialog listener')
            return
        }
        // 防止登录弹窗
        const timeout = setInterval(async () => {
            try {
                if (isClosed(page)) {
                    logger.info('frame/page is closed, dismiss login dialog listener aborted')
                    clearInterval(timeout)
                    return
                }
                const loginDialogDismissButton = page.locator('body > div.bili-mini-mask > div > div.bili-mini-close-icon')
                if (await loginDialogDismissButton.isVisible({ timeout: 500 })) {
                    if (isClosed(page)) {
                        logger.info('frame/page is closed, dismiss login dialog listener aborted')
                        clearInterval(timeout)
                        return
                    }
                    await loginDialogDismissButton.click({ timeout: 500, force: true })
                    logger.debug('dismissed login dialog')
                }
            } catch (err) {
                logger.warn('dismiss login dialog listener error', err)
            }
        }, 1000)
        this.listener = timeout
    }

    async close() {
        await this[Symbol.asyncDispose]()
    }

    async [Symbol.asyncDispose](): Promise<void> {
        logger.debug('disposing bilibili page')
        this.listener && clearInterval(this.listener)
        if (this.page.isClosed()) return
        await this.page.close()
    }
}


export default BilibiliPage