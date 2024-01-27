import type { Frame, Locator, Page } from "@playwright/test"

export async function findLocatorAsync(locators: Locator[], predicate: (locator: Locator) => Promise<boolean>): Promise<Locator> {
    for (const locator of locators) {
        if (await predicate(locator))
            return locator
    }
    return undefined
}


export async function dismissLoginDialog(page: Page | Frame): Promise<void> {
    // 防止登录弹窗
    if (await page.locator('body > div.bili-mini-mask > div').isVisible({ timeout: 5000 })) {
        await page.locator('body > div.bili-mini-mask > div > div.bili-mini-close-icon').click()
    }
}