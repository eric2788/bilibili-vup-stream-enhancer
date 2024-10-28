import type { PlasmoMessaging } from "@plasmohq/messaging"

/**
 * Represents the body of a request to open a new tab.
 * 
 * @example
 * // Example of a request body to open a new tab with a specific URL
 * const requestBody: RequestBody = {
 *     url: "https://example.com",
 *     active: true
 * };
 * 
 * @example
 * // Example of a request body with additional parameters and singleton criteria
 * const requestBody: RequestBody = {
 *     url: "https://example.com",
 *     params: { ref: "newsletter" },
 *     singleton: ["ref"]
 * };
 */
export type RequestBody = {
    /**
     * The URL to open in the new tab.
     */
    url?: string
    /**
     * The identifier of the tab to open.
     */
    tab?: string
    /**
     * Whether the new tab should be active.
     */
    active?: boolean
    /**
     * Additional parameters to include in the request.
     */
    params?: Record<string, string>
    /**
     * Indicates if the tab should be a singleton. 
     * If an array of strings is provided, it represents 
     * only check the equality of those query params.
     */
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