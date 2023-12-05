import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req, _) => {
    const { url, timer = 15000 } = req.body;
    const aborter = new AbortController()
    const timeout = setTimeout(() => aborter.abort(), timer)
    const res = await fetch(url, { signal: aborter.signal })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`${res.statusText}(${res.status})`)
    const json = await res.json()
    return json
}

export default handler;