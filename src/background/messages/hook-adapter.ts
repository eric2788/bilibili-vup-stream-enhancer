import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { AdapterType } from "~adapters";
import { adapters } from "~adapters";

export type RequestBody = {
    type?: AdapterType
    command: 'hook' | 'unhook'
}


const handler: PlasmoMessaging.MessageHandler<RequestBody> = async (req, res) => {

    const { type, command } = req.body

    const file = adapters[type].split("/").pop().split("?")[0]
    console.info('injecting file: ', file)

    chrome.scripting.executeScript({
        target: { tabId: req.sender.tab.id },
        injectImmediately: true,
        world: 'MAIN',
        files: [file],
    })

    res.send('ok')
}


export default handler