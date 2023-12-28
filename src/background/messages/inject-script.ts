import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { InjectableScript } from "~background/scripts";
import { dispatchFuncEvent } from "~utils/event";
import { getResourceName } from "~utils/file";

export type RequestBody = {
    fileUrl?: string
    func?: string
    args?: any[]
} & {
    script?: InjectableScript<any>
}

export type ResponseBody = chrome.scripting.InjectionResult<any>[]

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {

    let result: chrome.scripting.InjectionResult<any>[] = []
    const fileUrl: string = req.body.script?.url ?? req.body.fileUrl
    const funcName: string = req.body.script?.name ?? req.body.func
    const funcArgs: any[] = req.body.script?.args ?? req.body.args

    if (!fileUrl && !funcName) {
        throw new Error('no fileUrl or funcName provided in inject-script handler.')
    }
    

    if (fileUrl) {
        const file = getResourceName(fileUrl)
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