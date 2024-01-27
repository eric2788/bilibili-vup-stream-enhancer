import BilibiliPage from "@tests/helpers/bilibili-page";
import { extensionBase } from "./base";
import { findLiveRoom, getLiveRooms } from "@tests/utils/bilibili";
import { Strategy } from "@tests/utils/misc";
import type { Frame, Page } from "@playwright/test";

export type ContentOptions = {
    isThemeRoom: boolean
    roomId: number
    maxRoomRetries: number
}

export type ContentFixtures = {
    room: BilibiliPage
    themeRoom: BilibiliPage
    content: Page | Frame // page for live room (can be iframe)
}

export const test = extensionBase.extend<ContentFixtures & ContentOptions>({

    isThemeRoom: [ false, { option: true }],
    maxRoomRetries: [-1, { option: true }],

    content: async ({ room, logger, page }, use) => {
        page.frames().map(f => logger.debug(f.url()))
        const maybeFrame = await room.getContentLocator()
        test.skip(maybeFrame === null, `此頁面 ${room.page.url()} 不是主題頁面，無法取得 iframe`)
        await use(maybeFrame ?? page)
    },

    room: [
        async ({ page, isThemeRoom, rooms, maxRoomRetries: maxRoomRetry }, use) => {
            const iterator = Strategy.random(rooms, maxRoomRetry === -1 ? rooms.length : maxRoomRetry)
            let next = iterator.next()
            let bilibiliPage = new BilibiliPage(page, next.value)
            while (isThemeRoom !== (await checkThemePage(bilibiliPage))) {
                console.info(`房間 ${bilibiliPage.roomid} 不是${isThemeRoom ? '' : '不是'}大海報的房間, 正在尋找下一房間...`)
                next = iterator.next()
                test.skip(next.done, `找不到${isThemeRoom ? '' : '不是'}大海報的房間。`)
                bilibiliPage = new BilibiliPage(page, next.value)
            }
            await use(bilibiliPage)
        },
        { auto: true }
    ],

    // force to theme room
    themeRoom: async ({ page, room, rooms, maxRoomRetries: maxRoomRetry }, use) => {
        // already theme page
        if (await room.isThemePage()) {
            await use(room)
            return
        }
        // go to blank page first then go to theme page
        await page.goto('about:blank')
        const iterator = Strategy.serial(rooms, maxRoomRetry === -1 ? 10 : maxRoomRetry)
        let next = iterator.next()
        let bilibiliPage = new BilibiliPage(page, next.value)
        while (!await checkThemePage(bilibiliPage)) {
            next = iterator.next()
            test.skip(next.done, '找不到大海報的房間。')
            bilibiliPage = new BilibiliPage(page, next.value)
        }
        await use(bilibiliPage)
    }

})

export const expect = test.expect

async function checkThemePage(page: BilibiliPage): Promise<boolean> {
    await page.enterToRoom()
    return await page.isThemePage()
}