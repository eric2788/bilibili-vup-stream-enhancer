import BilibiliPage from "@tests/helpers/bilibili-page";
import logger from "@tests/helpers/logger";
import type { PageFrame } from "@tests/helpers/page-frame";
import { Strategy } from "@tests/utils/misc";
import { extensionBase } from "./base";

export type ContentOptions = {
}

export type ContentFixtures = {
    room: BilibiliPage
    themeRoom: BilibiliPage
    content: PageFrame // page for live room (can be iframe)
}

export const test = extensionBase.extend<ContentFixtures & ContentOptions>({

    // 代表内容页，可能是直播间页或者大海报直播间内的 iframe
    // 建议使用 content 来获取内容页，而不是直接使用 page
    content: async ({ room, page }, use) => {
        page.frames().map(f => logger.debug(f.url()))
        const maybeFrame = await room.getContentLocator()
        test.skip(maybeFrame === null, `此頁面 ${room.page.url()} 不是主題頁面，無法取得 iframe`)
        await maybeFrame.locator('body').scrollIntoViewIfNeeded()
        await use(maybeFrame)
    },

    // 直播间实例
    room: [
        async ({ page, isThemeRoom, rooms, maxRoomRetries, cacher, api }, use) => {
            await using bilibiliPage = new BilibiliPage(page, api)
            const iterator = Strategy.random(rooms, Math.min(maxRoomRetries, rooms.length))
            const info = await cacher.findRoomTypeWithCache(isThemeRoom ? 'theme' : 'normal', iterator, isThemeRoom)
            test.skip(!info, `找不到${isThemeRoom ? '' : '不是'}大海報的房間。`)
            await bilibiliPage.enterToRoom(info)
            test.skip(await bilibiliPage.checkIfNotSupport(), '瀏覽器版本過低')
            await use(bilibiliPage)
            await cacher.validateCache(info, isThemeRoom ? 'theme' : 'normal')
        },
        { auto: true, timeout: 0 }
    ],

    // 强制使用大海报房间时使用
    themeRoom: [
        async ({ rooms, maxRoomRetries, cacher, room }, use) => {
            if (await room.isThemePage()) {
                await use(room)
                return
            }
            const iterator = Strategy.random(rooms, Math.min(maxRoomRetries, rooms.length))
            await cacher.loadFromFileCache('theme')
            const info = await cacher.findRoomTypeWithCache('theme', iterator, true)
            test.skip(!info, `找不到大海報的房間。`)
            await room.enterToRoom(info)
            test.skip(await room.checkIfNotSupport(), '瀏覽器版本過低')
            await use(room)
            await cacher.validateCache(info, 'theme')
        },
        { timeout: 0 }
    ]

})

export const expect = test.expect