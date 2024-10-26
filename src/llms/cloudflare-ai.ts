import { runAI, runAIStream, validateAIToken } from "~api/cloudflare";
import type { LLMEvent, LLMProviders, Session } from "~llms";
import type { SettingSchema } from "~options/fragments/llm";

export default class CloudFlareAI implements LLMProviders {

    private static readonly DEFAULT_MODEL: string = '@cf/qwen/qwen1.5-14b-chat-awq'

    private readonly accountId: string
    private readonly apiToken: string

    private readonly model: string

    constructor(settings: SettingSchema) {
        this.accountId = settings.accountId
        this.apiToken = settings.apiToken

        // only text generation model for now
        this.model = settings.model || CloudFlareAI.DEFAULT_MODEL
    }

    // mot support progress
    on<E extends keyof LLMEvent>(event: E, listener: LLMEvent[E]): void {}

    cumulative: boolean = true

    async validate(): Promise<void> {
        const success = await validateAIToken(this.accountId, this.apiToken, this.model)
        if (typeof success === 'boolean' && !success) throw new Error('Cloudflare API 验证失败')
        if (typeof success === 'string') throw new Error(success)
    }

    async prompt(chat: string): Promise<string> {
        const res = await runAI(this.wrap(chat), { token: this.apiToken, account: this.accountId, model: this.model })
        if (!res.result) throw new Error(res.errors.join(', '))
        return res.result.response
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        return runAIStream(this.wrap(chat), { token: this.apiToken, account: this.accountId, model: this.model })
    }

    async asSession(): Promise<Session<LLMProviders>> {
        console.warn('Cloudflare AI session is not supported')
        return {
            ...this,
            [Symbol.asyncDispose]: async () => { }
        }
    }

    // text generation model input schema
    // so only text generation model for now
    private wrap(chat: string): any {
        return {
            max_tokens: 512,
            prompt: chat,
            temperature: 0.2
        }
    }


}