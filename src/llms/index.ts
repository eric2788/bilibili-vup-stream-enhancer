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

export type LLMTypes = keyof typeof llms

export async function createLLMProvider(type: LLMTypes, ...args: any[]): Promise<LLMProviders> {
    const LLM = llms[type].bind(this, ...args)
    return new LLM()
}

export default createLLMProvider