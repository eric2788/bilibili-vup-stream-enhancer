import { test } from "@tests/fixtures/component";
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

test('getStreamUrls - API', async ({ api }) => {
    await expectNoError(api.getStreamUrls(21696950))
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