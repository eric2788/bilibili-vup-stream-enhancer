import { readText } from 'tests/utils/file'
import { expect, test } from '@tests/fixtures/content'


test.beforeEach(async ({ room, p }) => {
    if (await room.isThemePage()) {
        await p.getByText('切換按鈕列表').click()
    }
})

test('測試功能元素是否存在', async ({ p }) => {
    expect(p.locator('plasmo-csui').locator('section#bjf-feature-jimaku')).toBeDefined()
})

test('測試字幕區塊是否存在', async ({ p, room }) => {

    test.skip(await room.isThemePage(), '此測試不適用於大海報房間')

    const area = p.locator('#jimaku-area')
    await expect(area).toBeAttached()
    await expect(area).toBeVisible()

    const subtitleList = p.locator('#subtitle-list')
    await expect(subtitleList).toBeAttached()
    await expect(subtitleList).toBeVisible()

    const buttonList = await area.locator('div > div > div:nth-child(3) > button').all()
    expect(buttonList.length).toBe(2)

    await expect(buttonList[0]).toHaveText('删除所有字幕记录')
    await expect(buttonList[1]).toHaveText('下载字幕记录')
})

test('測試大海報房間下字幕區塊是否存在', async ({ p, themeRoom }) => {

    const area = p.locator('#jimaku-full-area')
    await expect(area).toBeAttached()
    await expect(area).toBeVisible()

    const subtitleList = p.locator('#subtitle-list')
    await expect(subtitleList).toBeAttached()
    await expect(subtitleList).toBeVisible()

    const buttonList = await area.locator('#jimaku-area div > div > div:nth-child(3) > button').all()
    expect(buttonList.length).toBe(2)

    await expect(buttonList[0]).toHaveText('删除所有字幕记录')
    await expect(buttonList[1]).toHaveText('下载字幕记录')

})


test('測試字幕按鈕 (刪除/下載)', async ({ room, p, logger }) => {
    const deleteButton = p.getByText('删除所有字幕记录')
    const downloadButton = p.getByText('下载字幕记录')
    await expect(deleteButton).toBeVisible()
    await expect(downloadButton).toBeVisible()

    // Test Insert
    logger.info('正在測試寫入彈幕...')
    const testJimaku = '由 playwright 工具發送'
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await p.waitForTimeout(3000)
    let subtitleList = await p.locator('#subtitle-list > p').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(2)

    // Test Download
    logger.info('正在測試下載字幕...')
    const downloading = p.waitForEvent('download')
    await downloadButton.click()
    const downloaded = await downloading
    const readable = await downloaded.createReadStream()
    const text = await readText(readable)
    expect(text).toContain(testJimaku)
    expect(text.split('\n').filter(t => t.includes(testJimaku)).length).toBe(2)
    expect(text.split(testJimaku).length).toBe(3)

    // Test Delete
    logger.info('正在測試刪除字幕...')
    await deleteButton.click()
    await expect(p.getByText(/已删除房间 \d+ 共\d+条字幕记录/)).toBeVisible()
    // after delete, subtitle list should be empty
    subtitleList = await p.locator('#subtitle-list > p').all()
    expect(subtitleList.length).toBe(0)
})


test('測試彈出同傳視窗', async ({ room, p, context, logger, tabUrl }) => {
    // modify settings
    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
    await settingsPage.waitForTimeout(1000)

    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('启用同传弹幕彈出式视窗').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.waitForTimeout(2000)

    logger.info('正在測試彈出視窗...')
    await p.bringToFront()

    const buttonList = await p.locator('#jimaku-area').locator('div > div > div:nth-child(3) > button').all()
    expect(buttonList.length).toBe(3)
    await expect(buttonList[2]).toHaveText('弹出同传视窗')

    const newWindow = context.waitForEvent('page')
    await buttonList[2].click()
    const popup = await newWindow
    await popup.bringToFront()
    await expect(popup.getByText(room.title)).toBeVisible()

    logger.info('正在測試寫入彈幕...')
    const testJimaku = '由 playwright 工具發送'
    let subtitleList = await popup.locator('nav#popup-jimaku-list > div > div').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(0)

    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await popup.waitForTimeout(3000)

    subtitleList = await popup.locator('nav#popup-jimaku-list > div > div').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(2)

    logger.info('正在測試切換置頂置底...')
    const keepBottom = popup.locator('div#__plasmo > nav > div > button > span')
    const checkbox = popup.getByRole('menuitem').locator('label > div > label:nth-child(1) > input[type=checkbox]')
    const checkboxText = popup.getByText('自動置底')
    await expect(checkboxText).toBeHidden()

    await keepBottom.click()
    await expect(checkboxText).toBeVisible()
    await expect(checkbox).toBeChecked() // default is checked

    await checkbox.click()
    await expect(checkbox).not.toBeChecked()
})


test('測試離線記錄彈幕', async ({ room, p, context, tabUrl, logger }) => {

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(tabUrl('settings.html'), { waitUntil: 'domcontentloaded' })
    await settingsPage.waitForTimeout(1000)

    await settingsPage.getByText('功能设定').click()
    await settingsPage.locator('div#features\\.jimaku', { hasText: '同传弹幕过滤' }).getByText('启用离线记录').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.waitForTimeout(2000)

    logger.info('正在測試離線記錄...')
    await p.bringToFront()
    const testJimaku = '由 playwright 工具發送'
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await p.waitForTimeout(3000)

    let subtitleList = await p.locator('#subtitle-list > p').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(4)

    await p.reload()
    await p.locator('#subtitle-list').waitFor({ state: 'attached' })

    subtitleList = await p.locator('#subtitle-list > p').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(4)
})

test('測試全屏時字幕區塊是否存在 + 顯示切換', async ({ p, logger, room }) => {

    test.skip(await room.isThemePage(), '此測試不適用於大海報房間')

    const area = p.locator('#jimaku-area div#subtitle-list')
    await expect(area).toBeAttached()
    await expect(area).toBeVisible()

    const fullArea = p.locator('#live-player > div#jimaku-full-area div#subtitle-list')
    await expect(fullArea).not.toBeAttached()
    await expect(fullArea).not.toBeVisible()

    logger.info('正在測試切換網頁全屏...')
    await p.locator('#live-player').dblclick()
    await expect(fullArea).toBeAttached()
    await expect(fullArea).toBeVisible()
    await expect(area).not.toBeVisible()

    logger.info('正在測試顯示切換...')
    const switcher = p.getByTitle('字幕切换显示')
    await switcher.click()
    await expect(fullArea).not.toBeVisible()
    await switcher.click()
    await expect(fullArea).toBeVisible()

    logger.info('正在測試切回非全屏...')
    await p.locator('#live-player').dblclick()
    await expect(fullArea).not.toBeAttached()
    await expect(fullArea).not.toBeVisible()
    await expect(area).toBeVisible()

})