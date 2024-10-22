import type { SettingSchema as LLMSchema } from '~options/fragments/llm'

import cloudflare from './cloudflare-ai'
import nano from './gemini-nano'
import worker from './remote-worker'

export interface LLMProviders {
    validate(): Promise<void>
    prompt(chat: string): Promise<string>
    promptStream(chat: string): AsyncGenerator<string>
    asSession(): Promise<Session<LLMProviders>>
}

export type Session<T> = Disposable & Omit<T, 'asSession' | 'validate'>

const llms = {
    cloudflare,
    nano,
    worker
}

export type LLMs = typeof llms

export type LLMTypes = keyof LLMs

function createLLMProvider(settings: LLMSchema): LLMProviders {
    const type = settings.provider
    const LLM = llms[type]
    return new LLM(settings)
}

export default createLLMProvider