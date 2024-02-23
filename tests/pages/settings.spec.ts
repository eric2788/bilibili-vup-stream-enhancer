
import { expect, test } from '@tests/fixtures/background'
import BilibiliPage from '@tests/helpers/bilibili-page'
import logger from '@tests/helpers/logger'
import { getSuperChatList } from '@tests/utils/playwright'
import type { MV2Settings } from '~migrations/schema'

test.beforeEach(async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/tabs/settings.html`, { waitUntil: 'domcontentloaded' })
})

test('測試頁面是否成功加載', async ({ settings: page }) => {
    await expect(page.getByText('设定页面')).toBeVisible()
})

test('測試所有設定區塊能否展開', async ({ settings: page }) => {
    const form = page.locator('form.container')
    await form.waitFor({ state: 'attached' })
    expect(form).toBeDefined()
    const sections = await form.locator('> section').all()
    expect(sections.length).toBe(5)
    for (const section of sections) {
        await section.click()
    }
})

test('測試能否保存設定', async ({ settings: page }) => {
    logger.info('正在修改功能設定....')
    await page.getByText('功能设定').click()
    const chexkboxVtbOnly = page.locator('//html/body/div[1]/form/section[1]/div[2]/div/div/div/div[1]/nav/div[1]/label/div/div/input')
    await expect(chexkboxVtbOnly).not.toBeChecked()
    await page.getByText('仅限虚拟主播').click()
    const checkboxMonitor = page.locator('//html/body/div[1]/form/section[1]/div[2]/div/div/div/div[1]/nav/div[2]/label/div/div/input')
    await expect(checkboxMonitor).not.toBeChecked()
    await page.getByText('启用监控视窗').click()
    await page.getByText('功能设定').click()

    logger.info('正在修改开发者相关....')
    await page.getByText('开发者相关').click()
    const inputUpperButtonArea = page.locator('//html/body/div[1]/form/section[5]/div[2]/div/div/div/div[2]/input')
    await expect(inputUpperButtonArea).toHaveValue('.lower-row .left-ctnr')
    await inputUpperButtonArea.fill('inputUpperButtonArea changed')
    const liveTitle = page.locator('//html/body/div[1]/form/section[5]/div[2]/div/div/div/div[9]/input')
    await expect(liveTitle).toHaveValue('.live-skin-main-text.small-title')
    await liveTitle.fill('liveTitle changed')
    const liveFullScreenClass = page.locator('//html/body/div[1]/form/section[5]/div[2]/div/div/div/div[16]/input')
    await expect(liveFullScreenClass).toHaveValue('fullscreen-fix')
    await liveFullScreenClass.fill('liveFullScreenClass changed')
    await page.getByText('开发者相关').click()

    await page.getByText('保存设定').click()

    await page.reload({ waitUntil: 'domcontentloaded' })

    logger.info('正在验证功能設定....')
    await page.getByText('功能设定').click()
    await expect(chexkboxVtbOnly).toBeChecked()
    await expect(checkboxMonitor).toBeChecked()

    logger.info('正在验证开发者相关....')
    await page.getByText('开发者相关').click()
    await expect(inputUpperButtonArea).toHaveValue('inputUpperButtonArea changed')
    await expect(liveTitle).toHaveValue('liveTitle changed')
    await expect(liveFullScreenClass).toHaveValue('liveFullScreenClass changed')
})

test('測試導出導入設定', async ({ settings: page }) => {
    logger.info('正在導出設定....')
    const downloading = page.waitForEvent('download')
    await page.getByText('导出设定').click()
    const downloaded = await downloading
    const file = await downloaded.path()

    // now try edit settings
    logger.info('正在修改功能設定....')
    await page.getByText('功能设定').click()
    const chexkboxVtbOnly = page.locator('//html/body/div[1]/form/section[1]/div[2]/div/div/div/div[1]/nav/div[1]/label/div/div/input')
    await expect(chexkboxVtbOnly).not.toBeChecked()
    await page.getByText('仅限虚拟主播').click()
    const checkboxMonitor = page.locator('//html/body/div[1]/form/section[1]/div[2]/div/div/div/div[1]/nav/div[2]/label/div/div/input')
    await expect(checkboxMonitor).not.toBeChecked()
    await page.getByText('启用监控视窗').click()
    await page.getByText('功能设定').click()

    await page.getByText('保存设定').click()
    await page.reload({ waitUntil: 'domcontentloaded' })

    logger.info('正在验证功能設定....')
    await page.getByText('功能设定').click()
    await expect(chexkboxVtbOnly).toBeChecked()
    await expect(checkboxMonitor).toBeChecked()

    logger.info('正在導入設定....')
    const fileChoosing = page.waitForEvent('filechooser')
    await page.getByText('导入设定').click()
    const fileChooser = await fileChoosing
    await fileChooser.setFiles(file)

    await page.getByText('设定已经导入成功。').waitFor({ state: 'visible' })

    logger.info('正在验证功能設定....')
    await expect(chexkboxVtbOnly).not.toBeChecked()
    await expect(checkboxMonitor).not.toBeChecked()
})


test('測試清空數據庫', async ({ settings: page, front: room, api }) => {

    await page.bringToFront()
    const feature = page.getByText('功能设定')
    await feature.click()
    const btns = await page.locator('section#settings\\.features').getByText('启用离线记录').all()
    for (const btn of btns) {
        await btn.click()
    }
    await page.getByText('保存设定').click()

    await page.waitForTimeout(1000)

    await room.page.bringToFront()
    let p = await room.getContentLocator()
    await p.locator('body').scrollIntoViewIfNeeded()

    const testMessage = '由 playwright 工具發送'

    {
        logger.info('正在測試寫入彈幕...')
        await p.locator('#subtitle-list').waitFor({ state: 'visible' })
        await room.sendDanmaku(`【${testMessage}】`)
        await room.sendDanmaku(`【${testMessage}】`)
        await page.waitForTimeout(3000)
        const subtitleList = await p.locator('#subtitle-list > p').filter({ hasText: testMessage }).all()
        expect(subtitleList.length).toBe(2)
    }

    {
        const superChatSection = p.locator('plasmo-csui section#bjf-feature-superchat')
        logger.info('正在測試寫入醒目留言...')
        await room.sendSuperChat('用戶1', 1234, testMessage)
        await room.sendSuperChat('用戶2', 5678, testMessage)
        await page.waitForTimeout(3000)
        const superchatList = await getSuperChatList(superChatSection, { hasText: testMessage })
        expect(superchatList.length).toBe(2)
    }

    p = await room.reloadAndGetLocator()

    {
        logger.info('正在驗證彈幕有否被離線記錄...')
        await p.locator('#subtitle-list').waitFor({ state: 'visible' })
        const subtitleList = await p.locator('#subtitle-list > p').filter({ hasText: testMessage }).all()
        expect(subtitleList.length).toBe(2)
    }

    {
        const superChatSection = p.locator('plasmo-csui section#bjf-feature-superchat')
        logger.info('正在驗證醒目留言有否被離線記錄...')
        await superChatSection.waitFor({ state: 'attached' })
        const superchatList = await getSuperChatList(superChatSection, { hasText: testMessage })
        expect(superchatList.length).toBe(2)
    }

    await room.close()

    logger.info('正在清空數據庫....')
    await page.bringToFront()
    page.once('dialog', dialog => dialog.accept())
    await page.getByText('清空所有记录储存库').click()
    await page.getByText('所有记录已经清空。').waitFor({ state: 'visible' })

    room = new BilibiliPage(page, api, room.info)
    await room.enterToRoom()
    p = await room.getContentLocator()
    await p.locator('body').scrollIntoViewIfNeeded()

    {
        logger.info('正在檢查彈幕是否被清空...')
        await p.locator('#subtitle-list').waitFor({ state: 'visible' })
        const subtitleList = await p.locator('#subtitle-list > p').filter({ hasText: testMessage }).all()
        expect(subtitleList.length).toBe(0)
    }

    {
        const superChatSection = p.locator('plasmo-csui section#bjf-feature-superchat')
        logger.info('正在檢查醒目留言是否被清空...')
        await superChatSection.waitFor({ state: 'attached' })
        const superchatList = await getSuperChatList(superChatSection, { hasText: testMessage })
        expect(superchatList.length).toBe(0)
    }

})

test.skip('測試設定數據從MV2遷移', async ({ serviceWorker, page }) => {

    logger.info('正在測試寫入 MV2 設定....')
    const settings = await serviceWorker.evaluate(async () => {
        let mv2Settings: Partial<MV2Settings> = await chrome.storage.sync.get('settings')
        if (!mv2Settings) {
            mv2Settings = {
                // TODO: add some settings here
            }
            await chrome.storage.sync.set({ settings: mv2Settings })
        }
        return mv2Settings
    })

    await page.reload({ waitUntil: 'domcontentloaded' })

    logger.info('正在測試遷移 MV2 設定....')
    page.once('dialog', dialog => dialog.accept())
    await page.getByText('从 MV2 迁移设定').click()
    await page.getByText('设定已迁移并导入成功。').waitFor({ state: 'visible' })
    
    logger.info('正在驗證 MV2 設定....')
    // TODO: validate settings

    logger.info('正在驗證沒有 MV2 設定時遷移按鈕有否不顯示....')
    await serviceWorker.evaluate(async () => {
        await chrome.storage.sync.remove('settings')
    })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByText('从 MV2 迁移设定')).toBeHidden()
})
