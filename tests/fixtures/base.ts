import { test as base, chromium, expect, type BrowserContext } from '@playwright/test'
import BilbiliApi, { type LiveRoomInfo } from '@tests/helpers/bilibili-api'
import BilibiliPage from '@tests/helpers/bilibili-page'
import logger from '@tests/helpers/logger'
import RoomTypeFinder from '@tests/helpers/room-finder'
import path from 'path'

export type ExtensionOptions = {
    maxPage: number
    roomId: number
    maxRoomRetries: number
    isThemeRoom: boolean
}

export type ExtensionFixture = {
    context: BrowserContext
    extensionId: string
    tabUrl: (tab: string) => string
}

export type ExtensionWorkerFixture = {
    api: BilbiliApi
    rooms: LiveRoomInfo[]
    cacher: RoomTypeFinder
}

export const extensionBase = base.extend<ExtensionFixture, ExtensionOptions & ExtensionWorkerFixture>({

    maxPage: [5, { option: true, scope: 'worker' }],
    roomId: [-1, { option: true, scope: 'worker' }],
    maxRoomRetries: [70, { option: true, scope: 'worker' }],
    isThemeRoom: [false, { option: true, scope: 'worker' }],

    cacher: [
        async ({ browser, api, isThemeRoom }, use) => {
            const cacher = new RoomTypeFinder(browser, api)
            if (isThemeRoom) {
                const info = await cacher.loadFromFileCache('theme')
                if (info === 'none') {
                    console.warn(`從緩存找不到大海報的房間, 跳過所有大海報房間測試...`)
                    extensionBase.skip()
                } else if (info !== 'null') {
                    console.info(`已成功從緩存找到大海報房間: ${info.roomid}`)
                }
                // if null, just re-search
            }
            await use(cacher)
        },
        { scope: 'worker', timeout: 0 }
    ],
    
    context: async ({ }, use) => {
        const pathToExtension = path.join(__dirname, '../../build/extension')
        const context = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                '--mute-audio',
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
        logger.info(`using extension id: ${extensionId}`)
        await use(extensionId);
    },
    rooms: [
        async ({ maxPage, roomId, api }, use) => {
            const rooms = roomId > 0 ? [await api.findLiveRoom(roomId)] : await api.getLiveRoomsRange(maxPage)
            expect(rooms, 'rooms is not undefined').toBeDefined()
            expect(rooms.length, 'live rooms more than 1').toBeGreaterThan(0)
            extensionBase.skip(rooms[0] === null, 'failed to fetch bilibili live room')
            await use(rooms)
        },
        { scope: 'worker' }
    ],
    api: [
        async ({ }, use) => {
            const api = await BilbiliApi.init()
            await use(api)
        },
        { scope: 'worker' }
    ],
    tabUrl: async ({ extensionId }, use) => {
        await use((tab: string) => `chrome-extension://${extensionId}/tabs/${tab}`)
    }
})