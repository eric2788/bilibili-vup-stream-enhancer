import * as jimaku from './forwards/jimaku'

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

const forwards = {
    'jimaku': jimaku
}


export function sendForward<T extends keyof ForwardData, V extends ForwardBody<ForwardData[T]>>(target: ChannelType, key: T, body: V): void {
    sendForwardInternal(target, key, body)
}

function sendForwardInternal<T extends keyof ForwardData, V = ForwardBody<ForwardData[T]>>(target: ChannelType, key: T, body: V): void {
    const message: ForwardInfo<V> = {
        target,
        command: key,
        body
    }
    if (target === 'background' || target === 'pages') {
        chrome.runtime.sendMessage(message)
    } else if (target === 'content-script') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs.length) return
            chrome.tabs.sendMessage(tabs[0].id, message)
        })
    }
}


export function isForwardMessage<T extends object>(message: any): message is ForwardInfo<T> {
    return message.target && message.command && message.body
}

export function getForwarder<K extends keyof ForwardData>(key: K, target: ChannelType) {

    type T = ForwardBody<ForwardData[K]>
    type R = ForwardResponse<ForwardData[K]>

    const listener  = (invoker: (data: R) => void) => (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean | void => {
        if (!isForwardMessage<T>(message)) return
        if (message.target !== target) return
        if (message.command !== key) return
        const { default: handler } = forwards[key]
        if (!handler) {
            // if no handler, invoke the invoker directly
            invoker(message.body as R)
            return
        }

        const wrapHandler = (info: ForwardInfo<R>): void => {
             // if target changed, then do the sendForward again
             if (info.target !== message.target) {
                sendForwardInternal<K, ForwardResponse<ForwardData[K]>>(info.target, key, info.body)
                return
            }
            invoker(info.body)
        }

        const response = handler(message) as (ForwardInfo<R> | Promise<ForwardInfo<R>>)
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
        sendForward: (toTarget: ChannelType, body: T): void => sendForward<K, T>(toTarget, key, body)
    }
}