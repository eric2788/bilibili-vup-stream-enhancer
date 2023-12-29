import type { PlasmoMessaging } from "@plasmohq/messaging";
import { sendInternal } from "~background/messages";
import { type TableType } from "~database";
import { injectScript } from "~utils/inject";

export type RequestBody = {
    table: TableType | 'all'
    room?: string
}

export type ResponseBody = {
    result: 'success' | 'fail' | 'tab-not-closed',
    error?: Error
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {
    try {
        const tabs = await chrome.tabs.query({ url: '*://live.bilibili.com/*' })
        if (tabs.length > 0) {
            res.send({ result: 'tab-not-closed', error: new Error('检测到你有直播房间分页未关闭，请先关闭所有直播房间分页') })
            return
        }
        const tab = await chrome.tabs.create({
            active: false,
            url: 'https://live.bilibili.com'
        })
        await sendInternal('inject-script', {
            script: injectScript('clearIndexedDbTable', req.body.table, req.body.room)
        })
        await chrome.tabs.remove(tab.id)
        res.send({ result: 'success' })
    } catch (err: Error | any) {
        console.error(err)
        res.send({ result: 'fail', error: err })
    }
}


export default handler