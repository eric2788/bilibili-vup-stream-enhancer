import type { Page, Worker } from "@playwright/test";
import { extensionBase } from "./base";
import BilibiliPage from "@tests/helpers/bilibili-page";
import { random } from "@tests/utils/misc";


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
    front: async ({ context, rooms }, use) => {
        const frontPage = await context.newPage()
        await using room = new BilibiliPage(frontPage, random(rooms))
        await room.enterToRoom()
        await use(room)
    },
    serviceWorker: async ({ context }, use) => {
        let [background] = context.serviceWorkers()
        if (!background)
            background = await context.waitForEvent('serviceworker')
        await use(background)
    }
})


export const expect = test.expect