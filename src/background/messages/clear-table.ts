import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { Table } from "dexie";
import { sendInternal } from "~background/messages";
import db, { type CommonSchema, type TableType } from "~database";
import { getAllTables } from "~utils/database";

export type RequestBody = {
    table: TableType | 'all'
    room?: string
}


export type ResponseBody = {
    result: 'success' | 'fail' | 'tab-not-closed',
    error?: Error
}

async function clearTable(info: RequestBody) {
    const tables: Table<CommonSchema, number>[] = []
    if (info.table === 'all') {
        tables.push(...getAllTables())
    } else {
        tables.push(db[info.table])
    }
    if (info.room) {
        await Promise.all(tables.map(table => table.where({ room: info.room }).delete()))
    } else {
        await Promise.all(tables.map(table => table.clear()))
    }
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {
    try {
        const tabs = await chrome.tabs.query({ url: '*://live.bilibili.com/*' })
        if (tabs.length > 0) {
            res.send({ result: 'tab-not-closed'})
            return
        }
        const tab = await chrome.tabs.create({
            active: false,
            url: 'https://live.bilibili.com'
        })
        await sendInternal('inject-js', {
            target: { tabId: tab.id },
            func: clearTable,
            args: [req.body]
        })
        await chrome.tabs.remove(tab.id)
        res.send({result: 'success'})
    } catch (err: Error | any) {
        console.error(err)
        res.send({result: 'fail', error: err})
    }
}


export default handler