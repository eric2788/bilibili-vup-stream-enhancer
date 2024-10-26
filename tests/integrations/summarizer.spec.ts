import { expect, test } from "@tests/fixtures/component";
import logger from "@tests/helpers/logger";
import createLLMProvider, { type LLMTypes } from "~llms";

const prompt = `这位是一名在b站直播间直播的日本vtuber说过的话,请根据下文对话猜测与观众的互动内容,并用中文总结一下他们的对话:\n\n${[
    '大家好',
    '早上好',
    '知道我今天吃了什么吗?',
    '是麦当劳哦!',
    '"不就个麦当劳而已吗"不是啦',
    '是最近那个很热门的新品',
    '对，就是那个',
    '然后呢, 今天久违的出门了',
    '对，平时都是宅在家里的呢',
    '"终于长大了"喂w',
    '然后今天去了漫展来着',
    '很多人呢',
    '之前的我看到那么多人肯定社恐了',
    '但今次意外的没有呢',
    '"果然是长大了"也是呢',
    '然后呢, 今天买了很多东西',
    '插画啊，手办啊，周边之类的',
    '荷包大出血w',
    '不过觉得花上去应该值得的...吧?',
    '喂，好过分啊',
    '不过确实不应该花那么多钱的',
    '然后呢，回家途中看到了蟑螂的尸体',
    '太恶心了',
    '然后把我一整天好心情搞没了w',
    '"就因为一个蟑螂"对www',
    '不过跟你们谈完反而心情好多了',
    '谢谢大家',
    '那么今天的杂谈就到这里吧',
    '下次再见啦',
    '拜拜~'
].join('\n')}` as const

function testModel(model: string, { trash = false, provider = 'worker' }: { trash?: boolean, provider?: LLMTypes } = {}) {
    return async function () {

        logger.info(`正在测试模型 ${model} ...`)

        const llm = createLLMProvider({
            provider,
            model
        })

        const res = await llm.prompt(prompt)
        logger.info(`模型 ${model} 的总结结果`, res)

        const maybe = expect.configure({ soft: true })
        maybe(res).toMatch(/主播|日本VTuber|日本vtuber|vtuber/)
        maybe(res).toMatch(/直播|观众/)

        if (!trash) {
            maybe(res).toContain('麦当劳')
            maybe(res).toContain('漫展')
            maybe(res).toContain('蟑螂')
        }
    }
}

test.slow()

test('测试 @cf/qwen/qwen1.5-14b-chat-awq 模型的AI总结结果', testModel('@cf/qwen/qwen1.5-14b-chat-awq'))

test('测试 @cf/qwen/qwen1.5-7b-chat-awq 模型的AI总结结果', testModel('@cf/qwen/qwen1.5-7b-chat-awq'))

test('测试 @cf/qwen/qwen1.5-1.8b-chat 模型的AI总结结果', testModel('@cf/qwen/qwen1.5-1.8b-chat'))

// this model is too trash that cannot have any keywords
test('测试 @hf/google/gemma-7b-it 模型的AI总结结果', testModel('@hf/google/gemma-7b-it', { trash: true }))

test('测试 @hf/nousresearch/hermes-2-pro-mistral-7b 模型的AI总结结果', testModel('@hf/nousresearch/hermes-2-pro-mistral-7b'))