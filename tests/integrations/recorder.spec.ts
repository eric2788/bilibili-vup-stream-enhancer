import { expect, test } from "@tests/fixtures/component";
import logger from "@tests/helpers/logger";
import { readMovieInfo } from "@tests/utils/file";

// because they both use single-threaded, so -c copy is needed for boosting time

test(
    '測試透過 Buffer 錄製 HLS 推流並用 ffmpeg.wasm 修復資訊損壞 + 剪時',
    async ({ room: { stream, roomid }, page, modules }) => {

        await modules['recorder'].loadToPage()
        await modules['utils'].loadToPage()

        const downloading = page.waitForEvent('download')
        const length = await page.evaluate(async ({ stream, roomid }) => {

            const { createRecorder, utils } = window as any

            const recorder = createRecorder(roomid, stream,
                'buffer',
                {
                    type: 'hls',
                    codec: 'avc'
                }
            )

            await recorder.start()
            await utils.misc.sleep(30000)

            const { chunks } = await recorder.loadChunkData()
            utils.file.download('test.mp4', [...chunks], 'video/mp4')

            console.info('cleaning up stream buffer...')
            await recorder.stop()
            await recorder.flush()

            {
                // for next use
                (window as any).testVideo = chunks;
            }

            return chunks.length

        }, { stream, roomid })

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
            await ffmpeg.exec([
                '-fflags', '+genpts+igndts', 
                '-i', 'input.mp4', 
                '-c', 'copy', 
                'output-uncut.mp4'
            ])
            await ffmpeg.exec([
                '-fflags', '+genpts+igndts', 
                '-sseof', '-15', 
                '-i', 'output-uncut.mp4', 
                '-b:v', '0', '-r', '60', 
                '-avoid_negative_ts', 'make_zero',
                '-c', 'copy', 
                'output.mp4'
            ])
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

        // fixed info with gap 15-18s
        expect(Math.round(infoFix.relativeDuration())).toBeGreaterThanOrEqual(15) 
        expect(infoFix.relativeDuration()).toBeLessThanOrEqual(20) 
    }
)


test(
    '測試透過 Buffer 錄製 FLV 推流並用 ffmpeg.wasm 修復資訊損壞 + 剪時',
    async ({ room: { stream, roomid }, page, modules }) => {

        await modules['recorder'].loadToPage()
        await modules['utils'].loadToPage()

        const downloading = page.waitForEvent('download')
        const length = await page.evaluate(async ({ stream, roomid }) => {

            const { createRecorder, utils } = window as any

            const recorder = createRecorder(roomid, stream,
                'buffer',
                {
                    type: 'flv',
                    codec: 'avc'
                }
            )

            await recorder.start()
            await utils.misc.sleep(30000)

            const { chunks } = await recorder.loadChunkData()
            utils.file.download('test.flv', [...chunks], 'video/x-flv')

            console.info('cleaning up stream buffer...')
            await recorder.stop()
            await recorder.flush()

            {
                // for next use
                (window as any).testVideo = chunks;
            }

            return chunks.length

        }, { stream, roomid })

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
            await ffmpeg.exec([
                '-fflags', '+genpts+igndts', 
                '-i', 'input.flv', 
                '-c', 'copy', 
                'output-uncut.flv'
            ])
            await ffmpeg.exec([
                '-fflags', '+genpts+igndts', 
                '-sseof', '-15', 
                '-i', 'output-uncut.flv', 
                '-b:v', '0', '-r', '60', '-c', 'copy', 
                '-avoid_negative_ts', 'make_zero',
                'output.flv'
            ])
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

        // fixed info with gap 15-18s
        expect(Math.round(infoFix.relativeDuration())).toBeGreaterThanOrEqual(15) 
        expect(infoFix.relativeDuration()).toBeLessThanOrEqual(20) 

    }

)

test(
    '測試透過 Capture 錄製 WEBM 推流並用 ffmpeg.wasm 修復資訊損壞 + 剪時',
    { tag: "@scoped" },
    async ({ room: { stream, roomid }, page, modules }) => {

        await page.goto(`https://live.bilibili.com/${roomid}`, { waitUntil: 'domcontentloaded' })
        await page.waitForSelector('video')

        await modules['recorder'].loadToPage()
        await modules['utils'].loadToPage()

        // gesture to start the stream
        await page.click('body')

        // for unmute
        page.once('dialog', d => d.accept())
        const downloading = page.waitForEvent('download')
        const length = await page.evaluate(async ({ stream, roomid }) => {

            const { createRecorder, utils } = window as any

            // autoSwitchQuality require extension
            const recorder = createRecorder(roomid, stream, 'capture', { autoSwitchQuality: false })

            await recorder.start()
            await utils.misc.sleep(30000) // gap for appending

            const { chunks } = await recorder.loadChunkData()
            utils.file.download('test.webm', [...chunks], 'video/webm')

            console.info('cleaning up stream buffer...')
            await recorder.stop()
            await recorder.flush()

            {
                // for next use
                (window as any).testVideo = chunks;
            }

            return chunks.length

        }, { stream, roomid })

        expect(length).toBeGreaterThanOrEqual(15)
        const downloaded = await downloading
        await downloaded.saveAs('out/test.webm')

        // cannot find a library to read webm info, so we will use ffmpeg to fix it
        // const info = await readMovieInfo('out/test.webm')
        // logger.info('info: ', info)
        // expect(info.relativeDuration() || 0).toBe(0) // broken info
        // now trying to fix broken info with ffmpeg

        await modules['ffmpeg'].loadToPage()

        const downloadingFix = page.waitForEvent('download')
        await page.evaluate(async () => {
            const { testVideo, getFFmpeg, utils } = window as any
            const ffmpeg = await getFFmpeg()
            console.log('ffmpeg loaded. converting file....')
            const input = await new Blob(testVideo, { type: 'video/webm' }).arrayBuffer()
            await ffmpeg.writeFile('input.webm', new Uint8Array(input))
            console.log('input file written, executing....')
            await ffmpeg.exec([
                '-fflags', '+genpts+igndts', 
                '-i', 'input.webm', 
                '-c', 'copy', 
                'output-uncut.mp4'
            ])
            await ffmpeg.exec([
                '-fflags', '+genpts+igndts', 
                '-sseof', '-15', 
                '-i', 'output-uncut.mp4', 
                '-b:v', '0', '-r', '60', '-c', 'copy', 
                '-avoid_negative_ts', 'make_zero',
                'output.mp4'
            ])
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

        // fixed info with gap 15-18s
        expect(Math.round(infoFix.relativeDuration())).toBeGreaterThanOrEqual(15) 
        expect(infoFix.relativeDuration()).toBeLessThanOrEqual(20) 
    }
)
