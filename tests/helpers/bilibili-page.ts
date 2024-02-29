import type { Page } from "@playwright/test";
import { sendFakeBLiveMessage } from "@tests/utils/bilibili";
import { randomNumber } from "@tests/utils/misc";
import type BilbiliApi from "./bilibili-api";
import type { LiveRoomInfo } from "./bilibili-api";
import DismissLoginDialogListener from "./listeners/dismiss-login-dialog-listener";
import type { PageListener } from "./listeners/type";
import logger from "./logger";
import { type PageFrame } from "./page-frame";
//import DismissUserTutorialListener from "./listeners/dismiss-user-tutorial-listener";


export class BilibiliPage implements AsyncDisposable {

    private readonly listeners: Set<PageListener> = new Set([
        new DismissLoginDialogListener(),
        //new DismissUserTutorialListener()
    ])

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
        await this.startListeners()
    }

    async checkIfNotSupport(): Promise<boolean> {
        const p = await this.getContentLocator()
        return await p.getByText('您使用的浏览器版本偏低，为保障您的直播观看体验').isVisible()
    }

    async isStatus(status: 'online' | 'offline'): Promise<boolean> {
        return await this.api.getRoomStatus(this.info.roomid) === status
    }

    async isThemePage(): Promise<boolean> {
        return this.page.frame({ url: /^(http)s:\/\/live\.bilibili\.com\/blanc\/(\d+)\?liteVersion=true&live_from=(\d+)/ }) !== null
    }

    async getContentLocator(): Promise<PageFrame> {
        const isTheme = await this.isThemePage()
        if (isTheme) {
            await this.page.waitForTimeout(700)
            logger.info('returned frame for content locator')
            return this.page.frame({ url: /^(http)s:\/\/live\.bilibili\.com\/blanc\/(\d+)\?liteVersion=true&live_from=(\d+)/ })
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
        await this.startListeners()
        return this.getContentLocator()
    }

    async startListeners(): Promise<void> {
        const p = await this.getContentLocator()
        this.listeners.forEach(listener => listener.start(p))
    }

    async close() {
        await this[Symbol.asyncDispose]()
    }

    async [Symbol.asyncDispose](): Promise<void> {
        logger.debug('disposing bilibili page')
        this.listeners.forEach(listener => listener.stop())
        if (this.page.isClosed()) return
        await this.page.close()
    }
}


export default BilibiliPage