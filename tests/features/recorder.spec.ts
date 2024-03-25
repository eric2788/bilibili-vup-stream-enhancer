import { test, expect } from "@tests/fixtures/content"

test('測試功能元素是否存在', { tag: "@scoped" }, async ({ content }) => {
    
    const csui = content.locator('bjf-csui')
    await csui.waitFor({ state: 'attached', timeout: 10000 })

    await expect(csui.locator('section#bjf-feature-recorder')).toBeAttached()

})