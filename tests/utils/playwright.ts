import type { Locator } from "@playwright/test"

/**
 * Finds the first locator in the given array that satisfies the provided predicate.
 * 
 * @param locators - The array of locators to search through.
 * @param predicate - The predicate function to test each locator.
 * @returns A Promise that resolves to the first locator that satisfies the predicate, or undefined if no locator is found.
 */
export async function findLocatorAsync(locators: Locator[], predicate: (locator: Locator) => Promise<boolean>): Promise<Locator> {
    for (const locator of locators) {
        if (await predicate(locator))
            return locator
    }
    return undefined
}

/**
 * Retrieves a list of super chat elements within a given section.
 * 
 * @param section - The locator for the section containing the super chat elements.
 * @param options - Optional filtering options for the super chat elements.
 * @returns A promise that resolves to an array of super chat locators.
 */
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