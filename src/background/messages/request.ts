import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
    url: string,
    timer: number
}

const handler: PlasmoMessaging.MessageHandler<RequestBody> = async (req, r) => {
    const { url, timer = 15000 } = req.body
    const aborter = new AbortController()
    const timeout = setTimeout(() => aborter.abort(), timer)
    const res = await fetch(url, { signal: aborter.signal })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`${res.statusText}(${res.status})`)
    const json = await res.json()
    r.send(json)
}

export default handler