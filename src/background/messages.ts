import type { PlasmoMessaging } from "@plasmohq/messaging"
// follow from ./messages/*.ts
import * as checkUpdate from "./messages/check-update"
import * as clearTable from './messages/clear-table'
import * as fetchDeveloper from "./messages/fetch-developer"
import * as getStreamUrls from "./messages/get-stream-urls"
import * as injectJs from './messages/inject-js'
import * as notify from "./messages/notify"
import * as openTab from "./messages/open-tab"
import * as openWindow from './messages/open-window'
import * as request from "./messages/request"

export type MessagingData = typeof messagers

interface MessageData<T extends object, R = any> {
    default: PlasmoMessaging.MessageHandler<T, R>
}

export type Payload<T> = T extends MessageData<infer U> ? U : never

export type Response<T> = T extends MessageData<any, infer U> ? U : void;

export async function sendInternal<K extends keyof MessagingData, R = Response<MessagingData[K]>>(name: K, body: Payload<MessagingData[K]> = undefined, sender: chrome.runtime.MessageSender = undefined): Promise<R | void> {
    const { default: messager } = messagers[name]
    const handler = messager as PlasmoMessaging.MessageHandler<Payload<MessagingData[K]>, R>
    return new Promise((resolve, reject) => {
        const response: PlasmoMessaging.Response<R> = {
            send: (responseBody) => {
                resolve(responseBody)
            }
        };
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
    'inject-js': injectJs
}