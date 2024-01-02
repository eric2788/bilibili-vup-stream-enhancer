import type { PlasmoMessaging } from "@plasmohq/messaging";

export type RequestBody = Partial<chrome.scripting.ScriptInjection<any[], any>>

export type ResponseBody = chrome.scripting.InjectionResult<any>[]

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {

    const injectedInfo: RequestBody = {
        ...{
            target: { tabId: req.sender.tab.id },
            injectImmediately: true,
            world: 'MAIN',
        },
        ...req.body
    }

    const injectResult = await chrome.scripting.executeScript(injectedInfo as chrome.scripting.ScriptInjection<any[], any>)
    res.send(injectResult)
}


export default handler