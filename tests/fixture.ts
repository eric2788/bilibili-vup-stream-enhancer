import { test as base, chromium, type BrowserContext, type Locator, type Page } from '@playwright/test'
import path from 'path'
import { getLiveRooms } from './utils/bilibili'
import BilibiliPage from './helpers/bilibili-page'

export type ExtensionFixture = {
    context: BrowserContext
    extensionId: string
    room: BilibiliPage
}

export const test = base.extend<ExtensionFixture>({
    context: async ({ }, use) => {
        const pathToExtension = path.join(__dirname, '../build/extension')
        const context = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
                ...(process.env.CI ? ['--headless=new'] : [])
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
        console.info(`using extension id: ${extensionId}`)
        await use(extensionId);
    },
    room: async ({ page }, use) => {
        const rooms = await getLiveRooms()
        expect(rooms, 'rooms is not undefined').toBeDefined()
        expect(rooms.length, 'live rooms more than 1').toBeGreaterThan(0)
        const random = Math.floor(Math.random() * rooms.length)
        const selected = rooms[random]
        await page.goto("https://live.bilibili.com/" + selected.roomid)
        await page.waitForTimeout(1000)
        const csui = page.locator('plasmo-csui')
        await csui.waitFor({ state: 'attached', timeout: 10000 })
        await use(new BilibiliPage(page, selected))
    }
})

export const expect = test.expect


