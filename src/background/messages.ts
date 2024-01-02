import type { PlasmoMessaging } from "@plasmohq/messaging";
// follow from ./messages/*.ts
import * as notify from "./messages/notify";
import * as openTab from "./messages/open-tab";
import * as request from "./messages/request";
import * as getStreamUrls from "./messages/get-stream-urls";
import * as checkUpdate from "./messages/check-update";

export interface MessagingData {
    'notify': notify.RequestBody
    'open-tab': openTab.RequestBody
    'request': request.RequestBody
    'get-stream-urls': getStreamUrls.RequestBody
    'check-update': checkUpdate.RequestBody
}


const handlers: {
    [key in keyof MessagingData]: PlasmoMessaging.MessageHandler<MessagingData[key], any>
} = {
    'notify': notify.default,
    'open-tab': openTab.default,
    'request': request.default,
    'get-stream-urls': getStreamUrls.default,
    'check-update': checkUpdate.default
}


export async function sendInternal<K extends keyof MessagingData, R = any>(name: K, body: MessagingData[K]): Promise<R> {
    const handler: PlasmoMessaging.MessageHandler<MessagingData[K], any> = handlers[name]
    return new Promise((resolve, reject) => {
        const response: PlasmoMessaging.Response<R> = {
            send: (responseBody) => {
                console.log(`Response from ${name}:`, responseBody);
                resolve(responseBody)
            }
        };
        try {
            const o = handler({ name, body }, response)
            if (o instanceof Promise) {
                o.catch(reject)
            }
        } catch (err: Error | any) {
            reject(err)
        }
    })
}