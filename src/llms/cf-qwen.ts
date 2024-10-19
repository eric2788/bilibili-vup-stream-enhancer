import { runAI, runAIStream, validateAIToken } from "~api/cloudflare";
import type { LLMProviders, Session } from "~llms";

export default class CloudFlareQwen implements LLMProviders {

    private static readonly MODEL: string = '@cf/qwen/qwen1.5-14b-chat-awq'

    constructor(
        private readonly accountId: string,
        private readonly apiToken: string,
    ) { }

    async validate(): Promise<void> {
        const success = await validateAIToken(this.accountId, this.apiToken)
        if (!success) throw new Error('Cloudflare API 验证失败')
    }

    async prompt(chat: string): Promise<string> {
        const res = await runAI(this.wrap(chat), { token: this.apiToken, account: this.accountId, model: CloudFlareQwen.MODEL })
        if (!res.result) throw new Error(res.errors.join(', '))
        return res.result.response
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        return runAIStream(this.wrap(chat), { token: this.apiToken, account: this.accountId, model: CloudFlareQwen.MODEL })
    }

    async asSession(): Promise<Session<LLMProviders>> {
        console.warn('Cloudflare AI session is not supported')
        return {
            ...this,
            [Symbol.dispose]: () => { }
        }
    }

    private wrap(chat: string): any {
        return {
            max_tokens: 512,
            prompt: chat,
            temperature: 0.2
        }
    }


}