import { readText } from 'tests/utils/file'
import { expect, test } from '../fixture'

test('測試功能元素是否存在', async ({ room, page }) => {
    expect(page.locator('plasmo-csui').locator('section#bjf-feature-jimaku')).toBeDefined()
})

test('測試字幕區塊是否存在', async ({ room, page }) => {

    const area = page.locator('#jimaku-area')
    await expect(area).toBeAttached()
    await expect(area).toBeVisible()

    const subtitleList = page.locator('#subtitle-list')
    await expect(subtitleList).toBeAttached()
    await expect(subtitleList).toBeVisible()

    const buttonList = await area.locator('div > div > div:nth-child(3) > button').all()
    expect(buttonList.length).toBe(2)

    await expect(buttonList[0]).toHaveText('删除所有字幕记录')
    await expect(buttonList[1]).toHaveText('下载字幕记录')
})


test('測試字幕按鈕 (刪除/下載)', async ({ room, page }) => {
    const deleteButton = page.getByText('删除所有字幕记录')
    const downloadButton = page.getByText('下载字幕记录')
    await expect(deleteButton).toBeVisible()
    await expect(downloadButton).toBeVisible()

    // Test Insert
    console.info('正在測試寫入彈幕...')
    const testJimaku = '由 playwright 工具發送'
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await page.waitForTimeout(3000)
    let subtitleList = await page.locator('#subtitle-list > p').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(2)

    // Test Download
    console.info('正在測試下載字幕...')
    const downloading = page.waitForEvent('download')
    await downloadButton.click()
    const downloaded = await downloading
    const readable = await downloaded.createReadStream()
    const text = await readText(readable)
    expect(text).toContain(testJimaku)
    expect(text.split('\n').length).toBeGreaterThanOrEqual(2)
    expect(text.split(testJimaku).length).toBe(3)

    // Test Delete
    console.info('正在測試刪除字幕...')
    await deleteButton.click()
    await expect(page.getByText(/已删除房间 \d+ 共\d+条字幕记录/)).toBeVisible()
    // after delete, subtitle list should be empty
    subtitleList = await page.locator('#subtitle-list > p').all()
    expect(subtitleList.length).toBe(0)
})


test('測試彈出同傳視窗', async ({ room, page, context, extensionId }) => {
    // modify settings
    console.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(`chrome-extension://${extensionId}/tabs/settings.html`, { waitUntil: 'domcontentloaded' })
    await settingsPage.waitForTimeout(1000)

    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('启用同传弹幕彈出式视窗').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.waitForTimeout(2000)

    console.info('正在測試彈出視窗...')
    await page.bringToFront()
    
    const buttonList = await  page.locator('#jimaku-area').locator('div > div > div:nth-child(3) > button').all()
    expect(buttonList.length).toBe(3)
    await expect(buttonList[2]).toHaveText('弹出同传视窗')

    const newWindow = context.waitForEvent('page')
    await buttonList[2].click()
    const popup = await newWindow
    await popup.bringToFront()
    await expect(popup.getByText(room.title)).toBeVisible()

    console.info('正在測試寫入彈幕...')
    const testJimaku = '由 playwright 工具發送'
    let subtitleList = await popup.locator('nav#popup-jimaku-list > div > div').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(0)
    
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await popup.waitForTimeout(3000)

    subtitleList = await popup.locator('nav#popup-jimaku-list > div > div').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(2)

    console.info('正在測試切換置頂置底...')
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


test('測試離線記錄彈幕', async ({ room, page, context, extensionId }) => {

    console.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(`chrome-extension://${extensionId}/tabs/settings.html`, { waitUntil: 'domcontentloaded' })
    await settingsPage.waitForTimeout(1000)

    await settingsPage.getByText('功能设定').click()
    await settingsPage.locator('div#features\\.jimaku', { hasText: '同传弹幕过滤'}).getByText('启用离线记录').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.waitForTimeout(2000)

    console.info('正在測試離線記錄...')
    await page.bringToFront()
    const testJimaku = '由 playwright 工具發送'
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await page.waitForTimeout(3000)

    let subtitleList = await page.locator('#subtitle-list > p').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(4)

    await page.reload()
    await page.locator('#subtitle-list').waitFor({ state: 'attached' })

    subtitleList = await page.locator('#subtitle-list > p').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(4)
})