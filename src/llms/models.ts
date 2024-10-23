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
        models: [
            'Qwen2-7B-Instruct-q4f32_1-MLC',
            'Qwen2.5-14B-Instruct-q4f16_1-MLC',
            'gemma-2-9b-it-q4f16_1-MLC',
            'Qwen2.5-3B-Instruct-q0f16-MLC',
            'Phi-3-mini-128k-instruct-q0f16-MLC',
            'Phi-3.5-mini-instruct-q4f16_1-MLC-1k'
        ]
    }
]


export default models