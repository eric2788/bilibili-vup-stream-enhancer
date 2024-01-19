import type {
    MessagingData,
    Payload as MsgPayload,
    Response as MsgResponse
} from '~background/messages'

import type { BLiveDataWild } from "~types/bilibili"
import { sendToBackground } from '@plasmohq/messaging'

export const ID = 'bilibili-vup-stream-enhancer'

/**
 * Sends a message to the background script.
 * @param name - The name of the message.
 * @param body - The payload of the message.
 * @param sender - The sender of the message.
 * @returns A promise that resolves to the response of the message.
 */
export async function sendMessager<T extends keyof MessagingData>(name: T, body: MsgPayload<MessagingData[T]> = undefined, sender: chrome.runtime.MessageSender = undefined): Promise<MsgResponse<MessagingData[T]>> {
    return sendToBackground({ name, body }).then(res => res as MsgResponse<MessagingData[T]>)
}

/**
 * Sends a message from the main world script to the background script.
 * @param name - The name of the message.
 * @param body - The payload of the message.
 * @param extensionId - The ID of the extension.
 * @returns A promise that resolves to the response from the background script.
 */
export async function sendMessagerFromMain<T extends keyof MessagingData>(name: T, body: MsgPayload<MessagingData[T]> = undefined, extensionId: string = 'ooofiabfmndbfglabnjmnmpdmddehido'): Promise<MsgResponse<MessagingData[T]>> {
    return sendToBackground({ name, body, extensionId }).then(res => res as MsgResponse<MessagingData[T]>)
}

/**
 * Adds a window message listener for a specific command.
 * 
 * @param command - The command to listen for.
 * @param callback - The callback function to be executed when the message is received.
 * @param signal - An optional AbortSignal to abort the listener.
 * @returns A function to remove the listener.
 */
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


/**
 * Sends a window message with the specified command and body.
 * @param command - The command to send.
 * @param body - The body of the message.
 */
export function sendWindowMessage(command: string, body: any) {
    window.postMessage({ source: ID, data: { command, body } }, '*')
}


/**
 * Adds a listener for BLive messages.
 * 
 * @template K - The type of the message command.
 * @param callback - The callback function to be called when a BLive message is received.
 * @returns A function that can be used to remove the listener.
 */
export function addBLiveMessageListener<K extends string>(callback: (data: { cmd: K, command: BLiveDataWild<K> }, event: MessageEvent) => void): VoidFunction {
    return addWindowMessageListener('blive-ws', callback)
}


/**
 * Adds a BLive message command listener.
 * 
 * @template K - The type of the command.
 * @param {K} cmd - The command to listen for.
 * @param {(data: BLiveDataWild<K>, event: MessageEvent) => void} callback - The callback function to be executed when the command is received.
 * @returns {VoidFunction} - A function that can be used to remove the listener.
 */
export function addBLiveMessageCommandListener<K extends string>(cmd: K, callback: (data: BLiveDataWild<K>, event: MessageEvent) => void): VoidFunction {
    return addBLiveMessageListener((data, event) => {
        if (data.cmd === cmd) {
            callback(data.command, event)
        }
    })
}

/**
 * Sends a BLive message and returns a promise that resolves with the response.
 * This function is typically used from an adapter.
 * 
 * @template K - The type of the command key.
 * @param {K} cmd - The command key.
 * @param {BLiveDataWild<K>} command - The command data.
 * @param {AbortSignal} [signal] - An optional AbortSignal to abort the request.
 * @returns {Promise<BLiveDataWild<K>>} - A promise that resolves with the response data.
 */
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