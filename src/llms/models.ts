import { prebuiltAppConfig } from "@mlc-ai/web-llm"
import type { LLMTypes } from "~llms"

export type ModelList = {
    providers: LLMTypes[]
    models: string[]
}

const models: ModelList[] = [
    {
        providers: ['worker', 'cloudflare'],
        models: [
            '@cf/qwen/qwen1.5-14b-chat-awq',
            '@cf/qwen/qwen1.5-7b-chat-awq',
            '@cf/qwen/qwen1.5-1.8b-chat',
            '@hf/google/gemma-7b-it',
            '@hf/nousresearch/hermes-2-pro-mistral-7b'
        ]
    },
    {
        providers: [ 'webllm' ],
        models: prebuiltAppConfig.model_list.map(m => m.model_id)
    }
]


export default models