import { test, expect } from "@tests/fixtures/content"
import logger from "@tests/helpers/logger"
import { readMovieInfo } from "@tests/utils/file"
import { testFeatureRoomList } from "@tests/utils/playwright"
import fs from 'fs/promises'

test.beforeEach(async ({ content, context, tabUrl, isThemeRoom }) => {

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
    await settingsPage.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
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

test('測試錄製按鈕有否根據設定顯示', async ({ content, context, tabUrl }) => {

    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')

    await expect(button).toBeVisible()
    await expect(timer).toBeVisible()

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('隐藏录制按钮').click() // hide the ui
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

test('測試錄製 FLV', async ({ content, page, context, tabUrl }) => {

    test.slow()

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    await settingsPage.getByTestId('record-output-type').locator('div > div').nth(0).click()
    await settingsPage.getByText('FLV').click()

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    logger.info('正在錄製...')
    const button = content.getByTestId('record-button')
    await content.waitForTimeout(30000)

    const download = page.waitForEvent('download')
    await button.click()
    await expect(content.getByText('视频下载成功。')).toBeVisible()

    const downloaded = await download
    expect(() => downloaded.suggestedFilename().endsWith('.flv')).toBeTruthy()
    await downloaded.saveAs('out/recording.flv')

    const info = await readMovieInfo('out/recording.flv')

    logger.info('視頻信息:', info)

    expect(info.relativeDuration()).toBeGreaterThan(30)
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

    expect(info.relativeDuration()).toBeGreaterThan(30)
})

test('測試熱鍵錄製', async ({ page, tabUrl, context, content }) => {

    test.slow()

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    const input = settingsPage.getByTestId('record-hotkey')
    await input.click()
    await expect(input).toHaveValue('监听输入中...')
    await input.press('Control+Shift+R')
    await expect(input).toHaveValue('Ctrl+Shift+R')

    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    logger.info('正在錄製...')
    await page.waitForTimeout(30000)

    const downloading = page.waitForEvent('download')
    await page.keyboard.press('Control+Shift+R')

    const downloaded = await downloading
    expect(() => downloaded.suggestedFilename().endsWith('.mp4')).toBeTruthy()
    await downloaded.saveAs('out/recording.mp4')

    const info = await readMovieInfo('out/recording.mp4')

    logger.info('視頻信息:', info)

    expect(info.relativeDuration()).toBeGreaterThan(30)
})


test('測試錄製時長', async ({ content, page }) => {

    // 10 mins: 6 mins recording + 4 mins operations
    test.setTimeout(600000)

    const button = content.getByTestId('record-button')
    const timer = content.getByTestId('record-timer')

    // default using 5 mins duration, so use 6 mins here
    await timer.waitFor({ state: 'visible' })
    logger.info('正在錄製...')
    await page.waitForTimeout(360000)

    // timer should be fixed on 5 mins
    await expect(timer).toHaveText('00:05:00')
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


test('測試手動錄製', async ({ content, page, context, tabUrl }) => {

    test.slow()

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    await settingsPage.getByTestId('record-duration').locator('div > div').nth(0).click()
    await settingsPage.getByText('手动录制').click()

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


test('測試 HLS 完整編譯', async ({ content, page, context, tabUrl }) => {

    // I bet 10 mins for this
    test.setTimeout(600000)

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    await settingsPage.getByTestId('record-fix').locator('div > div').nth(0).click()
    await settingsPage.getByText('完整编译').click()

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


test('測試 FLV 完整編譯', async ({ content, page, context, tabUrl }) => {

    // I bet 10 mins for this
    test.setTimeout(600000)

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()

    // change to flv first
    await settingsPage.getByTestId('record-output-type').locator('div > div').nth(0).click()
    await settingsPage.getByText('FLV').click()

    await settingsPage.getByTestId('record-fix').locator('div > div').nth(0).click()
    await settingsPage.getByText('完整编译').click()

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