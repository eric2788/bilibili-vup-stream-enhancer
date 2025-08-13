import type { SettingSchema as LLMSchema } from '~options/fragments/llm'

import cloudflare from './cloudflare-ai'
import nano from './gemini-nano'
import webllm from './web-llm'
import openai from './open-ai'

export type LLMEvent = {
    progress: (p: number, t: string) => void
}

export interface LLMProviders {
    cumulative: boolean
    on<E extends keyof LLMEvent>(event: E, listener: LLMEvent[E]): void
    validate(): Promise<void>
    models(): Promise<string[]>
    prompt(chat: string): Promise<string>
    promptStream(chat: string): AsyncGenerator<string>
    asSession(): Promise<Session<LLMProviders>>
}

export type Session<T extends LLMProviders> = AsyncDisposable & Pick<T, 'prompt' | 'promptStream'>

const llms = {
    cloudflare,
    nano,
    webllm,
    openai
}

export type LLMs = typeof llms

export type LLMTypes = keyof LLMs

function createLLMProvider(settings: LLMSchema): LLMProviders {
    const type = settings.provider
    const LLM = llms[type]
    return new LLM(settings)
}

export default createLLMProvider