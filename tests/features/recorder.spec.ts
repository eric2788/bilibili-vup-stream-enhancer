import { test, expect } from "@tests/fixtures/content"
import logger from "@tests/helpers/logger"
import type { PageFrame } from "@tests/helpers/page-frame"
import { readJpeg, readMovieInfo } from "@tests/utils/file"
import { selectOption, testFeatureRoomList } from "@tests/utils/playwright"
import fs from 'fs/promises'

test.beforeEach(async ({ content, context, optionPageUrl, isThemeRoom }) => {

    logger.info('正在整理 out 文件夾...')
    await fs.rm('out', { recursive: true, force: true })
    await fs.mkdir('out', { recursive: true })

    if (isThemeRoom) {
        test.slow()
        await content.getByText('挂接成功').waitFor({
            state: 'visible',
            timeout: 60000
        })
    }


    logger.info('正在啟用功能...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('启用快速切片').click()
    await settingsPage.getByText("保存设定").click()
    await settingsPage.getByText("所有设定已经保存成功。").waitFor({ state: 'visible' })
    await settingsPage.close()
})


test('測試功能元素是否存在', async ({ content }) => {

    const csui = content.locator('bjf-csui')
    await csui.waitFor({ state: 'attached', timeout: 10000 })

    await expect(csui.locator('section#bjf-feature-recorder')).toBeAttached()

})

test('測試界面元素是否存在', async ({ content }) => {

    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')
    const screenshot = content.getByTestId('screenshot-button')

    await expect(button).toBeVisible()
    await expect(timer).toBeVisible()
    await expect(screenshot).toBeVisible()
})

test('測試界面按鈕有否根據設定顯示', async ({ content, context, optionPageUrl }) => {

    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')

    await expect(button).toBeVisible()
    await expect(timer).toBeVisible()

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('隐藏界面按钮').click() // hide the ui
    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    await content.waitForTimeout(3000)

    await expect(button).toBeHidden()
    await expect(timer).toBeHidden()
})

test('測試 timer 有否更新', async ({ content }) => {

    const timer = content.getByTestId('record-timer')

    const currentText = await timer.textContent()
    logger.info('当前时间戳:', currentText)

    await content.waitForTimeout(3000)

    const newText = await timer.textContent()
    logger.info('新的时间戳:', newText)

    expect(newText).not.toEqual(currentText)
})

test('測試房間名單列表(黑名單/白名單)',
    testFeatureRoomList(
        'recorder',
        expect,
        (content) => content.getByTestId('record-button')
    )
)

test('測試截圖', async ({ content, page }) => {

    const button = content.getByTestId('screenshot-button')
    const download = page.waitForEvent('download')

    await button.click()
    await expect(content.getByText('截图成功并已保存')).toBeVisible()

    const downloaded = await download
    expect(() => downloaded.suggestedFilename().endsWith('.jpeg')).toBeTruthy()
    await downloaded.saveAs('out/screenshot.jpeg')

    // 默认超清画质
    const info = await readJpeg('out/screenshot.jpeg')
    logger.info('图片信息:', info)

    expect(info.width).toBeLessThanOrEqual(1920)
    expect(info.height).toBeLessThanOrEqual(1080)

    expect(info.width).toBeGreaterThanOrEqual(854)
    expect(info.height).toBeGreaterThanOrEqual(480)
})

test('測試錄製 FLV', async ({ content, page, context, optionPageUrl }) => {

    test.slow()
    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    await selectOption(
        settingsPage.getByTestId('record-output-type'),
        'FLV'
    )

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    await timer.waitFor({ state: 'visible' })
    logger.info('正在錄製...')
    await content.waitForTimeout(30000)

    const download = page.waitForEvent('download')
    await button.click()
    await expect(content.getByText('视频下载成功。')).toBeVisible()

    const downloaded = await download
    expect(() => downloaded.suggestedFilename().endsWith('.flv')).toBeTruthy()
    await downloaded.saveAs('out/recording.flv')

    const info = await readMovieInfo('out/recording.flv')

    logger.info('視頻信息:', info)

    expect(info.relativeDuration()).toBeGreaterThanOrEqual(30)
})

test('測試錄製 HLS', async ({ content, page }) => {

    test.slow()

    // 默認使用 MP4
    logger.info('正在錄製...')
    const button = content.getByTestId('record-button')
    await content.waitForTimeout(30000)

    const download = page.waitForEvent('download')
    await button.click()
    await expect(content.getByText('视频下载成功。')).toBeVisible()

    const downloaded = await download
    expect(() => downloaded.suggestedFilename().endsWith('.mp4')).toBeTruthy()
    await downloaded.saveAs('out/recording.mp4')

    const info = await readMovieInfo('out/recording.mp4')

    logger.info('視頻信息:', info)

    expect(info.relativeDuration()).toBeGreaterThanOrEqual(30)
})

test('測試錄製 WEBM -> MP4', async ({ content, page, context, optionPageUrl }) => {

    test.slow()

    page.on('dialog', d => {
        if (d.message().includes('解除静音')) {
            d.accept()
        }
    })

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    await selectOption(
        settingsPage.getByTestId('record-mechanism'),
        '捕捉直播流媒体元素'
    )

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    //const content = await room.reloadAndGetLocator()
    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')

    await timer.waitFor({ state: 'visible' })
    logger.info('正在錄製...')
    await sleepAndCheckBuffer(content, 30)

    const download = page.waitForEvent('download')
    await button.click()
    await expect(content.getByText('视频下载成功。')).toBeVisible()

    const downloaded = await download
    expect(() => downloaded.suggestedFilename().endsWith('.mp4')).toBeTruthy()
    await downloaded.saveAs('out/recording.mp4')

    const info = await readMovieInfo('out/recording.mp4')

    logger.info('視頻信息:', info)

    // -1 gap
    expect(info.relativeDuration()).toBeGreaterThanOrEqual(30 - 1)
})

test('測試熱鍵錄製', async ({ page, optionPageUrl, context, content }) => {

    test.slow()

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    const input = settingsPage.getByTestId('record-hotkey')

    logger.info('正在測試按鍵衝突阻止...')
    await input.click()
    await expect(input).toHaveValue('监听输入中...')
    await input.press('V')
    await expect(settingsPage.getByText('热键冲突')).toBeVisible()

    logger.info('正在測試修改熱鍵...')
    await input.click()
    await expect(input).toHaveValue('监听输入中...')
    await input.press('Control+Shift+R')
    await expect(input).toHaveValue('Ctrl+Shift+R')

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    logger.info('正在錄製...')
    await page.waitForTimeout(30000)

    const downloading = page.waitForEvent('download')
    await content.locator('body').click() // gesture the iframe (if theme room)
    await page.keyboard.press('Control+Shift+R')

    const downloaded = await downloading
    expect(() => downloaded.suggestedFilename().endsWith('.mp4')).toBeTruthy()
    await downloaded.saveAs('out/recording.mp4')

    const info = await readMovieInfo('out/recording.mp4')

    logger.info('視頻信息:', info)

    expect(info.relativeDuration()).toBeGreaterThanOrEqual(30)
})

test('測試熱鍵截圖', async ({ page, content, context, optionPageUrl }) => {

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    const input = settingsPage.getByTestId('screenshot-hotkey')

    logger.info('正在測試按鍵衝突阻止...')
    await input.click()
    await expect(input).toHaveValue('监听输入中...')
    await input.press('X')
    await expect(settingsPage.getByText('热键冲突')).toBeVisible()

    logger.info('正在測試修改熱鍵...')
    await input.click()
    await expect(input).toHaveValue('监听输入中...')
    await input.press('Control+Shift+V')
    await expect(input).toHaveValue('Ctrl+Shift+V')

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    await content.getByTestId('screenshot-button').waitFor({ state: 'visible' })
    const download = page.waitForEvent('download')
    await content.locator('body').click() // gesture the iframe (if theme room)
    await page.keyboard.press('Control+Shift+V')
    await expect(content.getByText('截图成功并已保存')).toBeVisible()

    const downloaded = await download
    expect(() => downloaded.suggestedFilename().endsWith('.jpeg')).toBeTruthy()
    await downloaded.saveAs('out/screenshot.jpeg')

    const info = await readJpeg('out/screenshot.jpeg')
    logger.info('图片信息:', info)

    expect(info.width).toBeLessThanOrEqual(1920)
    expect(info.height).toBeLessThanOrEqual(1080)

    expect(info.width).toBeGreaterThanOrEqual(854)
    expect(info.height).toBeGreaterThanOrEqual(480)
})

test('測試錄製時長', async ({ content, page }) => {

    // 10 mins: 6 mins recording + 4 mins operations
    test.setTimeout(600000)

    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')

    // default using 5 mins duration, so use 6 mins here
    await timer.waitFor({ state: 'visible' })
    logger.info('正在錄製...')
    await sleepAndCheckBuffer(content, 360)

    // timer should be fixed on 5 mins
    await expect.poll(() => timer.textContent(), {
        message: '錄製時長未達到 5 分鐘或顯示沒有固定到 5 分鐘',
        timeout: 30000,
    }).toBe('00:05:00')

    const download = page.waitForEvent('download')
    await button.click()

    const downloaded = await download
    expect(() => downloaded.suggestedFilename().endsWith('.mp4')).toBeTruthy()
    await downloaded.saveAs('out/recording.mp4')

    const info = await readMovieInfo('out/recording.mp4')

    logger.info('視頻信息:', info)
    logger.info('相對時長:', info.relativeDuration())

    // should be around 5 mins
    // here we use ~10s
    const gap = 10
    expect(info.relativeDuration()).toBeGreaterThanOrEqual(300 - gap)
    expect(info.relativeDuration()).toBeLessThanOrEqual(300 + gap)

})

test('測試手動錄製', async ({ content, page, context, optionPageUrl }) => {

    test.slow()

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    await selectOption(
        settingsPage.getByTestId('record-duration'),
        '手动录制'
    )

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')

    // 非錄製狀態
    await expect(timer).toBeHidden()

    await button.click()
    await expect(content.getByText('开始录制...')).toBeVisible()
    await expect(timer).toBeVisible()

    await content.waitForTimeout(15000)

    const download = page.waitForEvent('download')
    await button.click()
    await expect(content.getByText('录制已中止。')).toBeVisible()

    const downloaded = await download
    expect(() => downloaded.suggestedFilename().endsWith('.mp4')).toBeTruthy()
    await downloaded.saveAs('out/recording.mp4')

    const info = await readMovieInfo('out/recording.mp4')
    logger.info('視頻信息:', info)

    expect(info.relativeDuration()).toBeGreaterThanOrEqual(15)

})

test('測試 HLS 完整編譯', async ({ content, page, context, optionPageUrl }) => {

    // I bet 10 mins for this
    test.setTimeout(600000)

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    await selectOption(
        settingsPage.getByTestId('record-fix'),
        '完整编译'
    )

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')

    await timer.waitFor({ state: 'visible' })
    logger.info('正在錄製...')

    await page.waitForTimeout(10000)

    const encoderPage = context.waitForEvent('page')
    await button.click()
    const encoder = await encoderPage
    encoder.on('console', msg => logger.info('[encoder.html]', msg.text()))

    const frontend = (async () => {
        await expect(content.getByText('准备视频中...')).toBeVisible()
        await expect(content.getByText('视频已发送到后台进行完整编码')).toBeVisible({
            timeout: 30000 // longer wait
        })
    })();

    const backend = (async () => {
        await expect(encoder.getByText('正在加载 FFMpeg')).toBeVisible()
        await expect(encoder.getByText('FFMpeg 已成功加载。')).toBeVisible()

        try {
            await expect(encoder.getByText('正在等待视频数据')).toBeVisible()
        } catch {
            logger.warn('由於檔案過小，獲取視頻數據飛快，快到看不見 ._.')
        }

    })();


    await Promise.all([frontend, backend])
    await encoder.bringToFront()

    try {
        await expect(encoder.getByText('修复视频中')).toBeVisible()
        await expect(encoder.getByText('视频已修复完成。')).toBeVisible()
    } catch {
        logger.warn('由於檔案過小，修復視頻飛快，快到看不見 ._.')
    }

    await expect(encoder.getByText('编译视频中')).toBeVisible()

    const downloaded = await encoder.waitForEvent('download', {
        timeout: 600000
    })

    await expect(encoder.getByText('视频已编译完成。')).toBeVisible()
    expect(encoder.getByText(downloaded.suggestedFilename())).toBeVisible()
    expect(() => downloaded.suggestedFilename().endsWith('.mp4')).toBeTruthy()

    await downloaded.saveAs('out/recording.mp4')
    const info = await readMovieInfo('out/recording.mp4')

    logger.info('視頻信息:', info)

    expect(info.relativeDuration()).toBeGreaterThanOrEqual(10)
})

test('測試 FLV 完整編譯', async ({ content, page, context, optionPageUrl }) => {

    // I bet 10 mins for this
    test.setTimeout(600000)

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    // change to flv first
    await selectOption(
        settingsPage.getByTestId('record-output-type'),
        'FLV'
    )

    await selectOption(
        settingsPage.getByTestId('record-fix'),
        '完整编译'
    )

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')

    await timer.waitFor({ state: 'visible' })
    logger.info('正在錄製...')

    await page.waitForTimeout(10000)

    const encoderPage = context.waitForEvent('page')
    await button.click()
    const encoder = await encoderPage
    encoder.on('console', msg => logger.info('[encoder.html]', msg.text()))

    const frontend = (async () => {
        await expect(content.getByText('准备视频中...')).toBeVisible()
        await expect(content.getByText('视频已发送到后台进行完整编码')).toBeVisible({
            timeout: 30000 // longer wait
        })
    })();

    const backend = (async () => {
        await expect(encoder.getByText('正在加载 FFMpeg')).toBeVisible()
        await expect(encoder.getByText('FFMpeg 已成功加载。')).toBeVisible()

        try {
            await expect(encoder.getByText('正在等待视频数据')).toBeVisible()
        } catch {
            logger.warn('由於檔案過小，獲取視頻數據飛快，快到看不見 ._.')
        }

    })();


    await Promise.all([frontend, backend])
    await encoder.bringToFront()

    try {
        await expect(encoder.getByText('修复视频中')).toBeVisible()
        await expect(encoder.getByText('视频已修复完成。')).toBeVisible()
    } catch {
        logger.warn('由於檔案過小，修復視頻飛快，快到看不見 ._.')
    }

    await expect(encoder.getByText('编译视频中')).toBeVisible()

    const downloaded = await encoder.waitForEvent('download', {
        timeout: 600000
    })

    await expect(encoder.getByText('视频已编译完成。')).toBeVisible()
    expect(encoder.getByText(downloaded.suggestedFilename())).toBeVisible()
    expect(() => downloaded.suggestedFilename().endsWith('.flv')).toBeTruthy()

    await downloaded.saveAs('out/recording.flv')
    const info = await readMovieInfo('out/recording.flv')

    logger.info('視頻信息:', info)

    expect(info.relativeDuration()).toBeGreaterThanOrEqual(10)
})

test('測試 WEBM -> MP4 完整編譯', async ({ content, page, context, optionPageUrl }) => {
    // I bet 10 mins for this
    test.setTimeout(600000)

    page.on('dialog', d => {
        if (d.message().includes('解除静音')) {
            d.accept()
        }
    })

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    await selectOption(
        settingsPage.getByTestId('record-fix'),
        '完整编译'
    )

    await selectOption(
        settingsPage.getByTestId('record-mechanism'),
        '捕捉直播流媒体元素'
    )

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')

    await timer.waitFor({ state: 'visible' })
    logger.info('正在錄製...')

    await page.waitForTimeout(12000) // gap

    const encoderPage = context.waitForEvent('page')
    await button.click()
    const encoder = await encoderPage
    encoder.on('console', msg => logger.info('[encoder.html]', msg.text()))

    const frontend = (async () => {
        await expect(content.getByText('准备视频中...')).toBeVisible()
        await expect(content.getByText('视频已发送到后台进行完整编码')).toBeVisible({
            timeout: 30000 // longer wait
        })
    })();

    const backend = (async () => {
        await expect(encoder.getByText('正在加载 FFMpeg')).toBeVisible()
        await expect(encoder.getByText('FFMpeg 已成功加载。')).toBeVisible()

        try {
            await expect(encoder.getByText('正在等待视频数据')).toBeVisible()
        } catch {
            logger.warn('由於檔案過小，獲取視頻數據飛快，快到看不見 ._.')
        }

    })();


    await Promise.all([frontend, backend])
    await encoder.bringToFront()

    try {
        await expect(encoder.getByText('修复视频中')).toBeVisible()
        await expect(encoder.getByText('视频已修复完成。')).toBeVisible()
    } catch {
        logger.warn('由於檔案過小，修復視頻飛快，快到看不見 ._.')
    }

    await expect(encoder.getByText('编译视频中')).toBeVisible()

    const downloaded = await encoder.waitForEvent('download', {
        timeout: 600000
    })

    await expect(encoder.getByText('视频已编译完成。')).toBeVisible()
    expect(encoder.getByText(downloaded.suggestedFilename())).toBeVisible()
    expect(() => downloaded.suggestedFilename().endsWith('.mp4')).toBeTruthy()

    await downloaded.saveAs('out/recording.mp4')
    const info = await readMovieInfo('out/recording.mp4')

    logger.info('視頻信息:', info)

    expect(info.relativeDuration()).toBeGreaterThanOrEqual(10)
})

test('測試 WEBM 錄製 - 更換視頻源時的處理', async ({ content, page, api, room, optionPageUrl, context }) => {

    test.slow()

    const urls = await api.getStreamUrls(room.info.roomid)
    const qualities = new Set([...urls.filter(s => s.codec === 'avc').map(s => s.quality)])
    test.skip(qualities.size === 0, '無法獲取畫質')
    test.skip(qualities.size === 1, '只有一種畫質，無法測試')

    logger.debug('available qualities: ', [...qualities])

    page.on('dialog', d => {
        if (d.message().includes('解除静音')) {
            d.accept()
        }
    })

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    await selectOption(
        settingsPage.getByTestId('record-mechanism'),
        '捕捉直播流媒体元素'
    )

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')

    await timer.waitFor({ state: 'visible' })
    logger.info('正在錄製...')

    await page.waitForTimeout(10000)

    await page.evaluate(async (qualities) => {
        
        const self = window as any
        const current = self.$P2PLivePlayer.getPlayerInfo().quality
        const next = qualities.find(q => q.toString() !== current.toString())
        console.debug('current quality: ', current)
        console.debug('switching to quality: ', next)

        self.$P2PLivePlayer.switchQuality(next.toString())

    }, [ ...qualities ])

    logger.info('正在檢查有否視頻源更改的錯誤信息...')
    await expect(content.getByText('视频源已被更改, 请刷新页面重新进行录制')).toBeVisible({
        timeout: 30000
    })

    logger.info('正在檢查時間戳有否停止...')
    const currentText = await timer.textContent()
    await content.waitForTimeout(3000)
    const newText = await timer.textContent()
    expect(currentText).toEqual(newText)

    logger.info('正在檢查已錄製的視頻數據能否依然下載...')
    const download = page.waitForEvent('download')
    await button.click()
    await expect(content.getByText('视频下载成功。')).toBeVisible()

    const downloaded = await download
    expect(() => downloaded.suggestedFilename().endsWith('.mp4')).toBeTruthy()
    await downloaded.saveAs('out/recording.mp4')

    const info = await readMovieInfo('out/recording.mp4')
    logger.info('視頻信息:', info)

    expect(info.relativeDuration()).toBeGreaterThanOrEqual(5)
})

test('測試 WEBM 錄製 - 不解除靜音的處理', async ({ content, page, optionPageUrl, context }) => {

    // first, we need to mute the video
    await content.waitForSelector('video')
    await content.evaluate(() => {
        const video = document.querySelector('video')
        if (video?.muted === false) {
            video.muted = true
        }
    })

    page.on('dialog', d => {
        if (d.message().includes('解除静音')) {
            d.dismiss()
        }
    })

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    await selectOption(
        settingsPage.getByTestId('record-mechanism'),
        '捕捉直播流媒体元素'
    )

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    logger.info('正在等待靜音提示...')
    await expect(content.getByText('直播处于静音状态，无法录制')).toBeVisible()
    await expect(content.getByTestId('record-timer')).toBeHidden()
})

async function sleepAndCheckBuffer(content: PageFrame, seconds: number): Promise<void> {
    let times = 0
    while (times < seconds) {
        if (await content.getByText('已超过15秒没再接收到数据流').isVisible()) {
            logger.error('no buffer received on seconds: ', times)
            throw new Error('已超过15秒没再接收到数据流')
        }
        await content.waitForTimeout(1000)
        times++
    }
    logger.info('After seconds: ', times)
}