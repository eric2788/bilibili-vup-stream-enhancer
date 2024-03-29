import { expect, test } from "@tests/fixtures/component";
import logger from "@tests/helpers/logger";
import { readMovieInfo } from "@tests/utils/file";

// because they both use single-threaded, so -c copy is needed for boosting time

test(
    '測試透過 Buffer 錄製 HLS 推流並用 ffmpeg.wasm 修復資訊損壞 + 剪時',
    async ({ room: { stream }, page, modules }) => {

        await modules['player'].loadToPage()
        await modules['utils'].loadToPage()

        const downloading = page.waitForEvent('download')
        const length = await page.evaluate(async ({ stream }) => {

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

            await utils.misc.sleep(15000)

            console.info('cleaning up stream buffer...')
            p.stopAndDestroy()

            utils.file.download('test.mp4', [...chunks], 'video/mp4')

            {
                // for next use
                (window as any).testVideo = chunks;
            }

            return chunks.length

        }, { stream })

        expect(length).toBeGreaterThanOrEqual(15)
        const downloaded = await downloading
        await downloaded.saveAs('out/test.mp4')
        const info = await readMovieInfo('out/test.mp4')

        logger.info('info: ', info)

        expect(info.relativeDuration() || 0).toBe(0) // broken info

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
            await ffmpeg.exec(['-i', 'input.mp4', '-c', 'copy', 'output-uncut.mp4'])
            await ffmpeg.exec(['-sseof', '-15', '-i', 'output-uncut.mp4', '-c', 'copy', 'output.mp4'])
            console.log('output file written, downloading....')
            const data = await ffmpeg.readFile('output.mp4')
            const output = new Blob([data], { type: 'video/mp4' })
            utils.file.downloadBlob(output, 'fixed.mp4')
        })

        const downloadedFix = await downloadingFix
        await downloadedFix.saveAs('out/fixed.mp4')
        const infoFix = await readMovieInfo('out/fixed.mp4')

        logger.info('infoFix: ', infoFix)
        logger.info('duration:', infoFix.relativeDuration())

        expect(Math.round(infoFix.relativeDuration())).toBe(15) // fixed info
    }
)


test(
    '測試透過 Buffer 錄製 FLV 推流並用 ffmpeg.wasm 修復資訊損壞 + 剪時',
    async ({ room: { stream }, page, modules }) => {

        await modules['player'].loadToPage()
        await modules['utils'].loadToPage()

        const downloading = page.waitForEvent('download')
        const length = await page.evaluate(async ({ stream }) => {

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

            await utils.misc.sleep(15000)

            console.info('cleaning up stream buffer...')
            p.stopAndDestroy()

            utils.file.download('test.flv', [...chunks], 'video/x-flv')

            {
                // for next use
                (window as any).testVideo = chunks;
            }

            return chunks.length

        }, { stream })

        expect(length).toBeGreaterThanOrEqual(15)
        const downloaded = await downloading
        await downloaded.saveAs('out/test.flv')
        const info = await readMovieInfo('out/test.flv')

        logger.info('info: ', info)

        expect(info.relativeDuration() || 0).toBe(0) // broken info

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
            await ffmpeg.exec(['-i', 'input.flv', '-c', 'copy', 'output-uncut.flv']) 
            await ffmpeg.exec(['-sseof', '-15', '-i', 'output-uncut.flv', '-c', 'copy', 'output.flv'])
            console.log('output file written, downloading....')
            const data = await ffmpeg.readFile('output.flv')
            const output = new Blob([data], { type: 'video/x-flv' })
            utils.file.downloadBlob(output, 'fixed.flv')
        })

        const downloadedFix = await downloadingFix
        await downloadedFix.saveAs('out/fixed.flv')
        const infoFix = await readMovieInfo('out/fixed.flv')

        logger.info('infoFix: ', infoFix)
        logger.info('duration:', infoFix.relativeDuration())

        expect(Math.round(infoFix.relativeDuration())).toBeGreaterThanOrEqual(15) // fixed info, but using copy will not cut the time precisely

    }

)
