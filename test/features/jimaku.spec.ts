import { test, expect } from '../fixture'

test('test', async ({ liveRoom }) => {
    expect(liveRoom.url(), 'room url').toContain('https://live.bilibili.com/')
})

