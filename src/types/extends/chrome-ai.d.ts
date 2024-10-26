/**
 * DEPRECATED! PLEASE USE https://www.npmjs.com/package/@types/dom-chromium-ai
 */


/**
 * See https://github.com/explainers-by-googlers/writing-assistance-apis
 * and https://github.com/explainers-by-googlers/prompt-api
 */
declare global {
	interface AI {
		assistant: AIAssistantFactory;
		languageModel: AIAssistantFactory; // some old versions of chrome use this name
		summarizer: AISummarizerFactory;
		writer: AIWriterFactory;
		rewriter: AIRewriterFactory;
	}

	interface AIAssistantFactory {
		create( options?: AIAssistantCreateOptions ): Promise< AIAssistant >;
		capabilities(): Promise< AIAssistantCapabilities >;
	}

	interface AIAssistantCapabilities {
		available: AICapabilityAvailability;
		defaultTopK?: number | null;
		maxTopK?: number | null;
		defaultTemperature?:
			| 0.1
			| 0.2
			| 0.3
			| 0.4
			| 0.5
			| 0.6
			| 0.7
			| 0.8
			| 0.9
			| 1.0
			| null;
		supportsLanguage( languageTag: string ): AICapabilityAvailability;
	}

	interface AIAssistant {
		prompt(
			input: string,
			options?: AIAssistantPromptOptions
		): Promise< string >;
		promptStreaming(
			input: string,
			options?: AIAssistantPromptOptions
		): AIReadableStream;
		countPromptTokens(
			input: string,
			options?: AIAssistantPromptOptions
		): number;
		destroy(): void;
		clone(): AIAssistant;
	}

	interface AISummarizerFactory {
		create( options?: AISummarizerCreateOptions ): Promise< AISummarizer >;
		capabilities(): Promise< AISummarizerCapabilities >;
	}

	interface AISummarizerCapabilities {
		available: AICapabilityAvailability;
		supportsType( tone: AISummarizerType ): AICapabilityAvailability;
		supportsFormat( format: AISummarizerFormat ): AICapabilityAvailability;
		supportsLength( length: AISummarizerLength ): AICapabilityAvailability;
		supportsInputLanguage( languageTag: string ): AICapabilityAvailability;
	}

	interface AISummarizerCreateOptions {
		signal?: AbortSignal;
		monitor?: AICreateMonitorCallback;
		sharedContext?: string;
		type?: AISummarizerType; // Default is 'key-points'.
		format?: AISummarizerFormat; // Default is 'markdown'.
		length?: AISummarizerLength; // Default is 'short'.
	}

	type AISummarizerType = 'tl;dr' | 'key-points' | 'teaser' | 'headline';
	type AISummarizerFormat = 'plain-text' | 'markdown';
	type AISummarizerLength = 'short' | 'medium' | 'long';

	interface AISummarizerSummarizeOptions {
		signal?: AbortSignal;
		context?: string;
	}

	interface AISummarizer extends EventTarget {
		ready: Promise< undefined >;
		summarize(
			input: string,
			options?: AISummarizerSummarizeOptions
		): Promise< string >;
		summarizeStreaming(
			input: string,
			options?: AISummarizerSummarizeOptions
		): AIReadableStream;
        destroy(): void;
	}

	interface AIWriterFactory {
		create( options?: AIWriterCreateOptions ): Promise< AIWriter >;
		capabilities(): Promise< AIWriterCapabilities >;
	}

	interface AIWriterCapabilities {
		available: AICapabilityAvailability;
		supportsTone( tone: AIWriterTone ): AICapabilityAvailability;
		supportsFormat( format: AIWriterFormat ): AICapabilityAvailability;
		supportsLength( length: AIWriterLength ): AICapabilityAvailability;
		supportsInputLanguage( languageTag: string ): AICapabilityAvailability;
	}

	interface AIWriterCreateOptions {
		signal?: AbortSignal;
		monitor?: AICreateMonitorCallback;
		sharedContext?: string;
		tone?: AIWriterTone; // Default is 'key-points'.
		format?: AIWriterFormat; // Default is 'markdown'.
		length?: AIWriterLength; // Default is 'short'.
	}

	// TODO: What about 'key-points'? File issue.
	type AIWriterTone = 'formal' | 'neutral' | 'casual';
	type AIWriterFormat = 'plain-text' | 'markdown';
	type AIWriterLength = 'short' | 'medium' | 'long';

	interface AIWriterWriteOptions {
		signal?: AbortSignal;
		context?: string;
	}

	interface AIWriter {
		write(
			writingTask: string,
			options?: AIWriterWriteOptions
		): Promise< string >;
		writeStreaming(
			writingTask: string,
			options?: AIWriterWriteOptions
		): AIReadableStream;
		tone: AIWriterTone;
		format: AIWriterFormat;
		length: AIWriterLength;
		destroy(): void;
	}

	interface AIRewriterFactory {
		create( options?: AIRewriterCreateOptions ): Promise< AIRewriter >;
		capabilities(): Promise< AIRewriterCapabilities >;
	}

	interface AIRewriterCapabilities {
		available: AICapabilityAvailability;
		supportsTone( tone: AIRewriterTone ): AICapabilityAvailability;
		supportsFormat( format: AIRewriterFormat ): AICapabilityAvailability;
		supportsLength( length: AIRewriterLength ): AICapabilityAvailability;
		supportsInputLanguage( languageTag: string ): AICapabilityAvailability;
	}

	interface AIRewriterCreateOptions {
		signal?: AbortSignal;
		monitor?: AICreateMonitorCallback;
		sharedContext?: string;
		tone?: AIRewriterTone; // Default is 'as-is'.
		format?: AIRewriterFormat; // Default is 'as-is'.
		length?: AIRewriterLength; // Default is 'as-is'.
	}

	type AIRewriterTone = 'as-is' | 'more-formal' | 'more-casual';
	type AIRewriterFormat = 'as-is' | 'plain-text' | 'markdown';
	type AIRewriterLength = 'as-is' | 'shorter' | 'longer';

	interface AIRewriterRewriteOptions {
		signal?: AbortSignal;
		context?: string;
	}

	interface AIRewriter {
		rewrite(
			writingTask: string,
			options?: AIRewriterRewriteOptions
		): Promise< string >;
		rewriteStreaming(
			writingTask: string,
			options?: AIRewriterRewriteOptions
		): AIReadableStream;
		tone: AIRewriterTone;
		format: AIRewriterFormat;
		length: AIRewriterLength;
		destroy(): void;
	}

	type AICapabilityAvailability = 'readily' | 'after-download' | 'no';

	interface InitialPrompt {
		role: string;
		content: string;
	}

	interface AssistantPrompt extends InitialPrompt {
		role: 'assistant';
		content: string;
	}

	interface UserPrompt extends InitialPrompt {
		role: 'user';
		content: string;
	}

	interface SystemPrompt extends InitialPrompt {
		role: 'system';
	}

	interface AIAssistantCreateOptions {
		temperature?: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;
		topK?: number;
		systemPrompt?: string;
		initialPrompts?: [
			SystemPrompt,
			...Array< UserPrompt | AssistantPrompt >,
		];
		signal?: AbortSignal;
		monitor?: AICreateMonitorCallback;
	}

	interface AIAssistantPromptOptions {
		signal?: AbortSignal;
	}

	interface AICreateMonitor extends EventTarget {}

	type AICreateMonitorCallback = ( monitor: AICreateMonitor ) => void;

	interface WindowOrWorkerGlobalScope {
		ai: AI;
	}

	interface AIReadableStream {
		[Symbol.asyncIterator](): AsyncIterableIterator< string >;
	}
}

export type {};