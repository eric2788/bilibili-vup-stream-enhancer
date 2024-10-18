import type { LLMProviders, Session } from "~llms";

export default class CloudflareAI implements LLMProviders {

    constructor(
        private readonly accountId: string,
        private readonly apiToken: String,
        private readonly model = '@cf/facebook/bart-large-cnn' // text summarization model
    ) { }

    async validate(): Promise<void> {
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/models/search?per_page=1`, {
            headers: {
                Authorization: `Bearer ${this.apiToken}`
            }
        })
        const json = await res.json()
        if (!json.success) throw new Error('Cloudflare API 验证失败')
    }

    async prompt(chat: string): Promise<string> {
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${this.model}`, {
            headers: {
                Authorization: `Bearer ${this.apiToken}`
            },
            body: JSON.stringify({ prompt: chat })
        })
        const json = await res.json()
        return json.response
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${this.model}`, {
            headers: {
                Authorization: `Bearer ${this.apiToken}`
            },
            body: JSON.stringify({ prompt: chat, stream: true })
        })
        if (!res.body) throw new Error('Cloudflare AI response body is not readable')
        const reader = res.body.getReader()
        const decoder = new TextDecoder('utf-8', { ignoreBOM: true })
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const { response } = JSON.parse(decoder.decode(value, { stream: true }))
            yield response
        }
    }

    async asSession(): Promise<Session<LLMProviders>> {
        console.warn('Cloudflare AI session is not supported')
        return {
            ...this,
            [Symbol.dispose]: () => { }
        }
    }


}