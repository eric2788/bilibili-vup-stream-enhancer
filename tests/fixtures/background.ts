import type { Page, Worker } from "@playwright/test";
import BilibiliPage from "@tests/helpers/bilibili-page";
import { Strategy } from "@tests/utils/misc";
import { extensionBase } from "./base";


export type BackgroundOptions = {
}

export type BackgroundFixtures = {
    settings: Page
    front: BilibiliPage
    serviceWorker: Worker
}


export const test = extensionBase.extend<BackgroundFixtures>({
    settings: async ({ page, tabUrl }, use) => {
        await page.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
        await use(page)
    },
    front: async ({ context, rooms, api, isThemeRoom, cacher }, use) => {
        const frontPage = await context.newPage()
        await using room = new BilibiliPage(frontPage, api)
        const generator = Strategy.random(rooms, Math.min(rooms.length, 5))
        const info = await cacher.findRoomTypeWithCache(isThemeRoom ? 'theme' : 'normal', generator)
        await room.enterToRoom(info)
        test.skip(await room.checkIfNotSupport(), '瀏覽器版本過低')
        await use(room)
    }
})


export const expect = test.expect