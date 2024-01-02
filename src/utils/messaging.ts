import { sendToBackground } from "@plasmohq/messaging"
import { getPort } from "@plasmohq/messaging/port"
import { type MessagingData, type Payload as MsgPayload, type Response as MsgResponse } from "~background/messages"
import type { Payload as PortPayload, Response as PortResponse, PortingData } from "~background/ports"
import type { BLiveDataWild } from "~types/bilibili"

const ID = 'bilibili-jimaku-filter'

export async function sendMessager<T extends keyof MessagingData>(name: T, body: MsgPayload<MessagingData[T]> = undefined, sender: chrome.runtime.MessageSender = undefined): Promise<MsgResponse<MessagingData[T]> | void> {
    return sendToBackground({ name, body }).then(res => res as MsgResponse<MessagingData[T]>)
}

export async function sendMessagerFromMain<T extends keyof MessagingData>(name: T, body: MsgPayload<MessagingData[T]> = undefined, extensionId: string = 'ooofiabfmndbfglabnjmnmpdmddehido'): Promise<MsgResponse<MessagingData[T]> | void> {
    return sendToBackground({ name, body, extensionId }).then(res => res as MsgResponse<MessagingData[T]>)
}

export async function sendPort<T extends keyof PortingData>(name: T, body: PortPayload<PortingData[T]> = undefined): Promise<PortResponse<PortingData[T]> | void> {
    return getPort(name).postMessage({ body })
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


export function addBLiveMessageCommandListener<K extends string>(command: K, callback: (command: BLiveDataWild<K>, event: MessageEvent) => void): VoidFunction {
    return addBLiveMessageListener<K>((data, event) => {
        if (data.cmd === command) {
            callback(data.command, event)
        }
    })
}

export function addBLiveMessageListener<K extends string>(callback: (data: { cmd: K, command: BLiveDataWild<K> }, event: MessageEvent) => void): VoidFunction {
    return addWindowMessageListener('blive-ws', (data: { cmd: K, command: BLiveDataWild<K>, eventId: string }, event) => {
        callback(data, event)
        delete data.command.dm_v2 // make sure edit is affected
        event.source.postMessage({ source: ID, data: { command: `ws:callback:${data.eventId}`, body: data } }, { targetOrigin: event.origin })
    })
}

export function sendWindowMessage(command: string, body: any) {
    window.postMessage({ source: ID, data: { command, body } }, '*')
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