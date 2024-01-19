import {
    addBLiveMessageCommandListener,
    addBLiveMessageListener,
    addWindowMessageListener
} from '~utils/messaging'

import type { BLiveDataWild } from "~types/bilibili"
import { addBLiveSubscriber } from '~utils/subscriber'
import { useEffect } from 'react'

/**
 * Custom hook that listens for window messages with a specific command and executes a handler function.
 * 
 * @param command - The command string to listen for.
 * @param handler - The function to be executed when a matching window message is received.
 */
export function useWindowMessage(command: string, handler: (data: any, event: MessageEvent) => void) {
    useEffect(() => {
        const removeListener = addWindowMessageListener(command, handler)
        return () => removeListener()
    }, [])

}

/**
 * Custom hook for handling BLive messages.
 * 
 * @template K - The type of the command key.
 * @param {function} handler - The callback function to handle the message.
 * @returns {void}
 */
export function useBLiveMessage<K extends string>(handler: (data: { cmd: K, command: BLiveDataWild<K> }, event: MessageEvent) => void) {
    useEffect(() => {
        const removeListener = addBLiveMessageListener(handler)
        return () => removeListener()
    }, [])
}

/**
 * Custom hook for handling BLive message commands.
 * 
 * @template K - The type of the command.
 * @param {K} cmd - The command to listen for.
 * @param {(command: BLiveDataWild<K>, event: MessageEvent) => void} handler - The handler function to be called when the command is received.
 * @returns {void}
 */
export function useBLiveMessageCommand<K extends string>(cmd: K, handler: (command: BLiveDataWild<K>, event: MessageEvent) => void) {
    useEffect(() => {
        const removeListener = addBLiveMessageCommandListener(cmd, handler)
        return () => removeListener()
    }, [])
}

/**
 * Custom hook for subscribing to BLive messages.
 * 
 * @template K - The type of the command.
 * @param {K} command - The command to subscribe to.
 * @param {(command: BLiveDataWild<K>, event: MessageEvent) => void} handler - The handler function to be called when a message is received.
 * @returns {void}
 */
export function useBLiveSubscriber<K extends string>(command: K, handler: (command: BLiveDataWild<K>, event: MessageEvent) => void) {
    useEffect(() => {
        const removeListener = addBLiveSubscriber(command, handler)
        return () => removeListener()
    }, [])
}