import OpenAI from "openai";
import type { LLMEvent, LLMProviders, Session } from "~llms";
import type { SettingSchema } from "~options/fragments/llm";

export default class OpenAICompatible implements LLMProviders {
  cumulative: boolean = true;

  private readonly client: OpenAI;
  private readonly model: string;

  constructor(settings: SettingSchema) {
    this.model = settings.model || "gpt-3.5-turbo"; // Default model
    this.client = new OpenAI({
      baseURL: settings.openai_baseUrl,
      apiKey: settings.openai_apiKey || '',
      dangerouslyAllowBrowser: true // Allow browser usage
    });
  }

  on<E extends keyof LLMEvent>(event: E, listener: LLMEvent[E]): void {}

  async validate(): Promise<void> {
    let models: string[];
    try {
      models = await this.models();
    } catch (err: any) {
      throw new Error(`Failed to fetch models from OpenAI API: ${err?.message || err}`);
    }
    if (models.length === 0) {
      throw new Error("No models available in OpenAI API. The API key may be invalid, or there may be a network/authentication issue.");
    }
  }

  async prompt(chat: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: chat }],
      temperature: 0.2
    });
    if (!response.choices || response.choices.length === 0) {
      throw new Error("No response from OpenAI API");
    }
    return response.choices[0].message.content ?? "";
  }

  async *promptStream(chat: string): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: chat }],
      temperature: 0.2,
      stream: true
    });
    for await (const part of stream) {
      if (part.choices && part.choices.length > 0) {
        yield part.choices[0].delta.content || "";
      }
    }
  }

  async models(): Promise<string[]> {
    const models = await this.client.models.list();
    return models.data.map((model) => model.id);
  }

  async asSession(): Promise<Session<LLMProviders>> {
    console.warn("OpenAI session is not supported");
    return {
      ...this,
      [Symbol.asyncDispose]: async () => {}
    };
  }

}
