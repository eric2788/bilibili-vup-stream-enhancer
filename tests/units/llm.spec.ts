import { test, expect } from '@tests/fixtures/component'
import logger from '@tests/helpers/logger'


test('嘗試使用 Cloudflare AI 對話', async ({ page, modules }) => {

    test.skip(!process.env.CF_ACCOUNT_ID || !process.env.CF_API_TOKEN, '請設定 CF_ACCOUNT_ID 和 CF_API_TOKEN 環境變數')

    await modules['llm'].loadToPage()
    await modules['utils'].loadToPage()

    const ret = await page.evaluate(async () => {
        const { llms } = window as any
        console.log('llms: ', llms)
        const llm = await llms.createLLMProvider('cloudflare',
            process.env.CF_ACCOUNT_ID,
            process.env.CF_API_TOKEN
        )
        return await llm.prompt('你好')
    })

    logger.info('response: ', ret)
    await expect(ret).not.toBeEmpty()
})

test('嘗試使用 Gemini Nano 對話', async ({ page, modules }) => {

    const supported = await page.evaluate(async () => {
        return !!window.ai;
    })

    test.skip(!supported, 'Gemini Nano 不支援此瀏覽器')

    await modules['llm'].loadToPage()
    await modules['utils'].loadToPage()

    const ret = await page.evaluate(async () => {
        const { llms } = window as any
        console.log('llms: ', llms)
        const llm = await llms.createLLMProvider('nano')
        return await llm.prompt('你好')
    })

    logger.info('response: ', ret)
    await expect(ret).not.toBeEmpty()
})

test('嘗試使用 Remote Worker 對話', async ({ page, modules }) => {

    await modules['llm'].loadToPage()
    await modules['utils'].loadToPage()

    const ret = await page.evaluate(async () => {
        const { llms } = window as any
        console.log('llms: ', llms)
        const llm = await llms.createLLMProvider('worker')
        return await llm.prompt('你好')
    })

    logger.info('response: ', ret)
    await expect(ret).not.toBeEmpty()
    
})