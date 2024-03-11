import type { Page } from "@playwright/test";
import { sendFakeBLiveMessage } from "@tests/utils/bilibili";
import { randomNumber } from "@tests/utils/misc";
import type BilbiliApi from "./bilibili-api";
import type { LiveRoomInfo } from "./bilibili-api";
import DismissLoginDialogListener from "./listeners/dismiss-login-dialog-listener";
import type { PageListener } from "./listeners/type";
import logger from "./logger";
import { type PageFrame } from "./page-frame";

/**
 * Bilibili页面类，实现了AsyncDisposable接口。
 */
export class BilibiliPage implements AsyncDisposable {

    /**
     * 页面监听器集合。
     */
    private readonly listeners: Set<PageListener> = new Set([
        new DismissLoginDialogListener(),
    ])

    /**
     * 构造函数。
     * @param page 页面对象。
     * @param api Bilibili API对象。
     * @param info 直播间信息。
     */
    constructor(
        public readonly page: Page, 
        private readonly api: BilbiliApi, 
        public info?: LiveRoomInfo
    ) {}

    /**
     * 进入直播间。
     * @param info 直播间信息。
     */
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

    /**
     * 检查是否不支持。
     * @returns 如果不支持返回true，否则返回false。
     */
    async checkIfNotSupport(): Promise<boolean> {
        const p = await this.getContentLocator()
        return await p.getByText('您使用的浏览器版本偏低').isVisible()
    }

    /**
     * 检查直播间状态。
     * @param status 直播间状态，可选值为'online'或'offline'。
     * @returns 如果直播间状态与给定状态相同返回true，否则返回false。
     */
    async isStatus(status: 'online' | 'offline'): Promise<boolean> {
        return await this.api.getRoomStatus(this.info.roomid) === status
    }

    /**
     * 检查是否为主题页面。
     * @returns 如果是主题页面返回true，否则返回false。
     */
    async isThemePage(): Promise<boolean> {
        return this.page.frame({ url: /^(http)s:\/\/live\.bilibili\.com\/blanc\/(\d+)\?liteVersion=true&live_from=(\d+)/ }) !== null
    }

    /**
     * 获取内容定位器。
     * @returns 页面或帧对象。
     */
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

    /**
     * 模拟发送弹幕。
     * @param danmaku 弹幕内容
     * @param uid 弹幕发送者用户ID。
     */
    async sendDanmaku(danmaku: string, uid: number = randomNumber()): Promise<void> {
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
                    uid,
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
                undefined,
                undefined
            ],
            dm_v2: ""
        })
        await this.page.waitForTimeout(1000)
    }

    /**
     * 模拟发送醒目留言。
     * @param user 用户名。
     * @param price 价格。
     * @param message 消息内容。
     * @param uid 用户ID。
     */
    async sendSuperChat(user: string, price: number, message: string, uid: number = randomNumber()): Promise<void> {
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
                uid: uid,
                price: price,
                message: message,
                start_time: Date.now()
            }
        })
        await this.page.waitForTimeout(1000)
    }

    /**
     * 重新加载并获取内容定位器。
     * @returns 页面或帧对象。
     */
    async reloadAndGetLocator(): Promise<PageFrame> {
        await this.page.reload({ waitUntil: 'domcontentloaded' })
        await this.page.waitForTimeout(3000)
        await this.startListeners()
        return this.getContentLocator()
    }

    /**
     * 启动监听器。
     */
    async startListeners(): Promise<void> {
        const p = await this.getContentLocator()
        this.listeners.forEach(listener => listener.start(p))
    }

    /**
     * 关闭页面。
     */
    async close() {
        await this[Symbol.asyncDispose]()
    }

    /**
     * 释放资源。
     */
    async [Symbol.asyncDispose](): Promise<void> {
        logger.debug('disposing bilibili page')
        this.listeners.forEach(listener => listener.stop())
        if (this.page.isClosed()) return
        await this.page.close()
    }
}


export default BilibiliPage