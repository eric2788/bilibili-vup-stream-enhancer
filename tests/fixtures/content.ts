import BilibiliPage from "@tests/helpers/bilibili-page";
import { Strategy } from "@tests/utils/misc";
import { extensionBase } from "./base";
import type { PageFrame } from "@tests/helpers/page-frame";
import logger from "@tests/helpers/logger";
import type { LiveRoomInfo } from "@tests/utils/bilibili";
import RoomTypeCacher from "@tests/helpers/fixed-room";

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

export type ContentWorkerFixtures = {
    cacher: RoomTypeCacher
}

export const test = extensionBase.extend<ContentFixtures & ContentOptions, ContentWorkerFixtures>({

    isThemeRoom: [ false, { option: true }],
    maxRoomRetries: [50, { option: true }],

    cacher: [
        async ({ browser }, use) => {
            const cacher = new RoomTypeCacher(browser)
            cacher.registerRoomType('theme', page => page.isThemePage())
            await use(cacher)
        },
        { scope: 'worker' }
    ],

    content: async ({ room, page }, use) => {
        page.frames().map(f => logger.debug(f.url()))
        const maybeFrame = await room.getContentLocator()
        test.skip(maybeFrame === null, `此頁面 ${room.page.url()} 不是主題頁面，無法取得 iframe`)
        await maybeFrame.locator('body').scrollIntoViewIfNeeded()
        await use(maybeFrame)
    },

    room: [
        async ({ page, isThemeRoom, rooms, maxRoomRetries, cacher }, use) => {
            const iterator = Strategy.random(rooms, maxRoomRetries || rooms.length)
            const room = await cacher.findRoomType(isThemeRoom ? 'theme' : 'normal', iterator, isThemeRoom) // only theme room will cache
            test.skip(room === null, `找不到${isThemeRoom ? '' : '不是'}大海報的房間。`)
            using bilibiliPage = new BilibiliPage(page, room)
            await bilibiliPage.enterToRoom()
            await use(bilibiliPage)
        },
        { auto: true, timeout: 0 }
    ],

    // force to theme room
    themeRoom: [
        async ({ page, room, rooms, maxRoomRetries, cacher }, use) => {
            // already theme page
            if (await room.isThemePage()) {
                await use(room)
                return
            }
            // go to blank page first then go to theme page
            await page.goto('about:blank')
            const iterator = Strategy.random(rooms, maxRoomRetries || rooms.length)
            const info = await cacher.findRoomType('theme', iterator, true)
            test.skip(info === null, `找不到大海報的房間。`)
            await room.enterToRoom(info)
            await use(room)
        },
        { timeout: 0}
    ]

})

export const expect = test.expect