import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
    url?: string
    tab?: string
}

const handler: PlasmoMessaging.MessageHandler<RequestBody> = async (req, res) => {
    const { url, tab } = req.body
    const result = await chrome.tabs.create({ url: tab ? `../tabs/${tab}.html` : url })
    res.send(result)
}


export default handler