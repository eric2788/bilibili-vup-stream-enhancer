import type { Page } from "@playwright/test";
import { sendFakeBLiveMessage, type LiveRoomInfo } from "../utils/bilibili";
import logger from "./logger";
import { isClosed, type PageFrame } from "./page-frame";


export class BilibiliPage implements LiveRoomInfo, Disposable {

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
        if (info) Object.assign(this, info)
        await this.page.goto("https://live.bilibili.com/" + this.roomid, { waitUntil: 'domcontentloaded', timeout: 10000 })
        await this.page.waitForTimeout(3000)
        await this.startDismissLoginDialogListener()
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
                    1313131313, // 随机数，前端叫作弹幕ID，可能是去重用的
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
                    4545454545,
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
                loginDialogDismissButton.click({ timeout: 500, force: true })
                    .then(() => logger.debug('dismissed login dialog'))
                    .catch(err => logger.warn(err.message))
            }
        }, 1000)
        this.listener = timeout
    }

    async close() {
        await this[Symbol.dispose]()
    }

    async [Symbol.dispose](): Promise<void> {
        logger.debug('disposing bilibili page')
        this.listener && clearInterval(this.listener)
        await this.page.close()
    }
}


export default BilibiliPage