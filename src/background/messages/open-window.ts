import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = chrome.windows.CreateData & {
    tab?: string
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, any> = async (req, res) => {
    const { url, tab, type } = req.body
    const result = await chrome.windows.create({
        type: 'popup',
        focused: true,
        ...req.body,
        url: tab ? chrome.runtime.getURL(`/tabs/${tab}.html`) : url,
    })
    res.send(result)
}



export default handler