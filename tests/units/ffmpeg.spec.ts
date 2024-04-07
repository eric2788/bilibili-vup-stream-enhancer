import { test, expect } from '@tests/fixtures/component'
import logger from '@tests/helpers/logger'
import { readGifInfo, readMovieInfo } from '@tests/utils/file'
import fs from 'fs/promises'

test('測試在 playwright 加載 ffmpeg.wasm', async ({ page, modules }) => {

    await modules['ffmpeg'].loadToPage()

    const ret = await page.evaluate(async () => {
        const { getFFmpeg } = window as any
        const ffmpeg = await getFFmpeg()
        return await ffmpeg.exec(['-version'])
    })

    expect(ret).toBe(0)
})

test('測試 ffmpeg.wasm 轉換 mp4 到 gif', async ({ context, page, modules }) => {

    await modules['ffmpeg'].loadToPage()
    await modules['utils'].loadToPage()

    const downloading = page.waitForEvent('download')

    logger.info('downloading video...')
    const res = await context.request.get('https://www.w3schools.com/html/mov_bbb.mp4')
    test.skip(res.status() !== 200, '无法下载测试视频')
    const mp4Content = await res.body()

    const info = await readMovieInfo(mp4Content) // ensure is mp4
    logger.info('mp4 info: ', info)

    expect(info.duration).toBeGreaterThan(0)

    await fs.writeFile('out/input.mp4', mp4Content, {})

    const mp4 = atob(mp4Content.toString('base64')).split('').map(c => c.charCodeAt(0))
    await page.evaluate(async (mp4) => {

        const { getFFmpeg, utils } = window as any
        const ffmpeg = await getFFmpeg()
        const inFile = 'input.mp4'
        const outFile = 'out.gif'

        await ffmpeg.writeFile(inFile, new Uint8Array(mp4))
        await ffmpeg.exec(['-i', inFile, '-f', 'gif', outFile])

        const data = await ffmpeg.readFile(outFile)
        const output = new Blob([data], { type: 'image/gif' })
        utils.file.downloadBlob(output, outFile)

    }, mp4)

    const downloaded = await downloading
    await downloaded.saveAs('out/test.gif')

    const infoGif = await readGifInfo('out/test.gif') // ensure is gif
    logger.info('gif info: ', infoGif)

    expect(infoGif.valid).toBe(true)
})

// FYR: https://ffmpegwasm.netlify.app/docs/faq#is-rtsp-supported-by-ffmpegwasm
test.fail('測試透過 ffmpeg.wasm 錄製 http-flv 直播流', async ({ modules, room: { stream, roomid }, page }) => {

    await modules['utils'].loadToPage()
    await modules['ffmpeg'].loadToPage()

    const flvs = stream.filter(s => s.type === 'flv').map(s => s.url)
    test.skip(flvs.length === 0, '没有可用的直播视频流')

    const downloading = page.waitForEvent('download')
    await page.evaluate(async ({ flvs, roomid }) => {

        const { getFFmpeg, utils } = window as any
        const ffmpeg = await getFFmpeg()

        const outFile = `${roomid}.flv`
        await ffmpeg.exec(['-f', 'live_flv', '-i', flvs[0].replace('https', 'http'), outFile], 15 * 1000)
        const data = await ffmpeg.readFile(outFile)
        const output = new Blob([data], { type: 'video/mp4' })
        utils.file.downloadBlob(output, outFile)

    }, { flvs, roomid })

    const downloaded = await downloading
    await downloaded.saveAs('out/test.flv')

    const info = await readMovieInfo('out/test.flv')

    logger.info('info: ', info)

})

// FYR: https://ffmpegwasm.netlify.app/docs/faq#is-rtsp-supported-by-ffmpegwasm
test.fail('測試透過 ffmpeg.wasm 錄製 HLS 直播流', async ({ modules, room: { stream, roomid }, page }) => {

    await modules['utils'].loadToPage()
    await modules['ffmpeg'].loadToPage()

    const hls = stream.filter(s => s.type === 'hls').map(s => s.url)
    test.skip(hls.length === 0, '没有可用的直播视频流')

    const downloading = page.waitForEvent('download')
    await page.evaluate(async ({ hls, roomid }) => {

        const { getFFmpeg, utils } = window as any
        const ffmpeg = await getFFmpeg()

        const outFile = `${roomid}.flv`
        await ffmpeg.exec(['-f', 'live_flv', '-i', hls[0].replace('https', 'http'), outFile], 15 * 1000)
        const data = await ffmpeg.readFile(outFile)
        const output = new Blob([data], { type: 'video/mp4' })
        utils.file.downloadBlob(output, outFile)

    }, { hls, roomid })

    const downloaded = await downloading
    await downloaded.saveAs('out/test.mp4')

    const info = await readMovieInfo('out/test.mp4')

    logger.info('info: ', info)

})