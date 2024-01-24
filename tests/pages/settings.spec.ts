
import { test, expect } from '../fixture'

test.beforeEach(async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/tabs/settings.html`, { waitUntil: 'domcontentloaded' })
})

test('test', async ({ page }) => {
    expect(page.getByText('设定页面')).toBeDefined()
})

test('test fragments collapse', async ({ page }) => {
    const form = page.locator('form.container')
    await form.waitFor({ state: 'attached' })
    expect(form).toBeDefined()
    const sections = await form.locator('> section').all()
    expect(sections.length).toBe(5)
    for (const section of sections) {
        await section.click()
    }
})