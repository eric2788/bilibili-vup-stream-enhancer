import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
    url?: string
    tab?: string
    active?: boolean
    params?: Record<string, string>
    singleton?: boolean | string[]
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, chrome.tabs.Tab> = async (req, res) => {
    const { url, tab, active } = req.body
    const queryString = req.body.params ? `?${new URLSearchParams(req.body.params).toString()}` : ''
    const fullUrl = tab ? chrome.runtime.getURL(`/tabs/${tab}.html${queryString}`) : url + queryString
    const pathUrl = (tab ? chrome.runtime.getURL(`/tabs/${tab}.html`) : url) + '*'
    if (req.body.singleton) {
        const tabs = await chrome.tabs.query({ url: typeof req.body.singleton === 'boolean' ? fullUrl : pathUrl })
        const tab = tabs.find(tab =>
            typeof req.body.singleton === 'boolean' ||
            req.body.singleton.some(param => new URL(tab.url).searchParams.get(param) === req.body.params[param])
        )
        if (tab) {
            res.send(await chrome.tabs.update(tab.id, { active: true }))
            return
        }
    }
    res.send(await chrome.tabs.create({ url: fullUrl, active }))
}


export default handler