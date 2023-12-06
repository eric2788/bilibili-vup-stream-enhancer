import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
    url: string | undefined
    tab: string | undefined
}

const handler: PlasmoMessaging.MessageHandler<RequestBody> = async (req, res) => {
    const { url, tab } = req.body
    chrome.tabs.create({ url: tab ? `../tabs/${tab}.html` : url })
}


export default handler