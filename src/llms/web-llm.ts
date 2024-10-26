import type { MLCEngine } from "@mlc-ai/web-llm";
import type { LLMEvent, LLMProviders, Session } from "~llms";
import type { SettingSchema } from "~options/fragments/llm";

export default class WebLLM implements LLMProviders {

    private static readonly DEFAULT_MODEL: string = 'Qwen2-7B-Instruct-q4f32_1-MLC'

    private readonly model: string
    private onprogress?: LLMEvent['progress']

    constructor(settings: SettingSchema) {
        this.model = settings.model || WebLLM.DEFAULT_MODEL
    }
    on<E extends keyof LLMEvent>(event: E, listener: LLMEvent[E]): void {
        if (event === 'progress') {
            this.onprogress = listener
        }
    }

    cumulative: boolean = true

    async validate(): Promise<void> {
        await this.initializeEngine(this.onprogress)
    }

    async prompt(chat: string): Promise<string> {
        const session = await this.asSession()
        console.debug('[web-llm] prompting: ', chat)
        return session.prompt(chat)
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        const session = await this.asSession()
        console.debug('[web-llm] prompting stream: ', chat)
        const res = session.promptStream(chat)
        for await (const chunk of res) {
            yield chunk
        }
    }

    async asSession(): Promise<Session<LLMProviders>> {
        const engine = await this.initializeEngine(this.onprogress)
        return {
            async prompt(chat: string) {
                await engine.interruptGenerate()
                const c = await engine.completions.create({
                    prompt: chat,
                    max_tokens: 128,
                    temperature: 0.2,
                })
                return c.choices[0]?.text ?? engine.getMessage()
            },
            async *promptStream(chat: string): AsyncGenerator<string> {
                await engine.interruptGenerate()
                const chunks = await engine.completions.create({
                    prompt: chat,
                    max_tokens: 128,
                    temperature: 0.2,
                    stream: true
                })
                console.log('Chunks:', chunks)
                for await (const chunk of chunks) {
                    console.log('Chunk:', chunk)
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
                progresser?.(progress.progress, progress.text)
                console.log('初始化进度:', progress)
            }
        })
    }

}