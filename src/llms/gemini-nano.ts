import type { LLMProviders, Session } from "~llms"

export default class GeminiNano implements LLMProviders {

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
            return session.prompt(chat)
        } finally {
            session[Symbol.dispose]()
        }
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        const session = await this.asSession()
        try {
            return session.promptStream(chat)
        } finally {
            session[Symbol.dispose]()
        }
    }

    async asSession(): Promise<Session<LLMProviders>> {

        if (window.ai.assistant || window.ai.languageModel) {
            const assistant = window.ai.assistant ?? window.ai.languageModel
            const capabilities = await assistant.capabilities()
            if (capabilities.available === 'readily') {
                return new GeminiAssistant(await assistant.create())
            } else {
                console.warn('AI Assistant 当前不可用: ', capabilities)
            }
        } 
        
        if (window.ai.summarizer) {
            const summarizer = window.ai.summarizer
            const capabilities = await summarizer.capabilities()
            if (capabilities.available === 'readily') {
                return new GeminiSummarizer(await summarizer.create())
            } else {
                console.warn('AI Summarizer 当前不可用: ', capabilities)
            }
        } 

        throw new Error('你的浏览器 AI 功能当前不可用')
    }
}

class GeminiAssistant implements Session<LLMProviders> {

    constructor(private readonly assistant: AIAssistant) { }

    prompt(chat: string): Promise<string> {
        return this.assistant.prompt(chat)
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        const stream = this.assistant.promptStreaming(chat)
        for await (const chunk of stream) {
            yield chunk
        }
    }

    [Symbol.dispose](): void {
        this.assistant.destroy()
    }
}


class GeminiSummarizer implements Session<LLMProviders> {

    constructor(private readonly summarizer: AISummarizer) { }

    prompt(chat: string): Promise<string> {
        return this.summarizer.summarize(chat)
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        const stream = this.summarizer.summarizeStreaming(chat)
        for await (const chunk of stream) {
            yield chunk
        }
    }

    [Symbol.dispose](): void {
        this.summarizer.destroy()
    }

}
