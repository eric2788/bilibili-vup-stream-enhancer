import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
    url?: string
    tab?: string
    type?: chrome.windows.createTypeEnum,
    width?: number
    height?: number
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, any> = async (req, res) => {
    const { url, tab, type } = req.body
    const result = await chrome.windows.create({
        url: tab ? chrome.runtime.getURL(`/tabs/${tab}.html`) : url,
        type: type ?? 'popup',
        width: req.body.width,
        height: req.body.height
    })
    res.send(result)
}



export default handler