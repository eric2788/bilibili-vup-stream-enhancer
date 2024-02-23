import type { Page } from "@playwright/test";
import logger from "./logger";
import { isClosed, type PageFrame } from "./page-frame";
import { randomNumber } from "@tests/utils/misc";
import type BilbiliApi from "./bilibili-api";
import type { LiveRoomInfo } from "./bilibili-api";
import { sendFakeBLiveMessage } from "@tests/utils/bilibili";


export class BilibiliPage implements AsyncDisposable {

    private listener: NodeJS.Timeout | null

    constructor(
        public readonly page: Page, 
        private readonly api: BilbiliApi, 
        public info?: LiveRoomInfo
    ) {}

    async enterToRoom(info?: LiveRoomInfo): Promise<void> {
        if (!info && !this.info) throw new Error('no room to enter')
        if (info) {
            if (this.info?.roomid === info.roomid) return
            this.info = info
        }
        await this.page.goto("https://live.bilibili.com/" + this.info.roomid, { waitUntil: 'domcontentloaded', timeout: 30000 })
        await this.page.waitForTimeout(3000)
        await this.startDismissLoginDialogListener()
    }

    async checkIfNotSupport(): Promise<boolean> {
        const p = await this.getContentLocator()
        return await p.getByText('您使用的浏览器版本偏低，为保障您的直播观看体验').isVisible()
    }

    async isStatus(status: 'online' | 'offline'): Promise<boolean> {
        return await this.api.getRoomStatus(this.info.roomid) === status
    }

    async isThemePage(): Promise<boolean> {
        return this.page.frame({ url: `https://live.bilibili.com/blanc/${this.info.roomid}?liteVersion=true` }) !== null
    }

    async getContentLocator(): Promise<PageFrame> {
        const isTheme = await this.isThemePage()
        if (isTheme) {
            await this.page.waitForTimeout(700)
            logger.info('returned frame for content locator')
            return this.page.frame({ url: `https://live.bilibili.com/blanc/${this.info.roomid}?liteVersion=true` })
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