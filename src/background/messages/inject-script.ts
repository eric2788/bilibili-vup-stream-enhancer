import type { PlasmoMessaging } from "@plasmohq/messaging";
import { dispatchFuncEvent } from "~utils/event";

export type RequestBody = {
    fileUrl?: string
    func?: string
    args?: any[]
}

export type ResponseBody = chrome.scripting.InjectionResult<any>[]

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {

    const { fileUrl, func: funcName, args: funcArgs } = req.body

    let result: chrome.scripting.InjectionResult<any>[] = []

    if (!fileUrl && !funcName) {
        console.warn('no fileUrl or funcName provided in inject-script handler.')
    }

    if (fileUrl) {
        const file = fileUrl.split("/").pop().split("?")[0]
        console.info('injecting file: ', file)
        result = await chrome.scripting.executeScript({
            target: { tabId: req.sender.tab.id },
            injectImmediately: true,
            world: 'MAIN',
            files: [file],
        })
    }

    if (funcName) {

        console.info('injecting function: ', funcName)
        result = await chrome.scripting.executeScript({
            target: { tabId: req.sender.tab.id },
            injectImmediately: true,
            world: 'MAIN',
            func: dispatchFuncEvent,
            args: [funcName, ...(funcArgs ?? [])],
        })

    }

    res.send(result)
}


export default handler