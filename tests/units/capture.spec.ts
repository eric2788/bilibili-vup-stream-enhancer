import { expect } from "@playwright/test";
import { test } from "@tests/fixtures/component";
import logger from "@tests/helpers/logger";

test.slow()

test('測試畫質轉換', async ({ page, room: { roomid, stream }, modules }) => {

    await page.goto(`https://live.bilibili.com/${roomid}`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('video')
    await modules['utils'].loadToPage()

    const checker = await page.evaluate(async (stream) => {

        const self = window as any

        console.debug('waiting for player...')
        while (!self.$P2PLivePlayer && !self.livePlayer) {
            console.debug('check: ', self.$P2PLivePlayer, self.livePlayer)
            await self.utils.misc.sleep(1000)
        }

        const player = self.$P2PLivePlayer || self.livePlayer
        
        const qualities = new Set([...stream.filter(s => s.codec === 'avc').map(s => s.quality)])
        console.debug('available qualities: ', [...qualities])

        async function switchQuality(quality) {
            const video = document.querySelector('video')
            console.debug('switching quality...')
            player.switchQuality(quality)
            let counts = 0
            while (document.getElementById(video.id)) {
                await self.utils.misc.sleep(150)
                if (counts++ === 3000 / 150) {
                    break
                }
            }
        }

        const checker = {}

        for (const quality of qualities) {
            console.debug('switching to quality: ', quality)
            await switchQuality(`${quality}`)
            const actualChanged = player.getPlayerInfo().quality
            console.info('quality is now: ', actualChanged)
            checker[quality] = actualChanged
        }

        return checker

    }, stream)

    for (const key in checker) {
        expect(checker[key]).toBe(key)
    }

})


test('測試 MediaRecorder + captureStream', async ({ page, room: { roomid }, modules }) => {

    await page.goto(`https://live.bilibili.com/${roomid}`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('video')

    await modules['utils'].loadToPage()

    const download = page.waitForEvent('download')
    const chunks = await page.evaluate(async () => {

        const { utils } = window as any

        const video = document.querySelector('video')
        video.muted = false // unmute is required for captureStream

        const stream = video.captureStream()
        const recorder = new MediaRecorder(stream)

        const chunks = []

        recorder.ondataavailable = (e) => {
            console.debug('data available: ', e.data.size)
            chunks.push(e.data)
        }

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'test.webm'
            a.click()
        }

        recorder.start(1000)
        await utils.misc.sleep(10000)

        recorder.stop()

        await utils.misc.sleep(3000)

        return {
            size: chunks.map(c => c.size).reduce((a, b) => a + b),
            length: chunks.length
        }

    })

    logger.info('chunks: ', chunks)

    // length should be greater than 5
    expect(chunks.length).toBeGreaterThan(5)
    // size should be greater than 1000000
    expect(chunks.size).toBeGreaterThan(1000000)

    const downloaded = await download

    expect(downloaded.suggestedFilename()).toBe('test.webm')

})

test.fail('測試 MediaRecorder 在靜音時的錄製', async ({ page, room: { roomid }, modules }) => {

    await page.goto(`https://live.bilibili.com/${roomid}`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('video')

    await modules['utils'].loadToPage()

    const download = page.waitForEvent('download')
    const chunks = await page.evaluate(async () => {

        const { utils } = window as any

        const video = document.querySelector('video')
        video.muted = true

        const stream = video.captureStream()
        const recorder = new MediaRecorder(stream)

        const chunks = []

        recorder.ondataavailable = (e) => {
            console.debug('data available: ', e.data.size)
            chunks.push(e.data)
        }

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'test.webm'
            a.click()
        }

        recorder.start(1000)
        await utils.misc.sleep(10000)

        recorder.stop()

        await utils.misc.sleep(3000)

        return {
            size: chunks.map(c => c.size).reduce((a, b) => a + b),
            length: chunks.length
        }

    })

    logger.info('chunks: ', chunks)

    // length should be greater than 5
    expect(chunks.length).toBeGreaterThan(5)
    // size should be greater than 1000000
    expect(chunks.size).toBeGreaterThan(1000000)

    const downloaded = await download

    expect(downloaded.suggestedFilename()).toBe('test.webm')

})

