import test from "@playwright/test";
import { findLiveRoom, getLiveRooms, getLiveRoomsRange, getRoomStatus } from "./bilibili";
import logger from "@tests/helpers/logger";

test('getRoomStatus - API', async () => {
    await expectNoError(getRoomStatus(545))
})

test('findLiveRoom - API', async () => {
    await expectNoError(findLiveRoom(545))
})

test('getLiveRoomsRange - API', async () => {
    await expectNoError(getLiveRoomsRange(3))
})

test('getLiveRooms - API', async () => {
    await expectNoError(getLiveRooms())
})

async function expectNoError(p: Promise<any>) {
    try {
        const r = await p
        if (!r) return
        logger.info('result: ', r)
    } catch (e) {
        logger.error(e)
        //test.fail(e, 'unexpected error')
        throw e
    }
}