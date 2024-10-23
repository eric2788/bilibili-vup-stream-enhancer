import { test, expect } from '@tests/fixtures/component'
import logger from '@tests/helpers/logger'
import createLLMProvider from "~llms"


test.slow()

test('嘗試使用 Cloudflare AI 對話', { tag: "@scoped" }, async () => {

    test.skip(!process.env.CF_ACCOUNT_ID || !process.env.CF_API_TOKEN, '請設定 CF_ACCOUNT_ID 和 CF_API_TOKEN 環境變數')

    const llm = createLLMProvider({
        provider: 'cloudflare',
        accountId: process.env.CF_ACCOUNT_ID,
        apiToken: process.env.CF_API_TOKEN
    })

    logger.info('正在测试 json 返回请求...')
    const res = await llm.prompt('你好')

    logger.info('response: ', res)
    expect(res).not.toBeUndefined()
    expect(res).not.toBe('')

    logger.info('正在测试 SSE 请求...')
    const res2 = llm.promptStream('地球为什么是圆的?')

    let msg = '';
    for await (const r of res2) {
        logger.info('response: ', r)
        msg += r
    }

    expect(msg).not.toBeUndefined()
    expect(msg).not.toBe('')
})

test('嘗試使用 Gemini Nano 對話', { tag: "@scoped" }, async ({ page, modules }) => {

    const supported = await page.evaluate(async () => {
        return !!window.ai;
    })

    logger.debug('Gemini Nano supported: ', supported)
    test.skip(!supported, 'Gemini Nano 不支援此瀏覽器')

    await modules['llm'].loadToPage()
    await modules['utils'].loadToPage()

    const ret = await page.evaluate(async () => {
        const { llms } = window as any
        console.log('llms: ', llms)
        const llm = llms.createLLMProvider({ provider: 'nano' })
        return await llm.prompt('你好')
    })

    logger.info('response: ', ret)
    await expect(ret).not.toBeEmpty()

    const ret2 = await page.evaluate(async () => {
        const { llms } = window as any
        const llm = llms.createLLMProvider({ provider: 'nano' })
        const res = llm.promptStream('地球为什么是圆的?')
        let msg = '';
        for await (const r of res) {
            console.log('response: ', r)
            msg = r
        }
        return msg
    })

    logger.info('stream response: ', ret2)
})

test('嘗試使用 Remote Worker 對話', { tag: "@scoped" }, async () => {

    const llm = createLLMProvider({ provider: 'worker' })

    logger.info('正在测试 json 返回请求...')
    const res = await llm.prompt('你好')

    logger.info('response: ', res)
    expect(res).not.toBeUndefined()
    expect(res).not.toBe('')

    logger.info('正在测试 SSE 请求...')
    const res2 = llm.promptStream('地球为什么是圆的?')

    let msg = '';
    for await (const r of res2) {
        logger.info('response: ', r)
        msg += r
    }

    expect(msg).not.toBeUndefined()
    expect(msg).not.toBe('')

})

test('嘗試使用 Web LLM 對話', { tag: "@scoped" }, async ({ modules, page }) => {

    test.setTimeout(0)
    await modules['llm'].loadToPage()

    const supported = await page.evaluate(async () => {
        try {
            const adapter = await navigator.gpu.requestAdapter()
            const device = await adapter.requestDevice()
            return !!device
        } catch (err) {
            console.warn('WebGPU not supported: ', err)
            return false
        }
    })

    test.skip(!supported, 'WebGPU 不支援此瀏覽器')

    logger.info('正在测试 json 返回请求...')
    const res = await page.evaluate(async () => {

        const { llms } = window as any
        const llm = llms.createLLMProvider({ provider: 'webllm', module: 'TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC-1k' })
        const session = await llm.asSession()
        {
            (window as any).session = session
        }
        return await session.prompt('你好')
    })

    logger.info('response: ', res)
    expect(res).not.toBeUndefined()
    expect(res).not.toBe('')

    logger.info('正在测试 SSE 请求...')
    const msg = await page.evaluate(async () => {
        const { session } = window as any
        if (!session) {
            console.error('session not found')
            return undefined
        }
        const res = session.promptStream('地球为什么是圆的?')
        let msg = '';
        for await (const r of res) {
            console.log('response: ', r)
            msg = r
        }
        return msg
    })

    expect(msg).not.toBeUndefined()
    expect(msg).not.toBe('')

    logger.info("正在清除已下載的 LLM...")
    await page.evaluate(async () => {
        const { session } = window as any
        if (!session) return
        await session[Symbol.asyncDispose]()
    })

})