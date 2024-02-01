import BilibiliPage from "@tests/helpers/bilibili-page";
import logger from "@tests/helpers/logger";
import type { PageFrame } from "@tests/helpers/page-frame";
import RoomTypeFinder from "@tests/helpers/room-finder";
import { Strategy } from "@tests/utils/misc";
import { extensionBase } from "./base";

export type ContentOptions = {
    isThemeRoom: boolean
}

export type ContentFixtures = {
    room: BilibiliPage
    themeRoom: BilibiliPage
    content: PageFrame // page for live room (can be iframe)
}

export type ContentWorkerFixtures = {
    cacher: RoomTypeFinder
}

export const test = extensionBase.extend<ContentFixtures, ContentWorkerFixtures & ContentOptions>({

    isThemeRoom: [false, { option: true, scope: 'worker' }],

    cacher: [
        async ({ browser, isThemeRoom, rooms, maxRoomRetries }, use, wf) => {
            const cacher = new RoomTypeFinder(browser)
            cacher.registerRoomType('404', async page => page.page.url().includes('www.bilibili.com/404'))
            cacher.registerRoomType('offline', page => page.isStatus('offline'))
            cacher.registerRoomType('theme', page => page.isThemePage())

            // 大海報房間時，先緩存大海報房間
            logger.info('using worker index: ', wf.workerIndex)
            if (isThemeRoom && wf.workerIndex < 2) {
                const info = await cacher.findRoomTypeWithCache('theme', Strategy.random(rooms, Math.min(maxRoomRetries, rooms.length)))
                if (!info) {
                    console.warn(`找不到大海報的房間, 跳過所有大海報房間測試...`)
                    test.skip(true, `找不到大海報的房間`)
                }
                console.info(`成功緩存大海報房間: ${info.roomid}`)
            }

            await use(cacher)
        },
        { scope: 'worker', timeout: 0 }
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
            await using bilibiliPage = new BilibiliPage(page)
            const iterator = Strategy.random(rooms, Math.min(maxRoomRetries, rooms.length))
            const room = await cacher.findRoomTypeWithCache(isThemeRoom ? 'theme' : 'normal', iterator)
            test.skip(!room, `找不到${isThemeRoom ? '' : '不是'}大海報的房間。`)
            await bilibiliPage.enterToRoom(room)
            await use(bilibiliPage)
            await cacher.validateCache(bilibiliPage, isThemeRoom ? 'theme' : 'normal')
        },
        { auto: true, timeout: 0 }
    ],

    // force to theme room
    themeRoom: [
        async ({ room, rooms, maxRoomRetries, cacher }, use) => {
            if (await room.isThemePage()) {
                return use(room)
            }
            const iterator = Strategy.random(rooms, Math.min(maxRoomRetries, rooms.length))
            const info = await cacher.findRoomTypeWithCache('theme', iterator)
            test.skip(!info, `找不到大海報的房間。`)
            await room.enterToRoom(info)
            await use(room)
            await cacher.validateCache(room, 'theme')
        },
        { timeout: 0 }
    ]

})

export const expect = test.expect