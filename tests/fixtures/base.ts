import { expect, test as pwBase } from '@playwright/test'
import BilbiliApi, { type LiveRoomInfo } from '@tests/helpers/bilibili-api'

export type BaseOptions = {
    maxPage: number
    roomId: number
}

export type BaseWorkerFixtures = {
    api: BilbiliApi
    rooms: LiveRoomInfo[]
}

export const base = pwBase.extend<{}, BaseOptions & BaseWorkerFixtures>({

    maxPage: [5, { option: true, scope: 'worker' }],
    roomId: [-1, { option: true, scope: 'worker' }],

    rooms: [
        async ({ maxPage, roomId, api }, use) => {
            const rooms = roomId > 0 ? [await api.findLiveRoom(roomId)] : await api.getLiveRoomsRange(maxPage)
            expect(rooms, 'rooms is not undefined').toBeDefined()
            expect(rooms.length, 'live rooms more than 1').toBeGreaterThan(0)
            pwBase.skip(rooms[0] === null, 'failed to fetch bilibili live room')
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

})