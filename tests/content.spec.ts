import { test, expect } from "./fixtures/content";
import logger from "./helpers/logger";
import { receiveOneBLiveMessage } from "./utils/bilibili";



test('測試主元素是否存在', async ({ content }) => {

    const csui = content.locator('plasmo-csui')
    await csui.waitFor({ state: 'attached', timeout: 10000 })

    await expect(csui.locator('#bjf-root')).toBeAttached()
})



test('測試貼邊浮動按鈕和主菜單區塊是否存在', async ({ content }) => {

    const button = content.getByText('功能菜单')
    await expect(button).toBeAttached()
    await expect(button).toBeVisible()

    const zone = content.getByText('Bilibili Vup Stream Enhancer - vup观众直播增强扩展')
    await expect(zone).not.toBeInViewport()

    await button.click()

    await expect(zone).toBeInViewport()

})


test('測試是否挂接成功', async ({ content }) => {

    logger.info('正在等待挂接成功...')
    await expect(content.getByText('挂接成功')).toBeVisible({ timeout: 60000 })

    logger.info('正在等待BLive消息...')
    const r = await receiveOneBLiveMessage(content)

    logger.info('成功收到BLive消息: ', r)

})


test.skip('測試名單列表(黑名單/白名單)', async ({}) => {

})


test('測試进入设置按鈕', async ({ context, content, tabUrl }) => {

    await content.getByText('功能菜单').click()

    const popup = context.waitForEvent('page')
    await content.getByText('进入设置').click()

    const settings = await popup

    expect(settings.url()).toBe(tabUrl('settings.html'))

})


test('測試添加到黑名单按鈕', async ({ content, page, room }) => {

    await content.getByText('功能菜单').click()
    page.once('dialog', d => d.accept())
    await content.getByText('添加到黑名单').click()

    await content.waitForTimeout(1000)
    content = await room.reloadAndGetLocator()
    await content.waitForTimeout(1000)

    const button = content.getByText('功能菜单')
    await expect(button).toBeHidden()

})

test('測試重新启动按鈕', async ({ content, tabUrl, context }) => {


    const settingsPage = await context.newPage()
    await settingsPage.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('界面按钮显示').click()
    await settingsPage.getByText('重新启动按钮').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    await content.getByText('功能菜单').click()
    await content.getByText('重新启动').click()

    const button = content.getByText('功能菜单')
    await expect(button).toBeHidden()

    await content.waitForTimeout(1000)

    await expect(content.getByText('挂接成功')).toBeVisible({ timeout: 60000 })
    await expect(button).toBeVisible()

})


test.skip('測試打开监控式视窗按鈕', async ({}) => {

})


test('測試大海報房間下返回非海报界面按鈕', async ({ context, themeRoom: room }) => {

    const content = await room.getContentLocator()
    await content.locator('body').scrollIntoViewIfNeeded()

    await content.getByText('功能菜单').click()
    const popup = context.waitForEvent('page')
    await content.getByText('返回非海报界面').click()
    const blanc = await popup

    expect(blanc.url()).toBe('https://live.bilibili.com/blanc/'+room.roomid)

})

test('測試全屏時有否根據設定顯示隱藏浮動按鈕', async ({ content, context, tabUrl }) => {

    const button = content.getByText('功能菜单')
    await expect(button).toBeVisible()

    logger.info('正在測試啟用時切換網頁全屏...')
    await content.locator('#live-player').dblclick()
    await expect(button).toBeVisible()
    await content.locator('#live-player').dblclick()
    

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('界面按钮显示').click()
    await settingsPage.getByText('支持在网页全屏下显示').click() // closed
    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    await expect(button).toBeVisible()

    logger.info('正在測試禁用時切換網頁全屏...')
    await content.locator('#live-player').dblclick()
    await expect(button).toBeHidden()
    await content.locator('#live-player').dblclick()

    await expect(button).toBeVisible()
})

test('測試底部的按鈕', async ({ content, context }) => {

    await content.getByText('功能菜单').click()

    let popup = context.waitForEvent('page')
    await content.getByTitle('查看源代码').click()
    const p1 = await popup

    expect(p1.url()).toBe('https://github.com/eric2788/bilibili-vup-stream-enhancer')
    await p1.close()

    popup = context.waitForEvent('page')
    await content.getByTitle('联络作者').click()
    const p2 = await popup

    expect(p2.url()).toBe('https://t.me/Eric1008818')
    await p2.close()


    // TODO: test contribut button


    // TODO: test journal button
})

