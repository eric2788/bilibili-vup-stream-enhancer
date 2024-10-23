import type { SettingSchema as LLMSchema } from '~options/fragments/llm'

import cloudflare from './cloudflare-ai'
import nano from './gemini-nano'
import worker from './remote-worker'
import webllm from './web-llm'

export interface LLMProviders {
    cumulative: boolean
    validate(progress?: (p: number, t: string) => void): Promise<void>
    prompt(chat: string): Promise<string>
    promptStream(chat: string): AsyncGenerator<string>
    asSession(): Promise<Session<LLMProviders>>
}

export type Session<T> = AsyncDisposable & Omit<T, 'asSession' | 'validate' | 'cumulative'>

const llms = {
    cloudflare,
    nano,
    worker,
    webllm
}

export type LLMs = typeof llms

export type LLMTypes = keyof LLMs

function createLLMProvider(settings: LLMSchema): LLMProviders {
    const type = settings.provider
    const LLM = llms[type]
    return new LLM(settings)
}

export default createLLMProvider