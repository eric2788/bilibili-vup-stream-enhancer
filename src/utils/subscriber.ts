import { ID, addWindowMessageListener } from "./messaging"

import type { BLiveDataWild } from "~types/bilibili"

export type BLiveListener<K extends string> = (command: BLiveDataWild<K>, event: MessageEvent) => void

const listenerMap = new Map<string, BLiveListener<any>[]>()

let removeListener: VoidFunction = null

if (removeListener !== null) {
    removeListener()
    removeListener = null
}


removeListener = addWindowMessageListener('blive-ws', (data: { cmd: string, command: any, eventId: string }, event) => {
    
    const listeners = listenerMap.get(data.cmd) ?? []

    listeners.forEach(listener => listener(data.command, event))

    delete data.command.dm_v2 // delete dm_v2 to apply modification
    event.source.postMessage({ source: ID, data: { command: `ws:callback:${data.eventId}`, body: data } }, { targetOrigin: event.origin })

})


/**
 * Adds a BLive subscriber for a specific command.
 * 
 * @template K - The type of the command.
 * @param {K} command - The command to subscribe to.
 * @param {BLiveListener<K>} callback - The callback function to be executed when the command is triggered.
 * @returns {VoidFunction} - A function that can be called to unsubscribe the callback from the command.
 */
export function addBLiveSubscriber<K extends string>(command: K, callback: BLiveListener<K>): VoidFunction {
    listenerMap.set(command, [...(listenerMap.get(command) ?? []), callback])
    return () => {
        listenerMap.set(command, listenerMap.get(command).filter(v => v !== callback))
    }
}
