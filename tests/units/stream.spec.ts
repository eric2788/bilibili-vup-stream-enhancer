import { test, expect } from '@tests/fixtures/component'
import { readMovieInfo } from '@tests/utils/file'

test.slow()

test('測試捕捉 HLS 推流', { tag: "@scoped" }, async ({ context, page, modules, room: { stream } }) => {

    await modules['player'].loadToPage()
    await modules['utils'].loadToPage()

    context.on('console', console.log)

    const downloading = page.waitForEvent('download')
    const length = await page.evaluate(async (stream) => {

        const { player, utils } = window as any

        const chunks = []

        const cleanup = await player.recordStream(stream, (buffer: ArrayBuffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' })
            chunks.push(blob)
            console.info('total chunks size: ', chunks.length, buffer.byteLength)
        }, 'hls')

        await utils.misc.sleep(15000) // 測試錄製 15 秒
        console.info('cleaning up stream buffer...')
        await cleanup()

        utils.file.download('test.mp4', [...chunks], 'video/mp4')

        return chunks.length

    }, stream)

    expect(length).toBeGreaterThan(0) // 確保有錄製到東西

    const downloaded = await downloading
    await downloaded.saveAs('out/test.mp4')

    const info = await readMovieInfo('out/test.mp4') // 確保影片是能被正常解析的
    console.info('info: ', info)
})

test.fail('測試捕捉 FLV 推流', { tag: "@scoped" }, async ({ context, page, modules, room: { stream } }) => {

    await modules['player'].loadToPage()
    await modules['utils'].loadToPage()

    context.on('console', console.log)

    const downloading = page.waitForEvent('download')
    const length = await page.evaluate(async (stream) => {

        const { player, utils } = window as any

        const chunks = []

        const cleanup = await player.recordStream(stream, (buffer: ArrayBuffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' })
            chunks.push(blob)
            console.info('total chunks size: ', chunks.length, buffer.byteLength)
        }, 'flv')

        await utils.misc.sleep(15000) // 測試錄製 15 秒
        console.info('cleaning up stream buffer...')
        await cleanup()

        utils.file.download('test.flv', [...chunks], 'video/flv')

        return chunks.length

    }, stream)

    expect(length).toBeGreaterThan(0) // 確保有錄製到東西

    const downloaded = await downloading
    await downloaded.saveAs('out/test.flv')

    const info = await readMovieInfo('out/test.flv') // 確保影片是能被正常解析的
    console.info('info: ', info)
})