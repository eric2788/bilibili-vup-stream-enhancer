import { runAI, runAIStream, validateAIToken } from "~api/cloudflare";
import type { LLMProviders, Session } from "~llms";

export default class CloudflareAI implements LLMProviders {

    constructor(
        private readonly accountId: string,
        private readonly apiToken: string,
        private readonly model = '@cf/facebook/bart-large-cnn' // text summarization model
    ) { }

    async validate(): Promise<void> {
        const success = await validateAIToken(this.accountId, this.apiToken)
        if (!success) throw new Error('Cloudflare API 验证失败')
    }

    async prompt(chat: string): Promise<string> {
        const res = await runAI(chat, { token: this.apiToken, account: this.accountId, model: this.model })
        if (!res.result) throw new Error(res.errors.join(', '))
        return res.result.response
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        return runAIStream(chat, { token: this.apiToken, account: this.accountId, model: this.model })
    }

    async asSession(): Promise<Session<LLMProviders>> {
        console.warn('Cloudflare AI session is not supported')
        return {
            ...this,
            [Symbol.dispose]: () => { }
        }
    }


}