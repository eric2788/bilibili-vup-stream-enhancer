import type { LLMProviders, Session } from "~llms";


// for my worker, so limited usage
export default class RemoteWorker implements LLMProviders {

    async validate(): Promise<void> {
        const res = await fetch('https://llm.ericlamm.xyz/status')
        const json = await res.json()
        if (json.status !== 'working') {
            throw new Error('Remote worker is not working')
        }
    }

    async prompt(chat: string): Promise<string> {
        const res = await fetch('https://llm.ericlamm.xyz/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: chat })
        })
        const json = await res.json()
        return json.response
    }

    async *promptStream(chat: string): AsyncGenerator<string> {
        const res = await fetch('https://llm.ericlamm.xyz/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: chat, stream: true })
        })
        if (!res.body) throw new Error('Remote worker response body is not readable')
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
        console.warn('Remote worker session is not supported')
        return {
            ...this,
            [Symbol.dispose]: () => { }
        }
    }
    
}