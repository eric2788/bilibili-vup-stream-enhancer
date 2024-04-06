import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
    url?: string
    tab?: string
    active?: boolean
    params?: Record<string, string>
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, chrome.tabs.Tab> = async (req, res) => {
    const { url, tab, active } = req.body
    const queryString = req.body.params ? `?${new URLSearchParams(req.body.params).toString()}` : ''
    const result = await chrome.tabs.create({
        url: tab ?
            chrome.runtime.getURL(`/tabs/${tab}.html${queryString}`) :
            url + queryString,
        active
    })
    res.send(result)
}


export default handler