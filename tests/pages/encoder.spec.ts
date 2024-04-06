import { test, expect } from "@tests/fixtures/background";



test('測試加載多線程 ffmpeg.wasm ', async ({ page, tabUrl }) => {
    await page.goto(tabUrl('encoder.html?id=12345'), { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('正在加载 FFMpeg')).toBeVisible()
    await expect(page.getByText('FFMpeg 已成功加载。')).toBeVisible()
})


test('測試不帶ID時顯示無效的請求', async ({ page, tabUrl }) => {
    await page.goto(tabUrl('encoder.html'), { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('无效的请求')).toBeVisible()
})