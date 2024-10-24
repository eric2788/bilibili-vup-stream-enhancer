import {
    getForwarder,
    type ChannelType,
    type ForwardData,
    type Forwarder,
    type ForwardResponse
} from '~background/forwards'

import { useEffect, useMemo } from 'react'

/**
 * `useForwarder` is a React hook that creates a forwarder for sending and receiving messages between different parts of a Chrome extension.
 *
 * @param {K} key - The key of the forward data. This corresponds to the command that will be sent or received.
 * @param {ChannelType} target - The target channel. This can be 'pages', 'background', or 'content-script'.
 *
 * @returns {Object} An object with two properties:
 * - `addHandler`: A function that takes a handler function as an argument. The handler function will be called with the data when a message with the specified command is received on the specified channel. The handler function is automatically removed when the component unmounts.
 * - `sendForward`: A function that sends a message with the specified command to the specified channel. The message body is passed as an argument to this function.
 *
 * @example
 * const { addHandler, addHandlerOnce, sendForward } = useForwarder('myCommand', 'background')
 *
 * // Add a handler for 'myCommand' messages on the 'background' channel
 * addHandler((data) => {
 *   console.log('Received data:', data)
 * })
 * 
 * // Add a one-time handler for 'myCommand' messages on the 'background' channel
 * addHandlerOnce((data) => {
 *  console.log('Received data:', data)
 * })
 *
 * // Send a 'myCommand' message to the 'background' channel
 * sendForward('background', { myData: 'Hello, world!' })
 */
export function useForwarder<K extends keyof ForwardData>(key: K, target: ChannelType): Forwarder<K> {

    type R = ForwardResponse<ForwardData[K]>
    const removeFunc = new Set<VoidCallback>()

    const forwarder = useMemo(() => getForwarder(key, target), [key, target])

    useEffect(() => {
        return () => {
            removeFunc.forEach(fn => fn())
        }
    }, [forwarder])

    return useMemo(() => ({
        addHandler: (handler: (data: R) => void): VoidCallback => {
            const remover = forwarder.addHandler(handler)
            removeFunc.add(remover)
            return remover // auto remove on unmount or manual remove
        },
        addHandlerOnce: (handler: (data: R) => void): VoidCallback => {
            const remover = forwarder.addHandlerOnce(handler)
            removeFunc.add(remover)
            return remover // auto remove on unmount or manual remove
        },
        sendForward: forwarder.sendForward
    }), [forwarder])

}