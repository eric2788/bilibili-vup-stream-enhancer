import type { Page, Worker } from "@playwright/test";
import BilibiliPage from "@tests/helpers/bilibili-page";
import { Strategy } from "@tests/utils/misc";
import { extensionBase } from "./extension";


export type BackgroundOptions = {
}

export type BackgroundFixtures = {
    front: BilibiliPage
    serviceWorker: Worker
}


export const test = extensionBase.extend<BackgroundFixtures>({
    // 直播间页面用
    front: async ({ context, rooms, api, isThemeRoom, cacher }, use) => {
        const frontPage = await context.newPage()
        await using room = new BilibiliPage(frontPage, api)
        const generator = Strategy.random(rooms, Math.min(rooms.length, 5))
        const info = await cacher.findRoomTypeWithCache(isThemeRoom ? 'theme' : 'normal', generator)
        test.skip(!info, `找不到${isThemeRoom ? '' : '不是'}大海報的房間。`)
        await room.enterToRoom(info)
        test.skip(await room.checkIfNotSupport(), '瀏覽器版本過低')
        await use(room)
    }
})


export const expect = test.expect