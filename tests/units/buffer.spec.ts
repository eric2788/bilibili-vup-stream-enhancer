import { test, expect } from '@tests/fixtures/component'
import logger from '@tests/helpers/logger'
import { readMovieInfo } from '@tests/utils/file'

test.slow()

test('測試捕捉 HLS 推流', async ({ page, modules, room: { stream } }) => {

    await modules['player'].loadToPage()
    await modules['utils'].loadToPage()

    const downloading = page.waitForEvent('download')
    const length = await page.evaluate(async (stream) => {

        const { player, utils } = window as any

        const chunks = []

        const p = await player.recordStream(stream, (buffer: ArrayBuffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' })
            chunks.push(blob)
            console.info('total chunks size: ', chunks.length, buffer.byteLength)
        }, {
            type: 'hls',
            codec: 'avc'
        })

        await utils.misc.sleep(15000) // 測試錄製 15 秒
        console.info('cleaning up stream buffer...')
        p.stopAndDestroy()

        utils.file.download('test.mp4', [...chunks], 'video/mp4')

        return chunks.length

    }, stream)

    expect(length).toBeGreaterThan(0) // 確保有錄製到東西

    const downloaded = await downloading
    await downloaded.saveAs('out/test.mp4')

    const info = await readMovieInfo('out/test.mp4') // 確保影片是能被正常解析的
    logger.info('info: ', info)
})

test('測試捕捉 FLV 推流', async ({ page, modules, room: { stream } }) => {

    await modules['player'].loadToPage()
    await modules['utils'].loadToPage()

    const downloading = page.waitForEvent('download')
    const length = await page.evaluate(async (stream) => {

        const { player, utils } = window as any

        const chunks = []

        const p = await player.recordStream(stream, (buffer: ArrayBuffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' })
            chunks.push(blob)
            console.info('total chunks size: ', chunks.length, buffer.byteLength)
        }, {
            type: 'flv',
            codec: 'avc'
        })

        await utils.misc.sleep(15000) // 測試錄製 15 秒
        console.info('cleaning up stream buffer...')
        p.stopAndDestroy()

        utils.file.download('test.flv', [...chunks], 'video/flv')

        return chunks.length

    }, stream)

    expect(length).toBeGreaterThan(0) // 確保有錄製到東西

    const downloaded = await downloading
    await downloaded.saveAs('out/test.flv')

    const info = await readMovieInfo('out/test.flv') // 確保影片是能被正常解析的
    logger.info('info: ', info)
})

test('測試終止 HLS 推流后有否成功關閉數據流', async ({ modules, page, room: { stream } }) => {

    await modules['player'].loadToPage()
    await modules['utils'].loadToPage()

    const { before, after } = await page.evaluate(async (stream) => {

        const { player, utils } = window as any

        let received = 0
        const p = await player.recordStream(stream, (buffer: ArrayBuffer) => {
            received++
            console.log('received: ', received)
        }, {
            type: 'hls',
            codec: 'avc'
        })

        await utils.misc.sleep(5000) // 測試錄製 5 秒
        console.info('stopping stream...')
        p.stopAndDestroy()
        const before = received
        await utils.misc.sleep(5000) // 等待關閉
        console.info('checking stream...')
        const after = received
        return { before, after }
    }, stream)

    expect(before).toBe(after)

})

test('測試終止 FLV 推流后有否成功關閉數據流', async ({ modules, page, room: { stream } }) => {

    await modules['player'].loadToPage()
    await modules['utils'].loadToPage()

    const { before, after } = await page.evaluate(async (stream) => {

        const { player, utils } = window as any

        let received = 0
        const p = await player.recordStream(stream, (buffer: ArrayBuffer) => {
            received++
            console.log('received: ', received)
        }, {
            type: 'flv',
            codec: 'avc'
        })

        await utils.misc.sleep(5000) // 測試錄製 5 秒
        console.info('stopping stream...')
        p.stopAndDestroy()
        const before = received
        await utils.misc.sleep(5000) // 等待關閉
        console.info('checking stream...')
        const after = received
        return { before, after }
    }, stream)

    expect(before).toBe(after)
})

test('測試 HLS 長錄製有否 flush buffer', { tag: "@scoped" }, async ({ context, modules, page, room: { stream } }) => {

    // 5 mins
    test.setTimeout(300000)

    await modules['player'].loadToPage()
    await modules['utils'].loadToPage()

    const logs: string[] = []
    context.on('console', (msg) => {
        logs.push(msg.text())
    })

    const downloading = page.waitForEvent('download')
    const length = await page.evaluate(async (stream) => {

        const { player, utils } = window as any

        const chunks = []

        const p = await player.recordStream(stream, (buffer: ArrayBuffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' })
            chunks.push(blob)
            console.info('total chunks size: ', chunks.length, buffer.byteLength)
        }, {
            type: 'hls',
            codec: 'avc'
        })

        await utils.misc.sleep(60000) // 測試錄製 60 秒
        console.info('cleaning up stream buffer...')
        p.stopAndDestroy()

        utils.file.download('test.mp4', [...chunks], 'video/mp4')

        return chunks.length

    }, stream)

    expect(length).toBeGreaterThan(0) // 確保有錄製到東西
    const downloaded = await downloading
    await downloaded.saveAs('out/test.mp4')

    const info = await readMovieInfo('out/test.mp4') // 確保影片是能被正常解析的
    logger.info('info: ', info)

    // 檢查是否有 flush buffer
    const flushed = logs.filter(l => l.includes('buffer flushing') || l.includes('buffer flushed'))

    logger.info('flush messages: ', flushed)

    expect(flushed.length).toBeGreaterThan(0)
})