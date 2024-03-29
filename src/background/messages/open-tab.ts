import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
    url?: string
    tab?: string
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, chrome.tabs.Tab> = async (req, res) => {
    const { url, tab } = req.body
    const result = await chrome.tabs.create({ url: tab ? chrome.runtime.getURL(`/tabs/${tab}.html`) : url })
    res.send(result)
}


export default handler