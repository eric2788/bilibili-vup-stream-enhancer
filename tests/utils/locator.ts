import type { Locator } from "@playwright/test"

export async function findLocatorAsync(locators: Locator[], predicate: (locator: Locator) => Promise<boolean>): Promise<Locator> {
    for (const locator of locators) {
        if (await predicate(locator))
            return locator
    }
    return undefined
}
