import dom from 'url:~adapters/capture-element.ts'
import websocket from 'url:~adapters/websocket-hook.js'

export type Adapters = typeof adapters
export type AdapterType = keyof Adapters

export const adapters = {
    dom,
    websocket
}