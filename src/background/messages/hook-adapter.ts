import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { AdapterType } from "~adapters";
import { adapters } from "~adapters";
import { sendInternal } from "~background/messages";
import type { Settings } from "~settings";
import { getResourceName } from "~utils/file";


export type AdaptOperation = 'hook' | 'unhook'

type HookBody = {
    command: 'hook'
    type: AdapterType
    settings: Settings
};

type OtherBody = {
    command: AdaptOperation
};

export type RequestBody = HookBody | OtherBody

export type ResponseBody = chrome.scripting.InjectionResult<any>[]

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {

    const { command } = req.body

    let result: chrome.scripting.InjectionResult<any>[] = []

    if (command === 'hook') {
        const { type, settings } = req.body as HookBody
        const file = getResourceName(adapters[type])
        console.info('injecting adapter: ', file)
        const res = await sendInternal('inject-script', {
            fileUrl: adapters[type],
            func: command,
            args: [settings]
        }, req.sender)
        if (res) {
            result = res
        }
    } else {
        console.info('unhooking adapter')
        const res = await sendInternal('inject-script', {
            func: command,
        }, req.sender)
        if (res) {
            result = res
        }
    }

    res.send(result)
}


export default handler