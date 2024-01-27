import type { Frame, Locator, Page } from "@playwright/test";
import { getLiveRooms, sendFakeBLiveMessage, type LiveRoomInfo } from "../utils/bilibili";


export class BilibiliPage implements LiveRoomInfo {

    readonly page: Page

    readonly roomid: number;
    readonly uid: number;
    readonly title: string;
    readonly uname: string;
    readonly online: number;
    readonly user_cover: string;
    readonly user_cover_flag: number;
    readonly system_cover: string;
    readonly cover: string;
    readonly show_cover: string;
    readonly link: string;
    readonly face: string;
    readonly parent_id: number;
    readonly parent_name: string;
    readonly area_id: number;
    readonly area_name: string;

    constructor(page: Page, info: LiveRoomInfo) {
        Object.assign(this, info)
        this.page = page
    }

    async enterToRoom() {
        await this.page.goto("https://live.bilibili.com/" + this.roomid, { waitUntil: 'domcontentloaded', timeout: 10000 })
        await this.page.waitForTimeout(1000)
    }

    async isThemePage(): Promise<boolean> {
        return this.page.evaluate(() => !window.document.documentElement.hasAttribute('lab-style'))
    }

    async getContentLocator(): Promise<Page | Frame> {
        const isTheme = await this.isThemePage()
        if (isTheme) {
            await this.page.waitForTimeout(2000)
            return this.page.frame({ url: `https://live.bilibili.com/blanc/${this.roomid}?liteVersion=true` })
        }
        return this.page
    }

    async sendDanmaku(danmaku: string): Promise<void> {
        const f = await this.getContentLocator()
        return sendFakeBLiveMessage(f, 'DANMU_MSG', {
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
    }
}


export default BilibiliPage