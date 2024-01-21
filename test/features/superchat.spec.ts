import { test, expect } from '../fixture'

test('test', async ({ page }) => {
    expect(page.url(), 'room url').toContain('https://live.bilibili.com/')
})