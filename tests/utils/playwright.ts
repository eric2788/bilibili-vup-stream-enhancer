import type { Locator } from "@playwright/test"

export async function findLocatorAsync(locators: Locator[], predicate: (locator: Locator) => Promise<boolean>): Promise<Locator> {
    for (const locator of locators) {
        if (await predicate(locator))
            return locator
    }
    return undefined
}

export async function getSuperChatList(section: Locator, options?: {
    has?: Locator;
    hasNot?: Locator;
    hasNotText?: string|RegExp;
    hasText?: string|RegExp;
  }): Promise<Locator[]> {
    // ensure subtitle list is visible
    if (!await section.getByRole('menu').isVisible({ timeout: 100 })) {
        await section.locator('button', { hasText: /^醒目留言$/ }).click()
    }
    return section.getByRole('menu').locator('section.bjf-scrollbar > div').filter(options).all()
}