import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
    url?: string
    tab?: string
    type?: chrome.windows.createTypeEnum
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, any> = async (req, res) => {
    const { url, tab, type } = req.body
    const result = await chrome.windows.create({
        url: tab ? chrome.runtime.getURL(`/tabs/${tab}.html`) : url,
        type: type ?? 'panel',
    })
    res.send(result)
}



export default handler