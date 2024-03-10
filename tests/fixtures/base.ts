import { test as base, chromium, expect, type BrowserContext, type Worker } from '@playwright/test'
import BilbiliApi, { type LiveRoomInfo } from '@tests/helpers/bilibili-api'
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
    serviceWorker: Worker
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
    extensionId: async ({ serviceWorker }, use) => {
        const extensionId = serviceWorker.url().split('/')[2]
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
    },
    serviceWorker: [
        async ({ context }, use) => {
            logger.info('total service workers: ', context.serviceWorkers().length)
            let [background] = context.serviceWorkers()
            if (!background) {
                logger.info('cannot find background, waiting for service worker')
                background = await context.waitForEvent('serviceworker', {
                    predicate: sw => sw.url().includes('chrome-extension')
                })
                logger.info('found service worker: ', background.url())
            }
    
            // 預先關閉自動用戶導航
            const page = await context.newPage()
            await page.goto(background.url())
            await page.evaluate(async () => {
                await chrome.storage.local.set({
                    'no_auto_journal.settings': true,
                    'no_auto_journal.content': true,
                })
            })
            logger.info('已關閉自動用戶導航')
            await page.close()
    
            await use(background)
        },
        { auto: true }
    ]
})