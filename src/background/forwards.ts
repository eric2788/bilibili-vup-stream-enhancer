import * as command from './forwards/command'
import * as jimaku from './forwards/jimaku'
import * as redirect from './forwards/redirect'

export type ForwardData = typeof forwards

interface ForwardFragment<T extends object, R = T> {
    default?: ForwardHandler<T, R>
}

export type ForwardBody<T> = T extends ForwardFragment<infer U> ? U : never

export type ForwardResponse<T> = T extends ForwardFragment<any, infer U> ? U : void

export type ChannelType = keyof ChannelQueryInfo

export type ChannelQueryInfo = {
    'pages': never,
    'background': never,
    'content-script': chrome.tabs.QueryInfo
}

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
 * @template C - The type of the target channel.
 * @param {C} target - The target channel to send the forward message to.
 * @param {T} command - The command of the forward data.
 * @param {V} body - The body of the forward data.
 * @param {ChannelQueryInfo[C]} [queryInfo] - The query info for the content-script channel.
 * @returns {void}
 *
 * @example
 * // Sending a forward message to the "pages" channel with command "update" and body { version: "1.0.0" }
 * sendForward("pages", "update", { version: "1.0.0" })
 */
export function sendForward<T extends keyof ForwardData, V extends ForwardBody<ForwardData[T]>, C extends ChannelType>(target: C, command: T, body: V, queryInfo?: ChannelQueryInfo[C]): void {
    sendForwardInternal<T, C, V>(target, command, body, queryInfo)
}

function sendForwardInternal<T extends keyof ForwardData, C extends ChannelType, V = ForwardBody<ForwardData[T]>>(target: C, command: T, body: V, queryInfo?: ChannelQueryInfo[C]): void {
    const message: ForwardInfo<V> = {
        target,
        command,
        body
    }
    if (target === 'background' || target === 'pages') {
        chrome.runtime.sendMessage(message).catch(console.warn)
    } else if (target === 'content-script') {
        chrome.tabs.query(queryInfo ?? { active: true }, (tabs) => {
            tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, message).catch(console.warn))
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
 * @example
 * const forwarder = getForwarder('sendMessage', 'background')
 * forwarder.addHandler((data) => {
 *   console.log('Received message:', data)
 * })
 * forwarder.sendForward('background', { message: 'Hello' })
 */
export function getForwarder<K extends keyof ForwardData>(command: K, target: ChannelType): Forwarder<K> {

    type T = ForwardBody<ForwardData[K]>
    type R = ForwardResponse<ForwardData[K]>

    const listener = (invoker: (data: R) => void) => (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean | void => {
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
                type QueryInfo = typeof info.target
                sendForwardInternal<K, QueryInfo, ForwardResponse<ForwardData[K]>>(info.target, command, info.body, { url: sender.tab.url })
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
            return () => chrome.runtime.onMessage.removeListener(fn)
        },
        sendForward: <C extends ChannelType>(toTarget: C, body: T, queryInfo?: ChannelQueryInfo[C]): void => {
            sendForward<K, T, C>(toTarget, command, body, queryInfo)
        }
    }
}

export function useDefaultHandler<T extends object>(): ForwardHandler<T> {
    return (req: ForwardInfo<T>) => req
}


export type Forwarder<K extends keyof ForwardData> = {
    addHandler: (handler: (data: ForwardResponse<ForwardData[K]>) => void) => () => void
    sendForward: <C extends ChannelType>(toTarget: C, body: ForwardBody<ForwardData[K]>, queryInfo?: ChannelQueryInfo[C]) => void
}

const forwards = {
    'jimaku': jimaku,
    'command': command,
    'redirect': redirect,
}
