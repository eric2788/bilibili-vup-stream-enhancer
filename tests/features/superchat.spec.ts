import { test, expect } from '@tests/fixtures/content'

test('test', async ({ room, page }) => {
    expect(page.url(), 'room url').toContain('https://live.bilibili.com/')
})