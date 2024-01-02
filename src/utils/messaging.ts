import { sendToBackground } from "@plasmohq/messaging"
import { getPort } from "@plasmohq/messaging/port"
import { type MessagingData, type Payload as MsgPayload, type Response as MsgResponse } from "~background/messages"
import type { Payload as PortPayload, Response as PortResponse, PortingData } from "~background/ports"

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

export function addWindowMessageListener(command: string, callback: (data: object, event: MessageEvent) => void): VoidFunction {
    const listener = (e: MessageEvent) => {
        if (e.source !== window) return
        if (e.data.source === ID && e.data.data.command === command) {
            const content = e.data.data.body
            callback(content, e)
            e.source.postMessage({ source: ID, data: { command, body: content } }, e.origin)
        }
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
}


export function sendWindowMessage(command: string, body: object) {
    window.postMessage({ source: ID, data: { command, body } }, '*')
}