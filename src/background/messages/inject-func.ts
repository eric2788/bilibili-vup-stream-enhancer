import type { PlasmoMessaging } from "@plasmohq/messaging"
import type { InjectableFunction } from "~background/functions"
import functions from '~background/functions'

export type RequestBody = Omit<Partial<chrome.scripting.ScriptInjection<any[], any>>, 'func' | 'args'> & {
    function: InjectableFunction<any>
}

export type ResponseBody = chrome.scripting.InjectionResult<any>[]

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {

    const { function: { name, args }, ...rest } = req.body

    const injectedInfo: chrome.scripting.ScriptInjection<any[], any> = {
        ...{
            target: { tabId: req.sender.tab.id },
            injectImmediately: true,
            world: 'MAIN',
        },
        ...rest,
        func: functions[name],
        args,
    }

    const injectResult = await chrome.scripting.executeScript(injectedInfo)
    res.send(injectResult)
}


export default handler