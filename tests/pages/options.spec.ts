
import { request, type Locator } from '@playwright/test'
import { expect, test } from '@tests/fixtures/background'
import BilibiliPage from '@tests/helpers/bilibili-page'
import logger from '@tests/helpers/logger'
import { getSuperChatList } from '@tests/utils/playwright'
import type { MV2Settings } from '~migrations/schema'

test.beforeEach(async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/options.html`, { waitUntil: 'domcontentloaded' })
})

test('測試頁面是否成功加載', async ({ page }) => {
    await expect(page.getByText('设定页面')).toBeVisible()
})

test('測試所有設定區塊能否展開', async ({ page }) => {
    const form = page.locator('form.container')
    await form.waitFor({ state: 'attached' })
    expect(form).toBeDefined()
    const sections = await form.locator('> section').all()
    expect(sections.length).toBe(6)
    for (const section of sections) {
        await section.click()
    }
})

test('測試能否保存設定', async ({ page }) => {

    logger.info('正在修改功能設定....')

    await page.getByText('功能设定').click()

    const chexkboxVtbOnly = page.getByTestId('vtb-only')
    await expect(chexkboxVtbOnly).toBeChecked()
    await page.getByText('仅限虚拟主播').click()

    const checkboxMonitor = page.getByTestId('monitor-window')
    await expect(checkboxMonitor).not.toBeChecked()
    await page.getByText('启用弹出直播视窗').click()

    await page.getByText('字幕设定').click()

    const inputSubtitleSize = page.getByTestId('jimaku-size')
    await expect(inputSubtitleSize).toHaveValue('16')
    await inputSubtitleSize.fill('20')

    const inputFirstSubtitleSize = page.getByTestId('jimaku-first-size')
    await expect(inputFirstSubtitleSize).toHaveValue('18')
    await inputFirstSubtitleSize.fill('22')

    const inputLineGap = page.getByTestId('jimaku-gap')
    await expect(inputLineGap).toHaveValue('7')
    await inputLineGap.fill('10')

    logger.info('正在修改开发者相关....')

    await page.getByText('开发者相关').click()

    const inputUpperButtonArea = page.getByTestId('elements.upperButtonArea')
    await expect(inputUpperButtonArea).toHaveValue('.lower-row .left-ctnr')
    await inputUpperButtonArea.fill('inputUpperButtonArea changed')

    const liveTitle = page.getByTestId('elements.liveTitle')
    await expect(liveTitle).toHaveValue('.live-skin-main-text.small-title')
    await liveTitle.fill('liveTitle changed')

    const liveFullScreenClass = page.getByTestId('classes.screenFull')
    await expect(liveFullScreenClass).toHaveValue('fullscreen-fix')
    await liveFullScreenClass.fill('liveFullScreenClass changed')

    await page.getByText('保存设定').click()

    await page.reload({ waitUntil: 'domcontentloaded' })

    logger.info('正在验证功能設定....')
    await page.getByText('功能设定').click()
    await expect(chexkboxVtbOnly).not.toBeChecked()
    await expect(checkboxMonitor).toBeChecked()
    await expect(inputSubtitleSize).toHaveValue('20')
    await expect(inputFirstSubtitleSize).toHaveValue('22')
    await expect(inputLineGap).toHaveValue('10')

    logger.info('正在验证开发者相关....')
    await page.getByText('开发者相关').click()
    await expect(inputUpperButtonArea).toHaveValue('inputUpperButtonArea changed')
    await expect(liveTitle).toHaveValue('liveTitle changed')
    await expect(liveFullScreenClass).toHaveValue('liveFullScreenClass changed')
})

test('測試導出導入設定', async ({ page }) => {
    logger.info('正在導出設定....')
    const downloading = page.waitForEvent('download')
    await page.getByText('导出设定').click()
    const downloaded = await downloading
    const file = await downloaded.path()

    // now try edit settings
    logger.info('正在修改功能設定....')
    await page.getByText('功能设定').click()

    const chexkboxVtbOnly = page.getByTestId('vtb-only')
    await expect(chexkboxVtbOnly).toBeChecked()
    await page.getByText('仅限虚拟主播').click()

    const checkboxMonitor = page.getByTestId('monitor-window')
    await expect(checkboxMonitor).not.toBeChecked()
    await page.getByText('启用弹出直播视窗').click()

    const inputSubtitleSize = page.getByTestId('jimaku-size')
    await expect(inputSubtitleSize).toHaveValue('16')
    await inputSubtitleSize.fill('20')

    const inputFirstSubtitleSize = page.getByTestId('jimaku-first-size')
    await expect(inputFirstSubtitleSize).toHaveValue('18')
    await inputFirstSubtitleSize.fill('22')

    const inputLineGap = page.getByTestId('jimaku-gap')
    await expect(inputLineGap).toHaveValue('7')
    await inputLineGap.fill('10')

    await page.getByText('保存设定').click()
    await page.reload({ waitUntil: 'domcontentloaded' })

    logger.info('正在验证功能設定....')
    await page.getByText('功能设定').click()
    await expect(chexkboxVtbOnly).not.toBeChecked()
    await expect(checkboxMonitor).toBeChecked()
    await expect(inputSubtitleSize).toHaveValue('20')
    await expect(inputFirstSubtitleSize).toHaveValue('22')
    await expect(inputLineGap).toHaveValue('10')

    logger.info('正在導入設定....')
    const fileChoosing = page.waitForEvent('filechooser')
    await page.getByText('导入设定').click()
    const fileChooser = await fileChoosing
    await fileChooser.setFiles(file)

    await page.getByText('设定已经导入成功。').waitFor({ state: 'visible' })

    logger.info('正在验证功能設定....')
    await expect(chexkboxVtbOnly).toBeChecked()
    await expect(checkboxMonitor).not.toBeChecked()
    await expect(inputSubtitleSize).toHaveValue('16')
    await expect(inputFirstSubtitleSize).toHaveValue('18')
    await expect(inputLineGap).toHaveValue('7')
})


test('測試清空數據庫', async ({ page, front: room, api }) => {

    await page.bringToFront()
    const feature = page.getByText('功能设定')
    await feature.click()

    await page.getByText('启用醒目留言').click() // default is disabled
    
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
        const superChatSection = p.locator('bjf-csui section#bjf-feature-superchat')
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
        const superChatSection = p.locator('bjf-csui section#bjf-feature-superchat')
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
        const superChatSection = p.locator('bjf-csui section#bjf-feature-superchat')
        logger.info('正在檢查醒目留言是否被清空...')
        await superChatSection.waitFor({ state: 'attached' })
        const superchatList = await getSuperChatList(superChatSection, { hasText: testMessage })
        expect(superchatList.length).toBe(0)
    }

})

test('測試從遠端獲取開發者設定', async ({ page }) => {

    const api = await request.newContext()
    const response = await api.get('https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/cdn/developer_v2.json')
    test.skip(!response.ok, '無法從遠端獲取開發者設定')
    const { developer: remote } = await response.json()

    logger.info('成功获取远端设定: ', remote)

    logger.info('正在修改开发者相关....')

    await page.getByText('开发者相关').click()

    const inputUpperButtonArea = page.getByTestId('elements.upperButtonArea')
    await expect(inputUpperButtonArea).toHaveValue('.lower-row .left-ctnr')
    await inputUpperButtonArea.fill('inputUpperButtonArea changed')

    const liveTitle = page.getByTestId('elements.liveTitle')
    await expect(liveTitle).toHaveValue('.live-skin-main-text.small-title')
    await liveTitle.fill('liveTitle changed')

    const liveFullScreenClass = page.getByTestId('classes.screenFull')
    await expect(liveFullScreenClass).toHaveValue('fullscreen-fix')
    await liveFullScreenClass.fill('liveFullScreenClass changed')

    await page.getByText('保存设定').click()
    await page.reload({ waitUntil: 'domcontentloaded' })

    logger.info('正在验证开发者相关....')
    await page.getByText('开发者相关').click()
    await expect(inputUpperButtonArea).toHaveValue('inputUpperButtonArea changed')
    await expect(liveTitle).toHaveValue('liveTitle changed')
    await expect(liveFullScreenClass).toHaveValue('liveFullScreenClass changed')

    logger.info('正在验证遠端開發者設定....')
    page.once('dialog', dialog => dialog.accept())
    await page.getByText('获取最新版本').click()

    await page.getByText('已成功获取最新版本').waitFor({ state: 'visible' })
    await page.reload({ waitUntil: 'domcontentloaded' })

    // 從設定頁面驗證
    await expect(inputUpperButtonArea).toHaveValue(remote.elements.upperButtonArea)
    await expect(liveTitle).toHaveValue(remote.elements.liveTitle)
    await expect(liveFullScreenClass).toHaveValue(remote.classes.screenFull)

    // 從設定存檔驗證
    const storageStr = await page.evaluate(async () => {
        const data = await chrome.storage.sync.get('settings.developer')
        return data['settings.developer'] as string
    })

    expect(storageStr).toBe(JSON.stringify(remote))
})

test('測試設定數據從MV2遷移', async ({ serviceWorker, page }) => {

    logger.info('正在測試寫入 MV2 設定....')
    const mv2Settings = await serviceWorker.evaluate(async () => {
        const settings: MV2Settings = {
            "regex": "^(?<n>[^【】]+?)?\\:?\\s*【(?<cc>[^【】]+?)(】.?)?$",
            "opacity": 100,
            "color": "#59ff00",
            "hideJimakuDanmaku": false,
            "vtbOnly": true,
            "record": false,
            "backgroundSubtitleOpacity": 40,
            "backgroundColor": "#111111",
            "backgroundHeight": 100,
            "tongchuanMans": ["123456789"],
            "tongchuanBlackList": ["987654321"],
            "subtitleColor": "#222222",
            "blacklistRooms": ["24689", "98624", "13579", "97531"],
            "useAsWhitelist": true,
            "subtitleSize": 26,
            "firstSubtitleSize": 28,
            "lineGap": 17,
            "jimakuAnimation": "top",
            "jimakuPosition": "left",
            "webSocketSettings": {
                "danmakuPosition": "bottom"
            },
            "useStreamingTime": false,
            "buttonSettings": {
                "backgroundColor": "#333333",
                "backgroundListColor": "#444444",
                "textColor": "#555555"
            },
            "filterCNV": false,
            "autoCheckUpdate": false,
            "recordSuperChat": true,
            "enableRestart": false,
            "enableJimakuPopup": true,
            "enableStreamPopup": true,
            "filterLevel": 0,
            "useLegacy": false,
            "hideBlackList": false,
            "hideSettingBtn": false,
            "themeToNormal": false,
            "useRemoteCDN": false,
            "developer": {
                "attr": {
                    "chatDanmaku": "data-danmaku",
                    "chatUserId": "data-uid"
                },
                "classes": {
                    "screenFull": "fullscreen-fix",
                    "screenWeb": "player-full-win"
                },
                "code": {
                    "scList": "window.__NEPTUNE_IS_MY_WAIFU__ ? window.__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.super_chat_info.message_list : []"
                },
                "elements": {
                    "chatItems": "#chat-items",
                    "danmakuArea": ".web-player-danmaku",
                    "jimakuArea": "div.player-section",
                    "jimakuFullArea": ".web-player-inject-wrap",
                    "liveTitle": ".live-skin-main-text.small-title",
                    "newMsgButton": "div#danmaku-buffer-prompt",
                    "upperButtonArea": ".rows-ctnr",
                    "userId": "a.room-owner-username",
                    "videoArea": "div#aside-area-vm"
                }
            }
        }
        await chrome.storage.sync.set(settings) // the old settings way....
        return settings
    })

    logger.debug('settings: ', mv2Settings)
    await page.reload({ waitUntil: 'domcontentloaded' })

    logger.info('正在測試遷移 MV2 設定....')
    page.once('dialog', dialog => dialog.accept())
    await page.getByText('从 MV2 迁移设定').click()
    await page.getByText('设定已迁移并导入成功。').waitFor({ state: 'visible' })

    logger.info('正在驗證 MV2 設定....') // 懶得測試全部了，只測試重要部分
    await page.getByText('功能设定').click()
    await expect(page.getByTestId('vtb-only')).toBeChecked({ checked: mv2Settings.vtbOnly })
    await expect(page.getByTestId('monitor-window')).toBeChecked({ checked: mv2Settings.enableStreamPopup })
    await expect(page.getByTestId('use-stream-time')).toBeChecked({ checked: mv2Settings.useStreamingTime })

    await expect(page.getByTestId('offline-record-jimaku')).toBeChecked({ checked: mv2Settings.record })
    await expect(page.getByTestId('no-native-vtuber')).toBeChecked({ checked: mv2Settings.filterCNV })
    await expect(page.getByTestId('jimaku-window')).toBeChecked({ checked: mv2Settings.enableJimakuPopup })

    await page.getByText('字幕设定').click()
    await expect(page.getByTestId('jimaku-size')).toHaveValue(mv2Settings.subtitleSize.toString())
    await expect(page.getByTestId('jimaku-first-size')).toHaveValue(mv2Settings.firstSubtitleSize.toString())
    await expect(page.getByTestId('jimaku-position').locator('div > div').nth(0)).toHaveText('置左')
    await expect(page.getByTestId('jimaku-gap')).toHaveValue(mv2Settings.lineGap.toString())
    await expect(page.getByTestId('jimaku-bg-color')).toHaveValue(mv2Settings.backgroundColor)
    await expect(page.getByTestId('jimaku-bg-opacity')).toHaveValue(mv2Settings.backgroundSubtitleOpacity.toString())
    await expect(page.getByTestId('jimaku-ul')).toHaveValue(mv2Settings.filterLevel.toString())
    await expect(page.getByTestId('jimaku-color')).toHaveValue(mv2Settings.subtitleColor)
    await expect(page.getByTestId('jimaku-bg-height')).toHaveValue(mv2Settings.backgroundHeight.toString())
    await expect(page.getByTestId('jimaku-animation').locator('div > div').nth(0)).toHaveText('下移')

    await page.getByText('同传弹幕设定').click()
    await expect(page.getByTestId('regex-input')).toHaveValue(mv2Settings.regex)
    await expect(page.getByTestId('danmaku-hide')).toBeChecked({ checked: mv2Settings.hideJimakuDanmaku })
    await expect(page.getByTestId('danmaku-color')).toHaveValue(mv2Settings.color)
    await expect(page.getByTestId('danmaku-opacity')).toHaveValue(mv2Settings.opacity.toString())
    await expect(page.getByTestId('danmaku-position').locator('div > div').nth(0)).toHaveText('置底')

    await page.getByText('字幕按钮样式设定').click()
    await expect(page.getByTestId('btn-bg-color')).toHaveValue(mv2Settings.buttonSettings.backgroundColor)
    await expect(page.getByTestId('btn-list-color')).toHaveValue(mv2Settings.buttonSettings.backgroundListColor)
    await expect(page.getByTestId('btn-txt-color')).toHaveValue(mv2Settings.buttonSettings.textColor)

    await page.getByText('同传名单设定').click()
    const tongchuanMans = page.getByTestId('tongchuan-mans-table')
    const tongchuanBlackLists = page.getByTestId('tongchuan-blacklist-table')
    await compareTable(tongchuanMans, mv2Settings.tongchuanMans)
    await compareTable(tongchuanBlackLists, mv2Settings.tongchuanBlackList)

    await page.getByText('名单列表').click()
    const table = page.getByTestId('black-list-rooms-table')
    await compareTable(table, mv2Settings.blacklistRooms)

    logger.info('正在驗證沒有 MV2 設定時遷移按鈕有否不顯示....')
    await serviceWorker.evaluate(async (mv2Settings: MV2Settings) => {
        await chrome.storage.sync.remove(Object.keys(mv2Settings))
    }, mv2Settings)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByText('从 MV2 迁移设定')).toBeHidden()
})


test('測試导航', async ({ page, serviceWorker }) => {

    const overlay = page.locator('.react-joyride__overlay')

    const button = page.getByTitle('使用导航')
    await expect(button).toBeVisible()
    await button.click()
    await page.waitForTimeout(500)
    await expect(overlay).toBeVisible()

    logger.info('正在測試導航前向...')

    const next = page.locator('[data-test-id=button-primary]').filter({ hasText: '下一步' })
    const previous = page.locator('[data-test-id=button-back]')
    const skip = page.locator('[data-test-id=button-skip]')
    const finish = page.locator('[data-test-id=button-primary]').filter({ hasText: '完成' })

    while (await next.isVisible()) {
        await next.click()
        await page.waitForTimeout(100)
    }

    await expect(finish).toBeVisible()
    await finish.click()

    logger.info('正在測試導航返回...')
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
            await chrome.storage.local.remove('no_auto_journal.settings')
        })
        await page.reload()
        await expect(overlay).toBeVisible()
    }
})

test('測試點擊使用指南', async ({ context, page }) => {

    await page.getByText('功能设定').click()
    
    const tutorial = context.waitForEvent('page')
    await page.getByText('使用指南').click()
    const tutorialPage = await tutorial

    expect(tutorialPage.url()).toBe('https://eric2788.github.io/bilibili-vup-stream-enhancer/tutorials/')

})

async function compareTable(table: Locator, data: string[], index: number = 0): Promise<void> {
    const rows = await table.locator('tbody tr').all()
    expect(rows.length).toBe(data.length)
    for (let i = 0; i < rows.length; i++) {
        await expect(rows[i].locator('td').nth(index)).toHaveText(data[i])
    }
}