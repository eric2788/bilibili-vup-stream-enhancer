import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
    url?: string
    tab?: string
    active?: boolean
    params?: Record<string, string>
    singleton?: boolean
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, chrome.tabs.Tab> = async (req, res) => {
    const { url, tab, active } = req.body
    const queryString = req.body.params ? `?${new URLSearchParams(req.body.params).toString()}` : ''
    const fullUrl = tab ? chrome.runtime.getURL(`/tabs/${tab}.html${queryString}`) : url + queryString
    if (req.body.singleton) {
        const tabs = await chrome.tabs.query({ url: fullUrl })
        if (tabs.length) {
            const tab = tabs[0]
            await chrome.tabs.update(tab.id, { active: true })
            res.send(tab)
            return
        }
    }
    const result = await chrome.tabs.create({ url: fullUrl, active })
    res.send(result)
}


export default handler