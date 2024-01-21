import { sendFakeBLiveMessage } from '../utils/bilibili'
import { test, expect } from '../fixture'


test('Test Feature Section Exist', async ({ room, page }) => {
    expect(page.locator('plasmo-csui').locator('section#bjf-feature-jimaku')).toBeDefined()
})

test('Test Jimaku Area', async ({ room, page }) => {

    const area = page.locator('#jimaku-area')
    await expect(area).toBeAttached()
    await expect(area).toBeVisible()

    const subtitleList = page.locator('#subtitle-list')
    await expect(subtitleList).toBeAttached()
    await expect(subtitleList).toBeVisible()

    const buttonList = await area.locator('div > div > div:nth-child(3) > button').all()
    expect(buttonList.length).toBe(2)

    await expect(buttonList[0].getByText('删除所有字幕记录')).toBeVisible()
    await expect(buttonList[1].getByText('下载字幕记录')).toBeVisible()
})


test('Test Delete Jimaku Area', async ({ room, page }) => {

    const button = page.getByText('删除所有字幕记录')
    await expect(button).toBeVisible()

    await button.click()
    await expect(page.getByText(/沒有字幕记录需要被删除|已删除房间 \d+ 共\d+条字幕记录/)).toBeVisible()

    // after delete, subtitle list should be empty
    let subtitleList = await page.locator('#subtitle-list > p').all()
    expect(subtitleList.length).toBe(0)

    // await page.evaluateHandle(() => {
    //     sendDanmaku('【Test 1】')
    //     sendDanmaku('【Test 2】')
    // })
    // subtitleList = subtitleList = await page.locator('#subtitle-list > p').all()
    // expect(subtitleList.length).toBe(2)
})



function sendDanmaku(danmaku: string) {
    sendFakeBLiveMessage('DANMU_MSG', {
        cmd: 'DANMU_MSG',
        info: [
            [
                undefined,
                undefined, // 弹幕显示模式（滚动、顶部、底部）
                undefined, // 字体尺寸
                undefined, // 颜色
                Date.now(), // 时间戳（毫秒）
                123132123132132, // 随机数，前端叫作弹幕ID，可能是去重用的
                undefined,
                undefined, // 用户ID文本的CRC32
                undefined,
                0, // 是否礼物弹幕（节奏风暴）
                undefined, // 右侧评论栏气泡
                undefined,
                undefined,
                "{}", // 弹幕类型，0文本，1表情，2语音
                "{}", // 表情参数
                undefined,
                undefined
            ],
            danmaku,
            [
                parseInt('123132123123123'),
                "username",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
        ],
        dm_v2: ""
    })
}
