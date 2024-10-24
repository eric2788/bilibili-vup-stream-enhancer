import type { MLCEngine } from "@mlc-ai/web-llm";
import type { LLMProviders, Session } from "~llms";
import type { SettingSchema } from "~options/fragments/llm";

export default class WebLLM implements LLMProviders {

    private static readonly DEFAULT_MODEL: string = 'Qwen2-7B-Instruct-q4f32_1-MLC'

    private readonly model: string

    constructor(settings: SettingSchema) {
        this.model = settings.model || WebLLM.DEFAULT_MODEL
    }

    cumulative: boolean = true

    async validate(progresser?: (p: number, t: string) => void): Promise<void> {
        await this.initializeEngine(progresser)
    }

    async prompt(chat: string): Promise<string> {
        const session = await this.asSession()
        try {
            console.debug('[web-llm] prompting: ', chat)
            return session.prompt(chat)
        } finally {
            console.debug('[web-llm] done')
            await session[Symbol.asyncDispose]()
        }
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        const session = await this.asSession()
        try {
            console.debug('[web-llm] prompting stream: ', chat)
            const res = session.promptStream(chat)
            for await (const chunk of res) {
                yield chunk
            }
        } finally {
            console.debug('[web-llm] done')
            await session[Symbol.asyncDispose]()
        }
    }

    async asSession(): Promise<Session<LLMProviders>> {
        const engine = await this.initializeEngine()
        return {
            async prompt(chat: string) {
                await engine.interruptGenerate()
                const c = await engine.completions.create({
                    prompt: chat,
                    max_tokens: 512,
                    temperature: 0.2,
                })
                return c.choices[0]?.text ?? engine.getMessage()
            },
            async *promptStream(chat: string): AsyncGenerator<string> {
                await engine.interruptGenerate()
                const chunks = await engine.completions.create({
                    prompt: chat,
                    max_tokens: 512,
                    temperature: 0.2,
                    stream: true
                })
                for await (const chunk of chunks) {
                    yield chunk.choices[0]?.text || "";
                    if (chunk.usage) {
                        console.debug('Usage:', chunk.usage)
                    }
                }
            },
            [Symbol.asyncDispose]: engine.unload
        }
    }

    private async initializeEngine(progresser?: (p: number, t: string) => void): Promise<MLCEngine> {
        const { CreateMLCEngine } = await import('@mlc-ai/web-llm')
        return CreateMLCEngine(this.model, {
            initProgressCallback: (progress) => {
                progresser?.(progress.progress, "正在下载AI模型到本地")
                console.log('初始化进度:', progress)
            }
        })
    }

}