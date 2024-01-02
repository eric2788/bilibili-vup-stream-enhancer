import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
    url: RequestInfo
    options?: RequestInit
    timer?: number
}

const handler: PlasmoMessaging.MessageHandler<RequestBody> = async (req, r) => {
    const { url, timer = 15000, options = {} } = req.body
    const aborter = new AbortController()
    const timeout = setTimeout(() => aborter.abort(), timer)
    const res = await fetch(url, { signal: aborter.signal, ...options })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`${res.statusText}(${res.status})`)
    const json = await res.json()
    r.send(json)
}

export default handler