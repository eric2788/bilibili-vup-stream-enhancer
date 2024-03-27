import { expect, test } from "@tests/fixtures/component";
import logger from "@tests/helpers/logger";
import { readMovieInfo } from "@tests/utils/file";
test(
    '測試透過 Buffer 錄製 HLS 推流並用 ffmpeg.wasm 修復資訊損壞',
    { tag: "@scoped" },
    async ({ context, room: { stream }, page, modules }) => {

        test.slow()
        const chunkSizeExpectedMoreThan = 50

        context.on('console', logger.debug)

        await modules['player'].loadToPage()
        await modules['utils'].loadToPage()

        const downloading = page.waitForEvent('download')
        const length = await page.evaluate(async ({ stream, chunkSizeExpectedMoreThan: expected }) => {

            const { player, utils } = window as any

            let timeout = undefined
            let fail = false

            function resetAndTimeout() {
                clearTimeout(timeout)
                timeout = setTimeout(() => fail = true, 1000 * 30)
            }

            const chunks = []
            const cleanup = await player.recordStream(stream, (buffer: ArrayBuffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' })
                chunks.push(blob)
                resetAndTimeout()
                console.info('total chunks size: ', chunks.length, buffer.byteLength)
            }, 'hls')

            while (chunks.length <= expected && !fail) {
                await utils.misc.sleep(1000)
            }

            clearTimeout(timeout)
            console.info('cleaning up stream buffer...')
            await cleanup()

            utils.file.download('test.mp4', [...chunks], 'video/mp4')

            {
                // for next use
                (window as any).testVideo = chunks;
            }

            return chunks.length

        }, { stream, chunkSizeExpectedMoreThan })

        expect(length).toBeGreaterThan(chunkSizeExpectedMoreThan)
        const downloaded = await downloading
        await downloaded.saveAs('out/test.mp4')
        const info = await readMovieInfo('out/test.mp4')

        logger.info('info: ', info)

        expect(info.relativeDuration()).toBe(0) // broken info

        // now trying to fix broken info with ffmpeg

        await modules['ffmpeg'].loadToPage()

        const downloadingFix = page.waitForEvent('download')
        await page.evaluate(async () => {
            const { testVideo, getFFmpeg, utils } = window as any
            const ffmpeg = await getFFmpeg()
            console.log('ffmpeg loaded. converting file....')
            const input = await new Blob(testVideo, { type: 'video/mp4' }).arrayBuffer()
            await ffmpeg.writeFile('input.mp4', new Uint8Array(input))
            console.log('input file written, executing....')
            await ffmpeg.exec(['-i', 'input.mp4', '-c', 'copy', 'output.mp4'])
            console.log('output file written, downloading....')
            const data = await ffmpeg.readFile('output.mp4')
            const output = new Blob([data], { type: 'video/mp4' })
            utils.file.downloadBlob(output, 'fixed.mp4')
        })

        const downloadedFix = await downloadingFix
        await downloadedFix.saveAs('out/fixed.mp4')
        const infoFix = await readMovieInfo('out/fixed.mp4')

        logger.info('infoFix: ', infoFix)

        expect(infoFix.relativeDuration()).toBeGreaterThan(0) // fixed info
    }
)


test.fail(
    '測試透過 Buffer 錄製 FLV 推流並用 ffmpeg.wasm 修復資訊損壞',
    { tag: "@scoped" },
    async ({ context, room: { stream }, page, modules }) => {

        test.slow()
        const chunkSizeExpectedMoreThan = 50

        context.on('console', logger.debug)

        await modules['player'].loadToPage()
        await modules['utils'].loadToPage()

        const downloading = page.waitForEvent('download')
        const length = await page.evaluate(async ({ stream, chunkSizeExpectedMoreThan: expected }) => {

            const { player, utils } = window as any

            let timeout = undefined
            let fail = false

            function resetAndTimeout() {
                clearTimeout(timeout)
                timeout = setTimeout(() => fail = true, 1000 * 30)
            }

            const chunks = []
            const cleanup = await player.recordStream(stream, (buffer: ArrayBuffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' })
                chunks.push(blob)
                resetAndTimeout()
                console.info('total chunks size: ', chunks.length, buffer.byteLength)
            }, 'flv')

            while (chunks.length <= expected && !fail) {
                await utils.misc.sleep(1000)
            }

            clearTimeout(timeout)
            console.info('cleaning up stream buffer...')
            await cleanup()

            utils.file.download('test.flv', [...chunks], 'video/x-flv')

            {
                // for next use
                (window as any).testVideo = chunks;
            }

            return chunks.length

        }, { stream, chunkSizeExpectedMoreThan })

        expect(length).toBeGreaterThan(chunkSizeExpectedMoreThan)
        const downloaded = await downloading
        await downloaded.saveAs('out/test.flv')
        const info = await readMovieInfo('out/test.flv')

        logger.info('info: ', info)

        expect(info.relativeDuration()).toBe(0) // broken info

        // now trying to fix broken info with ffmpeg

        await modules['ffmpeg'].loadToPage()

        const downloadingFix = page.waitForEvent('download')
        await page.evaluate(async () => {
            const { testVideo, getFFmpeg, utils } = window as any
            const ffmpeg = await getFFmpeg()
            console.log('ffmpeg loaded. converting file....')
            const input = await new Blob(testVideo, { type: 'video/x-flv' }).arrayBuffer()
            await ffmpeg.writeFile('input.flv', new Uint8Array(input))
            console.log('input file written, executing....')
            await ffmpeg.exec(['-i', 'input.flv', '-c', 'copy', 'output.flv'])
            console.log('output file written, downloading....')
            const data = await ffmpeg.readFile('output.flv')
            const output = new Blob([data], { type: 'video/x-flv' })
            utils.file.downloadBlob(output, 'fixed.flv')
        })

        const downloadedFix = await downloadingFix
        await downloadedFix.saveAs('out/fixed.flv')
        const infoFix = await readMovieInfo('out/fixed.flv')

        logger.info('infoFix: ', infoFix)
        
        expect(infoFix.relativeDuration()).toBeGreaterThan(0) // fixed info

    }

)
