import type { Locator } from '@playwright/test'
import { expect, test } from '@tests/fixtures/content'
import logger from '@tests/helpers/logger'
import { isFrame, type PageFrame } from '@tests/helpers/page-frame'
import { selectOption, testFeatureRoomList } from '@tests/utils/playwright'
import { readText } from 'tests/utils/file'

test.beforeEach(async ({ content: p }) => {
    await ensureButtonListVisible(p)
})

test('測試功能元素是否存在', async ({ content: p }) => {

    const csui = p.locator('bjf-csui')
    await csui.waitFor({ state: 'attached', timeout: 10000 })

    await expect(csui.locator('section#bjf-feature-jimaku')).toBeAttached()

})

test('測試字幕區塊是否存在', async ({ content: p, isThemeRoom }) => {

    test.skip(isThemeRoom, '此測試不適用於大海報房間')

    const area = p.locator('#jimaku-area')
    await expect(area).toBeAttached()
    await expect(area).toBeVisible()

    const subtitleList = p.locator('#subtitle-list')
    await expect(subtitleList).toBeAttached()
    await expect(subtitleList).toBeVisible()

    const buttonList = await getButtonList(p)
    expect(buttonList.length).toBe(2)

    await expect(buttonList[0]).toHaveText('删除所有字幕记录')
    await expect(buttonList[1]).toHaveText('下载字幕记录')
})


test('測試字幕按鈕 (刪除/下載)', async ({ room, content: p, page }) => {
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
    const downloading = page.waitForEvent('download')
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
    subtitleList = await p.locator('#subtitle-list > p').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(0)
})


test('測試彈出同傳視窗', async ({ room, context, optionPageUrl, page, content }) => {
    // modify settings
    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.waitForTimeout(1000)

    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('启用同传弹幕弹出式视窗').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.waitForTimeout(2000)

    logger.info('正在測試彈出視窗...')
    await page.bringToFront()
    const buttonList = await getButtonList(content)
    expect(buttonList.length).toBe(3)
    await expect(buttonList[2]).toHaveText('弹出同传视窗')

    const newWindow = context.waitForEvent('page', { predicate: p => p.url().includes('jimaku.html') })
    await buttonList[2].click()
    const popup = await newWindow
    await popup.bringToFront()
    await expect(popup.getByText(room.info.title)).toBeVisible()

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

test('测试同传字幕AI总结', async ({ room, content: p, context, optionPageUrl, page }) => {
    
    test.slow()
    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.waitForTimeout(1000)

    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('AI 设定').click()
    await settingsPage.getByText('启用同传字幕AI总结').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.waitForTimeout(2000)

    logger.info('正在測試AI总结...')
    await page.bringToFront()
    const buttonList = await getButtonList(p)
    expect(buttonList.length).toBe(3)
    await expect(buttonList[2]).toHaveText('同传字幕AI总结')


    await p.locator('#subtitle-list').waitFor({ state: 'visible' })
    const conversations = [
        '大家好',
        '早上好',
        '知道我今天吃了什么吗?',
        '是麦当劳哦!',
        '"不就个麦当劳而已吗"不是啦',
        '是最近那个很热门的新品',
        '对，就是那个',
        '然后呢, 今天久违的出门了',
        '对，平时都是宅在家里的呢',
        '"终于长大了"喂w',
        '然后今天去了漫展来着',
        '很多人呢',
        '之前的我看到那么多人肯定社恐了',
        '但今次意外的没有呢',
        '"果然是长大了"也是呢',
        '然后呢, 今天买了很多东西',
        '插画啊，手办啊，周边之类的',
        '荷包大出血w',
        '不过觉得花上去应该值得的...吧?',
        '喂，好过分啊',
        '不过确实不应该花那么多钱的',
        '然后呢，回家途中看到了蟑螂的尸体',
        '太恶心了',
        '然后把我一整天好心情搞没了w',
        '"就因为一个蟑螂"对www',
        '不过跟你们谈完反而心情好多了',
        '谢谢大家',
        '那么今天的杂谈就到这里吧',
        '下次再见啦',
        '拜拜~'
    ]

    for (const danmaku of conversations.map(t => `主播:${t}`)) {
        await room.sendDanmaku(`【${danmaku}】`)
    }
    await p.waitForTimeout(3000)

    let subtitleList = await p.locator('#subtitle-list > p').filter({ hasText: '主播:' }).all()
    expect(subtitleList.length).toBe(conversations.length)

    const newWindow = context.waitForEvent('page', { predicate: p => p.url().includes('summarizer.html') })
    await buttonList[2].click()
    const summarizer = await newWindow
    await summarizer.bringToFront()
    const loader = summarizer.getByText('正在加载同传字幕总结')
    await expect(loader).toBeVisible()
    await summarizer.waitForTimeout(3000)

    await expect(summarizer.getByText('错误')).toBeHidden({ timeout: 5000 })
    await expect(loader).toBeHidden({ timeout: 30000 })

    logger.info('正在測試AI总結結果... (15s)')
    await summarizer.waitForTimeout(15000)
    await expect(summarizer.getByText('错误')).toBeHidden({ timeout: 5000 })
    const res = await summarizer.getByTestId('同传字幕总结-bubble-chat-0').locator('div.leading-snug').textContent()
    logger.debug('AI Summary:', res)

    const maybe = expect.configure({ soft: true })
    maybe(res).toMatch(/主播|日本VTuber|日本vtuber|vtuber/)
    maybe(res).toMatch(/直播|观众/)
    maybe(res).toContain('麦当劳')
    maybe(res).toContain('漫展')
    maybe(res).toContain('蟑螂')

})


test('測試離線記錄彈幕', async ({ room, content: p, context, optionPageUrl, page }) => {

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.waitForTimeout(1000)

    await settingsPage.getByText('功能设定').click()
    await settingsPage.locator('div#features\\.jimaku', { hasText: '同传弹幕过滤' }).getByText('启用离线记录').click()
    await settingsPage.getByText('保存设定').click()
    await settingsPage.waitForTimeout(2000)

    logger.info('正在測試離線記錄...')
    await page.bringToFront()
    await p.locator('#subtitle-list').waitFor({ state: 'visible' })

    const testJimaku = '由 playwright 工具發送'
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await p.waitForTimeout(3000)

    let subtitleList = await p.locator('#subtitle-list > p').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(4)

    p = await room.reloadAndGetLocator() // reloaded, so need to re get content locator
    await p.locator('#subtitle-list').waitFor({ state: 'visible' })

    subtitleList = await p.locator('#subtitle-list > p').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(4)

    logger.info('正在測試從設定刪除離線記錄...')
    await page.goto('about:blank')
    settingsPage.once('dialog', dialog => dialog.accept())
    await settingsPage.bringToFront()
    await settingsPage.locator('#features\\.jimaku [role=button] button').click()
    await settingsPage.getByText('所有同传弹幕过滤记录已经清空。').waitFor({ state: 'visible' })

    await page.bringToFront()
    await room.enterToRoom()
    p = await room.getContentLocator()
    subtitleList = await p.locator('#subtitle-list > p').filter({ hasText: testJimaku }).all()
    expect(subtitleList.length).toBe(0)
})

test('測試房間名單列表(黑名單/白名單)',
    testFeatureRoomList(
        'jimaku',
        expect,
        (content) => content.locator('#subtitle-list')
    )
)

test('测试添加同传用户名单/黑名单', async ({ content, context, optionPageUrl, room }) => {

    const subtitleList = content.locator('#subtitle-list')
    await expect(subtitleList).toBeVisible()

    const user1 = 1
    const user2 = 2

    const txt = '由 playwright 工具發送'
    const subtitles = content.locator('#subtitle-list > p').filter({ hasText: txt })

    const withBracket = `【${txt}】`

    logger.info('正在測試同傳字幕正則覆蓋....')

    await room.sendDanmaku(withBracket, user1)
    await room.sendDanmaku(withBracket, user1)
    await room.sendDanmaku(txt, user1) // this should not be covered

    await expect(subtitles).toHaveCount(2)

    logger.info('正在測試添加同傳用戶名單...')

    const settingsPage = await context.newPage()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })

    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('同传名单设定').click()

    await settingsPage.getByTestId('tongchuan-mans-input').fill(user1.toString())
    await settingsPage.getByTestId('tongchuan-mans-input').press('Shift+Enter')
    await settingsPage.getByText(`添加用户 ${user1} 成功`).waitFor({ state: 'visible' })

    await settingsPage.getByText('保存设定').click()

    await room.page.bringToFront()
    await subtitleList.waitFor({ state: 'visible' })
    await room.sendDanmaku(withBracket, user1)
    await room.sendDanmaku(withBracket, user1)
    await room.sendDanmaku(txt, user1) // this should be covered

    await expect(subtitles).toHaveCount(3)

    logger.info('正在測試添加同傳用戶黑名單...')

    await settingsPage.bringToFront()
    await settingsPage.getByTestId('tongchuan-blacklist-input').fill(user2.toString())
    await settingsPage.getByTestId('tongchuan-blacklist-input').press('Shift+Enter')
    await settingsPage.getByText(`添加用户 ${user2} 成功`).waitFor({ state: 'visible' })

    await settingsPage.getByText('保存设定').click()

    await room.page.bringToFront()
    await subtitleList.waitFor({ state: 'visible' })
    await room.sendDanmaku(withBracket, user2) // should be blacklisted
    await room.sendDanmaku(withBracket, user2) // should be blacklisted

    await expect(subtitles).toHaveCount(0)

    // github host runner does not have access to bilibili user api
    if (!process.env.CI) {

        logger.info('正在嘗試添加不存在用戶...')

        await settingsPage.bringToFront()
        await settingsPage.getByTestId('tongchuan-mans-input').fill('1234569')
        await settingsPage.getByTestId('tongchuan-mans-input').press('Enter')

        await expect(settingsPage.getByText('用户 1234569 不存在')).toBeVisible()

    }
})

test('測試右鍵同傳字幕來屏蔽同傳發送者', async ({ content, room, page, isThemeRoom }) => {

    test.skip(isThemeRoom, '此測試不適用於大海報房間')

    await content.locator('#subtitle-list').waitFor({ state: 'visible' })

    const user1 = 1
    const user2 = 2
    const txt = '由 playwright 工具發送'

    const subtitles = content.locator('#subtitle-list > p').filter({ hasText: txt })

    logger.info('正在測試同傳字幕發送...')
    await room.sendDanmaku(`【${txt}】`, user1)
    await expect(subtitles).toHaveCount(1)

    logger.info('正在測試右鍵屏蔽同傳發送者...')
    page.once('dialog', (dialog) => dialog.accept())
    await subtitles.nth(0).click({ button: 'right' })
    await content.getByText('屏蔽选中同传发送者').click()

    await content.getByText(/已不再接收 (.+) 的同传弹幕/).waitFor({ state: 'visible' })

    logger.info('正在測試屏蔽後是否生效...')

    await room.sendDanmaku(`【${txt}】`, user1) // this should be blocked
    await expect(subtitles).toHaveCount(1)

    await room.sendDanmaku(`【${txt}】`, user2) // this should not be blocked
    await expect(subtitles).toHaveCount(2)

})

test('測試全屏時字幕區塊是否存在 + 顯示切換', async ({ content: p, room, isThemeRoom }) => {

    test.skip(isThemeRoom, '此測試不適用於大海報房間')

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


test('測試保存設定後 css 能否生效', async ({ context, content, optionPageUrl, page, room }) => {

    logger.info('正在修改設定...')
    const settingsPage = await context.newPage()
    await settingsPage.bringToFront()
    await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
    await settingsPage.waitForTimeout(1000)

    await settingsPage.getByText('功能设定').click()
    await settingsPage.getByText('字幕设定').click()

    await settingsPage.getByTestId('jimaku-size').fill('30')
    await settingsPage.getByTestId('jimaku-first-size').fill('30')
    await settingsPage.getByTestId('jimaku-bg-height').fill('500')

    await selectOption(
        settingsPage.getByTestId('jimaku-position'),
        '置左'
    )

    await settingsPage.getByTestId('jimaku-color').fill('#123456')


    await settingsPage.getByText('保存设定').click()
    await settingsPage.waitForTimeout(2000)

    logger.info('正在測試字幕css...')
    await page.bringToFront()

    const testJimaku = '由 playwright 工具發送'
    await room.sendDanmaku(`【${testJimaku}】`)
    await room.sendDanmaku(`【${testJimaku}】`)
    await page.waitForTimeout(3000)

    await content.locator('#subtitle-list > p')
        .all()
        .then((p) =>
            Promise.all(p.flatMap(e =>
                [
                    expect(e).toHaveCSS('font-size', '30px'),
                    expect(e).toHaveCSS('color', 'rgb(18, 52, 86)'), // #123456
                ]
            ))
        )
    await expect(content.locator('#subtitle-list')).toHaveCSS('text-align', 'left')
    await expect(content.locator('#subtitle-list')).toHaveCSS('height', '500px')

})

test('測試大海報房間下字幕區塊是否存在', async ({ themeRoom }) => {

    // if force using themeRoom, do not use content argument
    const p = await themeRoom.getContentLocator()
    await p.locator('body').scrollIntoViewIfNeeded()
    await ensureButtonListVisible(p)

    const area = p.locator('#jimaku-full-area')
    await expect(area).toBeAttached()

    const subtitleList = area.locator('#subtitle-list')
    await expect(subtitleList).toBeVisible()

    const buttonList = await getButtonList(p)
    expect(buttonList.length).toBe(2)

    await expect(buttonList[0]).toHaveText('删除所有字幕记录')
    await expect(buttonList[1]).toHaveText('下载字幕记录')

})


async function ensureButtonListVisible(p: PageFrame) {
    if (isFrame(p) && !await p.getByText('删除所有字幕记录').isVisible()) {
        // 防止 toaster 遲遲不消失
        await p.evaluate(() => window.document.querySelector('#bjf-toaster li[data-y-position="top"][data-x-position="left"]')?.remove())
        await p.getByText('切换字幕按钮列表').click({ timeout: 120000 })
        await p.waitForTimeout(2000)
    }
}

async function getButtonList(content: PageFrame): Promise<Locator[]> {
    await ensureButtonListVisible(content)
    await content.locator('#jimaku-area').waitFor({ state: 'visible' })
    return await content.getByTestId('subtitle-button-list').locator('button').all()
}