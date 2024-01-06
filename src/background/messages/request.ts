import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
    url: RequestInfo
    options?: RequestInit
    timeout?: number
}


export type ResponseBody = {
    error?: string
    data?: any
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, r) => {
    try {
        const { url, timeout: timer = 15000, options = {} } = req.body
        const aborter = new AbortController()
        const timeout = setTimeout(() => aborter.abort(), timer)
        const res = await fetch(url, { signal: aborter.signal, ...options })
        clearTimeout(timeout)
        if (!res.ok) throw new Error(`${res.statusText}(${res.status})`)
        const json = await res.json()
        r.send({
            error: null,
            data: json
        })
    } catch (err: Error | any) {
        r.send({
            error: err.message,
            data: null
        })
    }
}

export default handler