import * as jimaku from './forwards/jimaku'
import * as command from './forwards/command'

export type ForwardData = typeof forwards

interface ForwardFragment<T extends object, R = T> {
    default?: ForwardHandler<T, R>
}

export type ForwardBody<T> = T extends ForwardFragment<infer U> ? U : never;

export type ForwardResponse<T> = T extends ForwardFragment<any, infer U> ? U : void;

export type ChannelType = 'pages' | 'background' | 'content-script'

export type ForwardInfo<T> = {
    target: ChannelType
    command: keyof ForwardData
    body: T
}

export type ForwardHandler<T extends object, R = T> = (req: ForwardInfo<T>) => Promise<ForwardInfo<R>> | ForwardInfo<R>

/**
 * Sends a forward message to the specified target channel.
 * 
 * @template T - The key type of the forward data.
 * @template V - The body type of the forward data.
 * @param {ChannelType} target - The target channel to send the forward message to.
 * @param {T} command - The command of the forward data.
 * @param {V} body - The body of the forward data.
 * @returns {void}
 * 
 * @example
 * // Sending a forward message to the "pages" channel with command "update" and body { version: "1.0.0" }
 * sendForward("pages", "update", { version: "1.0.0" });
 */
export function sendForward<T extends keyof ForwardData, V extends ForwardBody<ForwardData[T]>>(target: ChannelType, command: T, body: V): void {
    sendForwardInternal(target, command, body)
}

function sendForwardInternal<T extends keyof ForwardData, V = ForwardBody<ForwardData[T]>>(target: ChannelType, command: T, body: V): void {
    const message: ForwardInfo<V> = {
        target,
        command,
        body
    }
    if (target === 'background' || target === 'pages') {
        chrome.runtime.sendMessage(message)
    } else if (target === 'content-script') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, message))
        })
    }
}


/**
 * Checks if the provided message is a forward message.
 * @param message - The message to be checked.
 * @returns True if the message is a forward message, false otherwise.
 */
export function isForwardMessage<T extends object>(message: any): message is ForwardInfo<T> {
    return message.target && message.command && message.body
}


/**
 * Retrieves the appropriate forwarder for the given command and target.
 * 
 * @template K - The type of the command.
 * @param {K} command - The command to be forwarded.
 * @param {ChannelType} target - The target channel for the forwarder.
 * @returns {Forwarder<K>} - The forwarder for the specified command and target.
 * 
 * @example
 * const forwarder = getForwarder('sendMessage', 'background');
 * forwarder.addHandler((data) => {
 *   console.log('Received message:', data);
 * });
 * forwarder.sendForward('background', { message: 'Hello' });
 */
export function getForwarder<K extends keyof ForwardData>(command: K, target: ChannelType): Forwarder<K> {

    type T = ForwardBody<ForwardData[K]>
    type R = ForwardResponse<ForwardData[K]>

    const listener  = (invoker: (data: R) => void) => (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean | void => {
        if (!isForwardMessage<T>(message)) return
        if (message.target !== target) return
        if (message.command !== command) return
        const { default: handler } = forwards[command]
        if (!handler) {
            // if no handler, invoke the invoker directly
            invoker(message.body as R)
            return
        }

        const wrapHandler = (info: ForwardInfo<R>): void => {
             // if target changed, then do the sendForward again
             if (info.target !== message.target) {
                sendForwardInternal<K, ForwardResponse<ForwardData[K]>>(info.target, command, info.body)
                return
            }
            invoker(info.body)
        }
        const handle = handler as ForwardHandler<T, R>
        const response = handle(message) as (ForwardInfo<R> | Promise<ForwardInfo<R>>)
        if (response instanceof Promise) {
            response.then(wrapHandler).then(sendResponse)
            return true
        } else {
            wrapHandler(response)
        }
    }

    return {
        addHandler: (handler: (data: R) => void): (() => void) => {
            const fn = listener(handler)
            chrome.runtime.onMessage.addListener(fn)
            console.log('added listener')
            return () => {
                chrome.runtime.onMessage.removeListener(fn)
                console.log('removed listener')
            }
        },
        sendForward: (toTarget: ChannelType, body: T): void => sendForward<K, T>(toTarget, command, body)
    }
}

export function useDefaultHandler<T extends object>(): ForwardHandler<T> {
    return (req: ForwardInfo<T>) => req
}


export type Forwarder<K extends keyof ForwardData> = {
    addHandler: (handler: (data: ForwardResponse<ForwardData[K]>) => void) => () => void
    sendForward: (toTarget: ChannelType, body: ForwardBody<ForwardData[K]>) => void
}

const forwards = {
    'jimaku': jimaku,
    'command': command
}
