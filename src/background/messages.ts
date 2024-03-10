import * as addBlackList from './messages/add-black-list'
import * as checkUpdate from './messages/check-update'
import * as clearTable from './messages/clear-table'
import * as fetchDeveloper from './messages/fetch-developer'
import * as getStreamUrls from './messages/get-stream-urls'
import * as hookAdapter from './messages/hook-adapter'
import * as injectFunc from './messages/inject-func'
import * as injectScript from './messages/inject-script'
import * as notify from './messages/notify'
import * as openTab from './messages/open-tab'
import * as openWindow from './messages/open-window'
import * as request from './messages/request'
import * as migrationMv2 from './messages/migration-mv2'

import type { PlasmoMessaging } from "@plasmohq/messaging"
import { isBackgroundScript } from '~utils/file'
import { sendMessager } from '~utils/messaging'

export type MessagingData = typeof messagers

interface MessageData<T extends object, R = any> {
    default: PlasmoMessaging.MessageHandler<T, R>
}

export type Payload<T> = T extends MessageData<infer U> ? U : never

export type Response<T> = T extends MessageData<any, infer U> ? U : void

// only use this function in background script
// or not it will generate adapter files twice!
// if not background script, use sendMessager instead
export async function sendInternal<K extends keyof MessagingData, R = Response<MessagingData[K]>>(name: K, body: Payload<MessagingData[K]> = undefined, sender: chrome.runtime.MessageSender = undefined): Promise<R> {
    // if not background script, send to background script
    if (!isBackgroundScript()) {
        return sendMessager(name, body, sender)
    }
    const { default: messager } = messagers[name]
    const handler = messager as PlasmoMessaging.MessageHandler<Payload<MessagingData[K]>, R>
    const res = await new Promise<R | void>((resolve, reject) => {
        const response: PlasmoMessaging.Response<R> = {
            send: (responseBody) => {
                resolve(responseBody)
            }
        }
        try {
            const o = handler({ name, body, sender }, response)
            if (o instanceof Promise) {
                o.then(resolve).catch(reject)
            } else {
                resolve()
            }
        } catch (err: Error | any) {
            reject(err)
        }
    })
    // if res is void
    if (!res) return undefined
    return res as R
}

const messagers = {
    'notify': notify,
    'open-tab': openTab,
    'request': request,
    'get-stream-urls': getStreamUrls,
    'check-update': checkUpdate,
    'fetch-developer': fetchDeveloper,
    'open-window': openWindow,
    'clear-table': clearTable,
    'inject-func': injectFunc,
    'inject-script': injectScript,
    'add-black-list': addBlackList,
    'hook-adapter': hookAdapter,
    'migration-mv2': migrationMv2
}