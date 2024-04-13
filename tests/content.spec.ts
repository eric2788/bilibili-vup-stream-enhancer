import { test, expect } from "./fixtures/content";
import logger from "./helpers/logger";
import { receiveOneBLiveMessage } from "./utils/bilibili";
import { random } from "./utils/misc";


test('測試主元素是否存在', async ({ content }) => {

    const csui = content.locator('bjf-csui')
    await csui.waitFor({ state: 'attached', timeout: 10000 })

    await expect(csui.locator('#bjf-root')).toBeAttached()
})

test('測試功能元素有否基於設定而消失/顯示', async ({ content, context, optionPageUrl }) => {

    // 默認只開了同傳字幕
    const csui = content.locator('bjf-csui')
    await csui.waitFor({ state: 'attached', timeout: 10000 })

    await expect(csui.locator('section#bjf-feature-jimaku')).toBeAttached()
    await expect(csui.locator('section#bjf-feature-recorder')).not.toBeAttached()
    await expect(csui.locator('section#bjf-feature-superchat')).not.toBeAttached()

    logger.info('正在修改設定')
    const settingsPage = await context.newPage()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('启用快速切片').click()
    await settingsPage.getByText('启用醒目留言').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    await expect(csui.locator('section#bjf-feature-recorder')).toBeAttached()
    await expect(csui.locator('section#bjf-feature-superchat')).toBeAttached()
})

test('测试扩展CSS有否影响到外围', async ({ content, isThemeRoom }) => {

    test.skip(isThemeRoom, '此測試不適用於大海報房間')

    logger.info('正在測試 CSS 有否外溢...')

    await content.evaluate(() => {
        const span = document.createElement('span')
        span.id = 'bjf-test-span'
        span.textContent = '测试 CSS 有否外溢'
        span.className = "text-red-500"
        document.body.append(span)
    })

    const span = content.locator('#bjf-test-span')
    await expect(span).toBeVisible()
    await expect(span).toHaveCSS('color', 'rgb(0, 0, 0)')

    logger.info('正在測試 CSS 有否在 shadow root 内生效...')

    await content.evaluate(() => {
        const root = document.querySelector('bjf-csui').shadowRoot
        const span = document.createElement('span')
        span.id = 'bjf-test-span-inside'
        span.className = "text-red-500"
        span.textContent = '测试 CSS 有否在 shadow root 内生效'
        root.append(span)
    })

    const spanInside = content.locator('#bjf-test-span-inside')
    await expect(spanInside).toBeVisible()
    await expect(spanInside).toHaveCSS('color', 'rgb(244, 67, 54)')
})


test('測試貼邊浮動按鈕和主菜單區塊是否存在', async ({ content }) => {

    const button = content.getByText('功能菜单')
    await expect(button).toBeAttached()
    await expect(button).toBeVisible()

    const zone = content.getByText('Bilibili Vup Stream Enhancer - vup观众直播增强扩展')
    await expect(zone).not.toBeInViewport()

    await button.click()
    await content.waitForTimeout(2000)

    await expect(zone).toBeInViewport()

})


test('測試是否挂接成功', async ({ room }) => {

    logger.info('正在等待挂接成功...')

    await expect.poll(async () => {
        const content = await room.reloadAndGetLocator()
        return await content.getByText('挂接成功').isVisible({ timeout: 3000 })
    }, {
        message: '挂接成功消息未出现',
        timeout: 60000,
    }).toBeTruthy()

    logger.info('正在等待BLive消息...')
    const content = await room.getContentLocator()
    const r = await receiveOneBLiveMessage(content)

    logger.info('成功收到BLive消息: ', r)

})


test('測試名單列表(黑名單/白名單)', async ({ context, content, optionPageUrl, room }) => {

    const button = content.getByText('功能菜单')
    await expect(button).toBeVisible()

    const settingsPage = await context.newPage()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('名单列表').click()
    const roomInput = settingsPage.getByTestId('black-list-rooms-input')
    await roomInput.fill(room.info.roomid.toString())
    await roomInput.press('Enter')
    await settingsPage.getByText('保存设定').click()

    await room.page.bringToFront()
    await content.waitForTimeout(1000)

    await expect(button).toBeHidden()

    await settingsPage.bringToFront()
    await settingsPage.getByText('使用为白名单').click()
    await settingsPage.getByText('保存设定').click()

    await room.page.bringToFront()
    await content.waitForTimeout(1000)

    await expect(button).toBeVisible()
})


test('測試进入设置按鈕', async ({ context, content, optionPageUrl }) => {

    await content.getByText('功能菜单').click()
    await content.locator('#bjf-main-menu').waitFor({ state: 'visible' })

    const popup = context.waitForEvent('page', { predicate: p => p.url().includes('options.html') })
    await content.getByText('进入设置').click()

    const settings = await popup

    expect(settings.url()).toBe(optionPageUrl)

})


test('測試添加到黑名单按鈕', async ({ content, page, room }) => {

    await content.getByText('功能菜单').click()
    await content.locator('#bjf-main-menu').waitFor({ state: 'visible' })
    page.once('dialog', d => d.accept())
    await content.getByText('添加到黑名单').click()

    await content.waitForTimeout(1000)
    content = await room.reloadAndGetLocator()
    await content.waitForTimeout(1000)

    const button = content.getByText('功能菜单')
    await expect(button).toBeHidden()

})

test('測試重新启动按鈕', async ({ content, optionPageUrl, context }) => {


    const settingsPage = await context.newPage()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('界面按钮显示').click()
    await settingsPage.getByText('重新启动按钮').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    await content.getByText('功能菜单').click()
    await content.waitForTimeout(2000)
    await content.getByText('重新启动').click()

    const button = content.getByText('功能菜单')
    await expect(button).toBeHidden()

    await content.waitForTimeout(1000)

    await expect(content.getByText('挂接成功')).toBeVisible({ timeout: 60000 })
    await expect(button).toBeVisible()

})


test('測試弹出直播视窗按鈕', async ({ context, optionPageUrl, content }) => {

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('启用弹出直播视窗').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    logger.info('正在測試弹出直播视窗按鈕...')
    await content.getByText('功能菜单').click()
    await content.locator('#bjf-main-menu').waitFor({ state: 'visible' })

    const popup = context.waitForEvent('page', { predicate: p => p.url().includes('stream.html') })
    await content.getByText('弹出直播视窗').click()
    const monitor = await popup
    await monitor.waitForTimeout(2000)

    logger.info('正在測試元素是否存在...')
    // video container
    await expect(monitor.locator('div#__plasmo > div#bjf-danmaku-container')).toBeVisible()

    // video area
    await expect(monitor.locator('video#bjf-video')).toBeVisible()

    // danmaku layer
    await expect(monitor.locator('.N-dmLayer')).toBeVisible()

    // media controller
    await expect(monitor.locator('media-controller#bjf-player')).toBeVisible()

    // media controller bar
    await expect(monitor.locator('media-control-bar')).toBeVisible()

    // media controller buttons
    const buttons = [
        'media-play-button',
        'media-live-button',
        'media-time-display',
        'media-mute-button',
        'media-volume-range',
        'media-chrome-button#danmaku-btn', // custom button
        'media-chrome-button#reload-btn' // custom button
    ]

    logger.info('正在測試媒體控制按鈕是否存在...')
    await monitor.locator('media-control-bar').hover()
    for (const button of buttons) {
        const locator = monitor.locator(button)
        await expect(locator).toBeVisible()
    }

    // Test custom buttons
    logger.info('正在測試媒體自定義按鈕...')

    // danmaku button
    await monitor.locator('media-control-bar').hover()
    await monitor.locator('#danmaku-btn').click()
    await expect(monitor.locator('.N-dmLayer')).toHaveCSS('display', 'none')
    await monitor.locator('#danmaku-btn').click()
    await expect(monitor.locator('.N-dmLayer')).toHaveCSS('display', 'block')

    // reload button
    await monitor.locator('media-control-bar').hover()
    const reload = monitor.waitForEvent('load')
    await monitor.locator('#reload-btn').click()
    await reload

    logger.info('正在測試直播畫面有否正常播放....')
    await monitor.waitForSelector('video', { state: 'visible' })

    const beforeCurrentTime = await monitor.evaluate(() => {
        return document.querySelector('video').currentTime
    })
    await monitor.waitForTimeout(3000)
    const afterCurrentTime = await monitor.evaluate(() => {
        return document.querySelector('video').currentTime
    })
    expect(afterCurrentTime).toBeGreaterThan(beforeCurrentTime)
    
    const beforeBufferEnd = await monitor.evaluate(async () => {
        const video = document.querySelector('video')
        return video.buffered.end(video.buffered.length - 1)
    }) 
    await monitor.waitForTimeout(3000)
    const afterBufferEnd = await monitor.evaluate(() => {
        const video = document.querySelector('video')
        return video.buffered.end(video.buffered.length - 1)
    })
    expect(afterBufferEnd).toBeGreaterThan(beforeBufferEnd)

    await monitor.close()
})


test('測試大海報房間下返回非海报界面按鈕', async ({ context, room, isThemeRoom }) => {

    test.skip(!isThemeRoom, '此測試只適用於大海報房間')

    const content = await room.getContentLocator()
    await content.locator('body').scrollIntoViewIfNeeded()

    await content.getByText('功能菜单').click()
    await content.locator('#bjf-main-menu').waitFor({ state: 'visible' })
    const popup = context.waitForEvent('page', { predicate: p => p.url().includes('/blanc') })
    await content.getByText('返回非海报界面').click()
    const blanc = await popup

    expect(blanc.url()).toBe('https://live.bilibili.com/blanc/' + room.info.roomid)

})

test('測試全屏時有否根據設定顯示隱藏浮動按鈕', async ({ content, context, optionPageUrl }) => {

    const button = content.getByText('功能菜单')
    await expect(button).toBeVisible()

    logger.info('正在測試禁用時切換網頁全屏...')
    await content.locator('#live-player').dblclick()
    await expect(button).toBeHidden()
    await content.locator('#live-player').dblclick()

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('界面按钮显示').click()
    await settingsPage.getByText('支持在网页全屏下显示').click() // enabled
    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    await expect(button).toBeVisible()

    logger.info('正在測試啟用時切換網頁全屏...')
    await content.locator('#live-player').dblclick()
    await expect(button).toBeVisible()
    await content.locator('#live-player').dblclick()

    await expect(button).toBeVisible()
})

test('测试仅限虚拟主播', async ({ context, room, optionPageUrl, api }) => {

    const nonVtbRooms = await api.getLiveRooms(1, 11) // 获取知识分区直播间
    test.skip(nonVtbRooms.length === 0, '没有知识分区直播间')

    await room.enterToRoom(random(nonVtbRooms))
    const content = await room.getContentLocator()

    const button = content.getByText('功能菜单')
    await expect(button).toBeHidden()

    const settingsPage = await context.newPage()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('仅限虚拟主播').click()
    await settingsPage.getByText('保存设定').click()

    await room.page.bringToFront()
    await content.waitForTimeout(1000)

    await expect(button).toBeVisible()

})

test('測試底部的按鈕', async ({ content, context }) => {

    const button = content.getByText('功能菜单')

    await button.click()
    await content.locator('#bjf-main-menu').waitFor({ state: 'visible' })
    let popup = context.waitForEvent('page', { predicate: p => p.url().includes('github.com') })
    await content.getByTitle('查看源代码').click()
    const p1 = await popup

    expect(p1.url()).toBe('https://github.com/eric2788/bilibili-vup-stream-enhancer')
    await p1.close()

    await button.click()
    await content.locator('#bjf-main-menu').waitFor({ state: 'visible' })
    popup = context.waitForEvent('page', { predicate: p => p.url().includes('t.me') })
    await content.getByTitle('联络作者').click()
    const p2 = await popup

    expect(p2.url()).toBe('https://t.me/Eric1008818')
    await p2.close()

    await button.click()
    await content.locator('#bjf-main-menu').waitFor({ state: 'visible' })
    popup = context.waitForEvent('page', { predicate: p => p.url().includes('github.com') })
    await content.getByTitle('贡献指南').click()
    const p3 = await popup

    expect(p3.url()).toBe('https://github.com/eric2788/bilibili-vup-stream-enhancer/blob/master/CONTRIBUTING.md')
    await p3.close()
})

test('測試导航', async ({ room, content, serviceWorker }) => {

    const overlay = content.locator('.react-joyride__overlay')

    const menuButton = content.getByText('功能菜单')
    await menuButton.click()
    await content.locator('#bjf-main-menu').waitFor({ state: 'visible' })

    const button = content.getByTitle('使用导航')
    await expect(button).toBeVisible()
    await button.click()
    await content.waitForTimeout(500)
    await expect(overlay).toBeVisible()

    logger.info('正在測試導航前向...')

    const next = content.locator('[data-test-id=button-primary]').filter({ hasText: '下一步' })
    const previous = content.locator('[data-test-id=button-back]')
    const skip = content.locator('[data-test-id=button-skip]')
    const finish = content.locator('[data-test-id=button-primary]').filter({ hasText: '完成' })

    while (await next.isVisible()) {
        await next.click()
        await content.waitForTimeout(100)
    }

    await expect(finish).toBeVisible()
    await finish.click()

    logger.info('正在測試導航返回...')
    await menuButton.click()
    await content.locator('#bjf-main-menu').waitFor({ state: 'visible' })
    await button.click()

    if (await next.isVisible()) {
        await next.click()
        await expect(previous).toBeVisible()
        await previous.click()
    }

    logger.info('正在測試導航跳過...')

    await expect(skip).toBeVisible()
    await skip.click()

    await expect(overlay).toBeHidden()

    logger.info('正在測試默認啓用自動導航...')

    {
        await serviceWorker.evaluate(async () => {
            await chrome.storage.local.remove('no_auto_journal.content')
        })
        const content = await room.reloadAndGetLocator()
        await expect(content.locator('.react-joyride__overlay')).toBeVisible()
    }

})

