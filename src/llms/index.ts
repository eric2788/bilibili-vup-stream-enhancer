import qwen from './cf-qwen'
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
    qwen,
    nano,
    worker
}

export type LLMs = typeof llms

export type LLMTypes = keyof LLMs

async function createLLMProvider<K extends LLMTypes, M extends LLMs[K]>(type: K, ...args: ConstructorParameters<M>): Promise<LLMProviders> {
    const LLM = llms[type].bind(this, ...args)
    return new LLM()
}

export default createLLMProvider