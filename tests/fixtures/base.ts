import { test as base, chromium, type BrowserContext, expect } from '@playwright/test'
import type { Logger } from '@tests/helpers/logger'
import logger from '@tests/helpers/logger'
import { findLiveRoom, getLiveRooms, getLiveRoomsRange, type LiveRoomInfo } from '@tests/utils/bilibili'
import path from 'path'

export type ExtensionOptions = {
    maxPage: number
    roomId: number
    maxRoomRetries: number
}

export type ExtensionFixture = {
    context: BrowserContext
    extensionId: string
    tabUrl: (tab: string) => string
}

export type ExtensionWorkerFixture = {
    rooms: LiveRoomInfo[]
}

export const extensionBase = base.extend<ExtensionFixture, ExtensionOptions & ExtensionWorkerFixture>({

    maxPage: [5, { option: true, scope: 'worker' }],
    roomId: [-1, { option: true, scope: 'worker' }],
    maxRoomRetries: [50, { option: true, scope: 'worker' }],

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
        async ({ maxPage, roomId }, use) => {
            const rooms = roomId > 0 ? [await findLiveRoom(roomId)] : await getLiveRoomsRange(maxPage)
            expect(rooms, 'rooms is not undefined').toBeDefined()
            expect(rooms.length, 'live rooms more than 1').toBeGreaterThan(0)
            extensionBase.skip(rooms[0] === null, 'failed to fetch bilibili live room')
            await use(rooms)
        },
        { scope: 'worker' }
    ],
    tabUrl: async ({ extensionId }, use) => {
        await use((tab: string) => `chrome-extension://${extensionId}/tabs/${tab}`)
    }
})