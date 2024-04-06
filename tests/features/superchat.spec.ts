import { expect, test } from '@tests/fixtures/content'
import logger from '@tests/helpers/logger'
import { readText } from '@tests/utils/file'
import { getSuperChatList, testFeatureRoomList } from '@tests/utils/playwright'

test.beforeEach(async ({ content, context, optionPageUrl, isThemeRoom }) => {

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
    await settingsPage.getByText('启用醒目留言').click()
    await settingsPage.getByText("保存设定").click()
    await settingsPage.getByText("所有设定已经保存成功。").waitFor({ state: 'visible' })
    await settingsPage.close()
})

test('測試功能元素是否存在', async ({ content }) => {
    
    const csui = content.locator('bjf-csui')
    await csui.waitFor({ state: 'attached', timeout: 10000 })

    await expect(csui.locator('section#bjf-feature-superchat')).toBeAttached()

})


test('測試浮動按鈕和醒目留言記錄列表是否存在', async ({ content }) => {

    logger.info('正在測試浮動按鈕是否存在')
    const section = content.locator('bjf-csui section#bjf-feature-superchat')

    const button = section.locator('button', { hasText: /^醒目留言$/ })
    await expect(button).toBeAttached()
    await expect(button).toBeVisible()

    logger.info('正在測試醒目留言記錄列表是否存在')
    await button.click()

    const list = section.getByRole('menu')
    await expect(list).toBeAttached()
    await expect(list).toBeVisible()

    logger.info('正在測試醒目留言記錄列表是否能關閉')
    await content.locator('body').click()
    await expect(list).not.toBeVisible()

})



test('測試寫入醒目留言和醒目留言按鈕 (插入/刪除/下載)', async ({ content: p, page, room }) => {

    const section = p.locator('bjf-csui section#bjf-feature-superchat')
    const button = section.locator('button', { hasText: /^醒目留言$/ })
    await button.click()

    const deleteButton = p.getByText('刪除所有醒目留言记录')
    const downloadButton = p.getByText('导出醒目留言记录')
    await expect(deleteButton).toBeVisible()
    await expect(downloadButton).toBeVisible()

    // Test Insert
    logger.info('正在測試寫入醒目留言...')
    const testMessage = '由 playwright 工具發送'
    await room.sendSuperChat('用戶1', 1234, testMessage)
    await room.sendSuperChat('用戶2', 5678, testMessage)
    await p.waitForTimeout(3000)

    let superchatList = await getSuperChatList(section, { hasText: testMessage })
    expect(superchatList.length).toBe(2)

    // Test Download
    logger.info('正在測試下載醒目留言...')
    const downloading = page.waitForEvent('download')
    await downloadButton.click()
    const downloaded = await downloading
    const readable = await downloaded.createReadStream()
    const text = await readText(readable)
    expect(text).toContain(testMessage)
    expect(text.split('\n').filter(t => t.includes(testMessage)).length).toBe(2)
    expect(text.split(testMessage).length).toBe(3)

    // Test Delete
    logger.info('正在測試刪除醒目留言...')
    await button.click()
    await deleteButton.click()
    await expect(p.getByText(/已删除房间 \d+ 共\d+条醒目留言记录/)).toBeVisible()

    superchatList = await getSuperChatList(section, { hasText: testMessage })
    expect(superchatList.length).toBe(0)
})

test('測試拖拽按鈕', async ({ content }) => {

    const dragPoint = content.locator('bjf-csui section#bjf-feature-superchat [data-type="draggable-button"]')
    const p1 = content.locator('#rank-list-ctnr-box')
    const p2 = content.locator('#head-info-vm')

    await p1.waitFor({ state: 'visible' })
    await p2.waitFor({ state: 'visible' })

    await dragPoint.waitFor({ state: 'visible' })
    
    await dragPoint.dragTo(p1)
    await dragPoint.dragTo(p2)

    await content.waitForTimeout(1000)

    // dunno how to validate....
})

test('測試離線記錄醒目留言', async ({ room, content: p, context, optionPageUrl, page }) => {

    let section = p.locator('bjf-csui section#bjf-feature-superchat')

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.waitForTimeout(1000)

    await settingsPage.getByText('功能设定').click()
    await settingsPage.locator('div#features\\.superchat', { hasText: '醒目留言' }).getByText('启用离线记录').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.waitForTimeout(2000)

    logger.info('正在測試離線記錄...')
    await page.bringToFront()
    await section.locator('button', { hasText: /^醒目留言$/ }).click()
    const testMessage = '由 playwright 工具發送'
    await room.sendSuperChat('用戶1', 1234, testMessage)
    await room.sendSuperChat('用戶2', 5678, testMessage)
    await room.sendSuperChat('用戶3', 9012, testMessage)
    await room.sendSuperChat('用戶4', 3456, testMessage)
    await p.waitForTimeout(3000)

    let superchatList = await getSuperChatList(section, { hasText: testMessage })
    expect(superchatList.length).toBe(4)

    p = await room.reloadAndGetLocator() // reloaded, so need to re get content locator
    section = p.locator('bjf-csui section#bjf-feature-superchat')
    await section.locator('button', { hasText: /^醒目留言$/ }).waitFor({ state: 'visible' })

    superchatList = await getSuperChatList(section, { hasText: testMessage })
    expect(superchatList.length).toBe(4)

    logger.info('正在測試從設定刪除離線記錄...')
    await page.goto('about:blank')
    settingsPage.once('dialog', dialog => dialog.accept())
    await settingsPage.bringToFront()
    await settingsPage.locator('#features\\.superchat [role=button] button').click()
    await settingsPage.getByText('所有醒目留言记录已经清空。').waitFor({ state: 'visible' })

    await page.bringToFront()
    await room.enterToRoom()
    p = await room.getContentLocator()
    section = p.locator('bjf-csui section#bjf-feature-superchat')
    superchatList = await getSuperChatList(section, { hasText: testMessage })
    expect(superchatList.length).toBe(0)
})

test('測試房間名單列表(黑名單/白名單)', 
    testFeatureRoomList(
        'superchat',
        expect,
        (content) => content.locator('button', { hasText: /^醒目留言$/ })
    )
)

test('測試全屏時有否根據設定顯示隱藏浮動按鈕', async ({ content, context, optionPageUrl }) => {

    const button = content.locator('button', { hasText: /^醒目留言$/ })
    await expect(button).toBeVisible()

    logger.info('正在測試禁用時切換網頁全屏...')
    await content.locator('#live-player').dblclick()
    await expect(button).toBeHidden()
    await content.locator('#live-player').dblclick()

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.getByText('功能设定').click()
    await settingsPage.locator('#features\\.superchat').getByText('在全屏模式下显示').click() // enabled
    await settingsPage.getByText('保存设定').click()
    await settingsPage.close()

    await expect(button).toBeVisible()

    logger.info('正在測試啟用時切換網頁全屏...')
    await content.locator('#live-player').dblclick()
    await expect(button).toBeVisible()
    await content.locator('#live-player').dblclick()

    await expect(button).toBeVisible()
})

test('測試保存設定後 css 能否生效', async ({ content, page, optionPageUrl, context }) => {

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.waitForTimeout(1000)

    await settingsPage.getByText('功能设定').click()

    await settingsPage.getByTestId('floater-color').fill('#123456')
    await settingsPage.getByTestId('operator-color').fill('#123456')

    await settingsPage.getByText('保存设定').click()
    await settingsPage.waitForTimeout(2000)

    logger.info('正在測試醒目留言css...')
    await page.bringToFront()

    const button = content.locator('bjf-csui section#bjf-feature-superchat').locator('button', { hasText: /^醒目留言$/ })
    await button.waitFor({ state: 'visible' })
    await expect(button).toHaveCSS('background-color', 'rgb(18, 52, 86)')
    
    await button.click()

    const deleteButton = content.getByText('刪除所有醒目留言记录')
    const downloadButton = content.getByText('导出醒目留言记录')

    await expect(deleteButton).toHaveCSS('background-color', 'rgb(18, 52, 86)')
    await expect(downloadButton).toHaveCSS('background-color', 'rgb(18, 52, 86)')
})


