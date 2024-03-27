import { test, expect } from "@tests/fixtures/integration";
import { Strategy } from "@tests/utils/misc";
import type { StreamUrls } from "~background/messages/get-stream-urls";
import logger from "@tests/helpers/logger";
import { sleep } from "~utils/misc";
import { readMp4Info } from "@tests/utils/file";
import fs from "fs/promises";

test('record streams', { tag: "@scoped" }, async ({ context, rooms, api, page, modules }) => {

    const chunkSizeExpectedMoreThan = 36

    context.on('console', logger.debug)
    await page.addScriptTag({
        content: modules['player'].code,
        type: 'module'
    })

    const iterator = Strategy.random(rooms)
    let streams: StreamUrls
    for (const room of iterator) {
        try {
            logger.info(`尝试获取房间 ${room.roomid} 的流`)
            streams = await api.getStreamUrls(room.roomid)
            break
        } catch (err: any) {
            logger.warn(`获取房间 ${room.roomid} 的流失败: ${err?.message}`)
            logger.info(`尝试下一个房间`)
        }
    }
    expect(streams).toBeDefined()
    expect(streams.length).toBeGreaterThan(0)

    await context.exposeFunction('sleep', sleep)

    const chunks = await page.evaluate(async ({ streams, chunkSizeExpectedMoreThan: expected }) => {

        const { player, sleep } = window as any

        let timeout = undefined
        let fail = false

        function resetAndTimeout() {
            clearTimeout(timeout)
            timeout = setTimeout(() => fail = true, 1000 * 30)
        }

        const chunks = []
        const cleanup = await player.recordStream(streams, (buffer: ArrayBuffer) => {
            chunks.push(buffer)
            resetAndTimeout()
            console.info('total chunks size: ', chunks.length, buffer.byteLength)
        }, 'hls')

        while (chunks.length <= expected && !fail) {
            await sleep(1000)
        }
        clearTimeout(timeout)
        console.info('cleaning up stream buffer...')
        await cleanup()
        return chunks
    }, { streams, chunkSizeExpectedMoreThan })

    logger.info('total chunks: ', chunks.length)
    expect(chunks.length).toBeGreaterThan(chunkSizeExpectedMoreThan)

    const blob = new Blob(chunks, { type: 'video/mp4' })
    
    await fs.mkdir('out')
    await fs.writeFile('out/test.mp4', Buffer.from(await blob.arrayBuffer()), { flag: 'w' })

    const info = await readMp4Info('out/test.mp4')
    logger.info('info: ', info)

    expect(info.duration).toBeGreaterThan(chunkSizeExpectedMoreThan)
})