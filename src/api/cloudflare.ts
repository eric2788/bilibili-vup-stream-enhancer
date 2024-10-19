import type { AIResponse, Result } from "~types/cloudflare";

const BASE_URL = 'https://api.cloudflare.com/client/v4'

export async function runAI(data: any, { token, account, model }: { token: string, account: string, model: string }): Promise<Result<AIResponse>> {
    const res = await fetch(`${BASE_URL}/accounts/${account}/ai/run/${model}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...data, stream: false })
    })
    return await res.json()
}

export async function *runAIStream(data: any, { token, account, model }: { token: string, account: string, model: string }): AsyncGenerator<string> {
    const res = await fetch(`${BASE_URL}/accounts/${account}/ai/run/${model}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...data, stream: true })
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

export async function validateAIToken(accountId: string, token: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/accounts/${accountId}/ai/models/search?per_page=1`, {
        headers: {
            Authorization: `Bearer ${this.apiToken}`
        }
    })
    const data = await res.json() as Result<any>
    return data.success
}