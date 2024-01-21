import { test, expect } from '../fixture'

test('test', async ({ room, page }) => {
    expect(page.url(), 'room url').toContain('https://live.bilibili.com/')
})