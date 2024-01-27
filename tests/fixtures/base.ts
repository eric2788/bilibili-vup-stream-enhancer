import { test as base, chromium, type BrowserContext, expect } from '@playwright/test'
import type { Logger } from '@tests/helpers/logger'
import LoggerImpl from '@tests/helpers/logger'
import { findLiveRoom, getLiveRooms, getLiveRoomsRange, type LiveRoomInfo } from '@tests/utils/bilibili'
import path from 'path'

export type ExtensionOptions = {
    maxPage: number
    roomId: number,
}

export type ExtensionFixture = {
    context: BrowserContext
    extensionId: string
    logger: Logger
    rooms: LiveRoomInfo[]
    tabUrl: (tab: string) => string
}

export const extensionBase = base.extend<ExtensionFixture & ExtensionOptions>({

    maxPage: [5, { option: true }],
    roomId: [-1, { option: true }],

    context: async ({ }, use) => {
        const pathToExtension = path.join(__dirname, '../../build/extension')
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
    extensionId: async ({ context, logger }, use) => {
        let [background] = context.serviceWorkers()
        if (!background)
            background = await context.waitForEvent('serviceworker')

        const extensionId = background.url().split('/')[2]
        logger.info(`using extension id: ${extensionId}`)
        await use(extensionId);
    },
    logger: async ({ }, use) => {
        const logger = new LoggerImpl(!!process.env.CI)
        await use(logger)
    },
    rooms: async ({ maxPage, roomId }, use) => {
        const rooms = roomId > 0 ? [await findLiveRoom(roomId)] : await getLiveRoomsRange(maxPage)
        expect(rooms, 'rooms is not undefined').toBeDefined()
        expect(rooms.length, 'live rooms more than 1').toBeGreaterThan(0)
        extensionBase.skip(rooms[0] === null, 'failed to fetch bilibili live room')
        await use(rooms)
    },
    tabUrl: async ({ extensionId }, use) => {
        await use((tab: string) => `chrome-extension://${extensionId}/tabs/${tab}`)
    }
})