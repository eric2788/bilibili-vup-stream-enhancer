import type { LLMEvent, LLMProviders, Session } from "~llms"

export default class GeminiNano implements LLMProviders {
    
    cumulative: boolean = false

    on<E extends keyof LLMEvent>(event: E, listener: LLMEvent[E]): void {}

    async validate(): Promise<void> {
        if (!window.ai) throw new Error('你的浏览器没有启用 AI 功能')
        if (!window.ai.languageModel &&
            !window.ai.assistant &&
            !window.ai.summarizer
        ) throw new Error('你的浏览器没有启用 AI 功能')
    }

    async prompt(chat: string): Promise<string> {
        const session = await this.asSession()
        try {
            console.debug('[gemini nano] prompting: ', chat)
            return session.prompt(chat)
        } finally {
            console.debug('[gemini nano] done')
            await session[Symbol.asyncDispose]()
        }
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        const session = await this.asSession()
        try {
            console.debug('[gemini nano] prompting stream: ', chat)
            const res = session.promptStream(chat)
            for await (const chunk of res) {
                yield chunk
            }
        } finally {
            console.debug('[gemini nano] done')
            await session[Symbol.asyncDispose]()
        }
    }

    async models(): Promise<string[]> {
        return [];
    }

    async asSession(): Promise<Session<LLMProviders>> {

        if (window.ai.summarizer) {
            const summarizer = window.ai.summarizer
            const capabilities = await summarizer.capabilities()
            if (capabilities.available === 'readily') {
                console.debug('using gemini summarizer')
                return new GeminiSummarizer(await summarizer.create())
            } else {
                console.warn('AI Summarizer 当前不可用: ', capabilities)
            }
        } 

        if (window.ai.assistant || window.ai.languageModel) {
            const assistant = window.ai.assistant ?? window.ai.languageModel
            const capabilities = await assistant.capabilities()
            if (capabilities.available === 'readily') {
                console.debug('using gemini assistant')
                return new GeminiAssistant(await assistant.create())
            } else {
                console.warn('AI Assistant 当前不可用: ', capabilities)
            }
        } 

        throw new Error('你的浏览器 AI 功能当前不可用')
    }
}

class GeminiAssistant implements Session<LLMProviders> {

    constructor(private readonly assistant: AIAssistant) { }

    prompt(chat: string): Promise<string> {
        console.debug('[assistant] prompting: ', chat)
        return this.assistant.prompt(chat)
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        console.debug('[assistant] prompting stream: ', chat)
        const stream = this.assistant.promptStreaming(chat)
        for await (const chunk of stream) {
            yield chunk
        }
    }

    async [Symbol.asyncDispose]() {
        this.assistant.destroy()
    }
}


class GeminiSummarizer implements Session<LLMProviders> {

    constructor(private readonly summarizer: AISummarizer) { }

    prompt(chat: string): Promise<string> {
        console.debug('[summarizer] summarizing: ', chat)
        return this.summarizer.summarize(chat)
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        console.debug('[summarizer] summarizing stream: ', chat)
        const stream = this.summarizer.summarizeStreaming(chat)
        for await (const chunk of stream) {
            yield chunk
        }
    }

    async [Symbol.asyncDispose]() {
        this.summarizer.destroy()
    }

}
