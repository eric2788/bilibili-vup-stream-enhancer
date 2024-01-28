import BilibiliPage from "@tests/helpers/bilibili-page";
import { Strategy } from "@tests/utils/misc";
import { extensionBase } from "./base";
import type { PageFrame } from "@tests/helpers/page-frame";
import logger from "@tests/helpers/logger";
import type { LiveRoomInfo } from "@tests/utils/bilibili";

export type ContentOptions = {
    isThemeRoom: boolean
    roomId: number
    maxRoomRetries: number
}

export type ContentFixtures = {
    room: BilibiliPage
    themeRoom: BilibiliPage
    content: PageFrame // page for live room (can be iframe)
}


export const test = extensionBase.extend<ContentFixtures & ContentOptions>({

    isThemeRoom: [ false, { option: true }],
    maxRoomRetries: [30, { option: true }],

    content: async ({ room, page }, use) => {
        page.frames().map(f => logger.debug(f.url()))
        const maybeFrame = await room.getContentLocator()
        test.skip(maybeFrame === null, `此頁面 ${room.page.url()} 不是主題頁面，無法取得 iframe`)
        await maybeFrame.locator('body').scrollIntoViewIfNeeded()
        await use(maybeFrame)
    },

    room: [
        async ({ page, isThemeRoom, rooms, maxRoomRetries }, use) => {
            const iterator = Strategy.random(rooms, maxRoomRetries || rooms.length)
            let next = iterator.next()
            using bilibiliPage = new BilibiliPage(page, next.value)
            while (isThemeRoom !== (await checkThemePage(bilibiliPage, next.value))) {
                logger.info(`房間 ${bilibiliPage.roomid} ${isThemeRoom ? '是' : '不是'}大海報的房間, 正在尋找下一房間...`)
                next = iterator.next()
                test.skip(next.done, `找不到${isThemeRoom ? '' : '不是'}大海報的房間。`)
                await page.waitForTimeout(500)
            }
            await use(bilibiliPage)
        },
        { auto: true, timeout: 0 }
    ],

    // force to theme room
    themeRoom: [
        async ({ page, room, rooms, maxRoomRetries }, use) => {
            // already theme page
            if (await room.isThemePage()) {
                await use(room)
                return
            }
            // go to blank page first then go to theme page
            await page.goto('about:blank')
            const iterator = Strategy.random(rooms, maxRoomRetries || rooms.length)
            let next = iterator.next()
            while (!await checkThemePage(room, next.value)) {
                logger.info(`房間 ${room.roomid} 不是大海報的房間, 正在尋找下一房間...`)
                next = iterator.next()
                test.skip(next.done, '找不到大海報的房間。')
                await page.waitForTimeout(500)
            }
            await use(room)
        },
        { timeout: 0}
    ]

})

export const expect = test.expect

async function checkThemePage(page: BilibiliPage, info: LiveRoomInfo): Promise<boolean> {
    await page.enterToRoom(info)
    return await page.isThemePage()
}