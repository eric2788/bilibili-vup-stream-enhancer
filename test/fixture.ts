import { test as base, chromium, type BrowserContext, type Locator, type Page } from '@playwright/test'
import path from 'path'
import { getLiveRooms } from './utils/bilibili'

export type ExtensionFixture = {
    context: BrowserContext
    extensionId: string
    liveRoom: Page
}

export const test = base.extend<ExtensionFixture>({
    context: async ({ }, use) => {
        const pathToExtension = path.join(__dirname, '../build/extension')
        const context = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                '--headless=new',
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ],
        });
        await use(context);
        await context.close();
    },
    extensionId: async ({ context }, use) => {
        let [background] = context.serviceWorkers()
        if (!background)
            background = await context.waitForEvent('serviceworker')

        const extensionId = background.url().split('/')[2]
        await use(extensionId);
    },
    liveRoom: async ({ page }, use) => {
        const rooms = await getLiveRooms()
        expect(rooms, 'rooms is not undefined').toBeDefined()
        expect(rooms.length, 'live rooms more than 1').toBeGreaterThan(0)
        const random = Math.floor(Math.random() * rooms.length)
        await page.goto("https://live.bilibili.com/" + rooms[random].roomid)
        await page.waitForTimeout(3000)
        await use(page)
    }
})

export const expect = test.expect


