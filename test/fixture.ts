import { test as base, chromium, type BrowserContext, type Locator, type Page } from '@playwright/test'
import path from 'path'
import { getLiveRooms, type LiveRoomInfo } from './utils/bilibili'

export type ExtensionFixture = {
    context: BrowserContext
    extensionId: string
    room: LiveRoomInfo
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
        await csui.waitFor({ state: 'attached', timeout: 5000 })
        await use(selected)
    }
})

export const expect = test.expect


