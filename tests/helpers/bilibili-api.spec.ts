import { extensionBase as test } from "@tests/fixtures/base";
import logger from "@tests/helpers/logger";

test('getRoomStatus - API', async ({ api }) => {
    await expectNoError(api.getRoomStatus(545))
})

test('findLiveRoom - API', async ({ api }) => {
    await expectNoError(api.findLiveRoom(545))
})

test('getLiveRoomsRange - API', async ({ api }) => {
    await expectNoError(api.getLiveRoomsRange(3))
})

test('getLiveRooms - API', async ({ api }) => {
    await expectNoError(api.getLiveRooms())
})

async function expectNoError(p: Promise<any>) {
    try {
        const r = await p
        if (!r) return
        logger.info('result: ', r)
    } catch (e) {
        logger.error(e)
        throw e
    }
}