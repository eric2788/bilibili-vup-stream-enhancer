import type {
    MessagingData,
    Payload as MsgPayload,
    Response as MsgResponse
} from '~background/messages'

import type { BLiveDataWild } from "~types/bilibili"
import { sendToBackground } from '@plasmohq/messaging'

export const ID = 'bilibili-jimaku-filter'

export async function sendMessager<T extends keyof MessagingData>(name: T, body: MsgPayload<MessagingData[T]> = undefined, sender: chrome.runtime.MessageSender = undefined): Promise<MsgResponse<MessagingData[T]>> {
    return sendToBackground({ name, body }).then(res => res as MsgResponse<MessagingData[T]>)
}

export async function sendMessagerFromMain<T extends keyof MessagingData>(name: T, body: MsgPayload<MessagingData[T]> = undefined, extensionId: string = 'ooofiabfmndbfglabnjmnmpdmddehido'): Promise<MsgResponse<MessagingData[T]>> {
    return sendToBackground({ name, body, extensionId }).then(res => res as MsgResponse<MessagingData[T]>)
}

export function addWindowMessageListener(command: string, callback: (data: any, event: MessageEvent) => void, signal?: AbortSignal): VoidFunction {
    const listener = (e: MessageEvent) => {
        if (e.source !== window) return
        if (e.data.source === ID && e.data.data.command === command) {
            const content = e.data.data.body
            callback(content, e)
        }
    }
    window.addEventListener('message', listener, { capture: false, signal })
    return () => window.removeEventListener('message', listener)
}


export function sendWindowMessage(command: string, body: any) {
    window.postMessage({ source: ID, data: { command, body } }, '*')
}


// no callback only listen
export function addBLiveMessageListener<K extends string>(callback: (data: { cmd: K, command: BLiveDataWild<K> }, event: MessageEvent) => void): VoidFunction {
    return addWindowMessageListener('blive-ws', callback)
}


export function addBLiveMessageCommandListener<K extends string>(cmd: K, callback: (data: BLiveDataWild<K>, event: MessageEvent) => void): VoidFunction {
    return addBLiveMessageListener((data, event) => {
        if (data.cmd === cmd) {
            callback(data.command, event)
        }
    })
}

export function sendBLiveMessage<K extends string>(cmd: K, command: BLiveDataWild<K>, signal?: AbortSignal): Promise<BLiveDataWild<K>> {
    const eventId = window.crypto.randomUUID()
    return new Promise((res, rej) => {
        const removeListener = addWindowMessageListener(`ws:callback:${eventId}`, (data: { cmd: K, command: BLiveDataWild<K> }, event) => {
            if (event.origin !== window.location.origin) {
                return
            }
            removeListener()
            res(data.command)
        }, signal)
        setTimeout(() => {
            removeListener()
            rej('事件處理已逾時')
        }, 500)
        sendWindowMessage('blive-ws', { cmd, command, eventId })
    })
}