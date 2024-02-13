import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getScriptUrl, type InjectableScript } from '~background/scripts'
import { dispatchFuncEvent, type FuncEventResult, isFuncEventResult } from '~utils/event'
import { getResourceName } from '~utils/file'

export type RequestBody = {
    target?: chrome.scripting.InjectionTarget
    fileUrl?: string
    func?: string
    args?: any[]
} & {
    script?: InjectableScript<any>
}

export type ResponseBody = FuncEventResult & { result?: any }

// the chrome.runtime undefined error will only throw on development at once
const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {


    const target = req.body.target ?? { tabId: req.sender.tab.id }

    const fileUrl: string = req.body.script ? getScriptUrl(req.body.script) : req.body.fileUrl
    const funcName: string = req.body.script?.name ?? req.body.func
    const funcArgs: any[] = req.body.script?.args ?? req.body.args

    if (!fileUrl && !funcName) {
        throw new Error('no fileUrl or funcName provided in inject-script handler.')
    }

    const results: chrome.scripting.InjectionResult<any>[] = []

    if (fileUrl) {
        const file = getResourceName(fileUrl)
        console.info('injecting file: ', file)
        results.push(...await chrome.scripting.executeScript({
            target: target,
            injectImmediately: true,
            world: 'MAIN',
            files: [file],
        }))
    }

    if (funcName) {
        console.info('injecting function: ', funcName)
        console.info('injecting function args: ', funcArgs)
        results.push(...await chrome.scripting.executeScript({
            target: target,
            injectImmediately: true,
            world: 'MAIN',
            func: dispatchFuncEvent,
            args: [funcName, ...(funcArgs ?? [])],
        }))
    }

    const finalResults = []
    for (const result of results) {
        // if invoking function, always return function result
        if (isFuncEventResult(result.result)) {
            if (result.result.error) {
                return res.send({ success: false, error: result.result.error })
            }
            return res.send({ success: true })
        }

        // if injecting file, return the result of the last script
        if (result.result) {
            finalResults.push(result.result)
        }
    }

    return res.send({ success: true, result: finalResults })
}


export default handler