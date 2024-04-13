import type { Expect, Locator } from "@playwright/test"
import type { ContentFixtures, ContentOptions } from "@tests/fixtures/content";
import type { PageFrame } from "@tests/helpers/page-frame";

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

/**
 * A utility function that tests a feature in a room list.
 * 
 * @param feature - The feature to test.
 * @param expect - The expect function from the testing framework.
 * @param locate - A function that locates the content on the page.
 * @returns A pre-configured test function that tests the feature in a room list.
 * 
 * @example
 * 
 * ```ts
 * test('測試房間名單列表(黑名單/白名單)', 
 *  testFeatureRoomList(
 *      'jimaku',
 *      expect,
 *      (content) => content.locator('#subtitle-list')
 *  )
 * )
 * ```
 */
export function testFeatureRoomList(feature: string, expect: Expect<Locator>, locate: (content: PageFrame) => Locator): (args: any) => Promise<void> {

    return async ({ room, content, context, optionPageUrl }) => {

        const locator = locate(content)
        await expect(locator).toBeVisible()
    
        const settingsPage = await context.newPage()
        await settingsPage.goto(optionPageUrl, { waitUntil: 'domcontentloaded' })
        await settingsPage.getByText('功能设定').click()
        const roomInput = settingsPage.getByTestId(feature+'-whitelist-rooms-input')
        const switcher = settingsPage.getByTestId(feature+'-whitelist-rooms').getByText('使用为黑名单')
        await roomInput.fill(room.info.roomid.toString())
        await switcher.click()
        await roomInput.press('Enter')
    
        await settingsPage.getByText('保存设定').click()
    
        await room.page.bringToFront()
        await content.waitForTimeout(1000)
    
        await expect(locator).toBeHidden()
    
        await settingsPage.bringToFront()
        await switcher.click()
        await settingsPage.getByText('保存设定').click()
    
        await room.page.bringToFront()
        await content.waitForTimeout(1000)
    
        await expect(locator).toBeVisible()
    
    }
}


export async function selectOption(selector: Locator, option: string | Locator){
    await selector.locator('div > div').nth(0).click()
    if(typeof option === 'string'){
        await selector.getByText(option).click()
    } else {
        await option.click()
    }
}