import { useEffect } from 'react';
import {
    ChannelType, ForwardData, ForwardResponse, getForwarder
} from '~background/forwards';

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
 * const { addHandler, sendForward } = useForwarder('myCommand', 'background');
 *
 * // Add a handler for 'myCommand' messages on the 'background' channel
 * addHandler((data) => {
 *   console.log('Received data:', data);
 * });
 *
 * // Send a 'myCommand' message to the 'background' channel
 * sendForward('background', { myData: 'Hello, world!' });
 */
export function useForwarder<K extends keyof ForwardData>(key: K, target: ChannelType) {

    type R = ForwardResponse<ForwardData[K]>
    const removeFunc = new Set<() => void>()

    useEffect(() => {
        return () => {
            removeFunc.forEach(fn => fn())
        }
    }, [])

    const forwarder = getForwarder(key, target)

    return {
        addHandler: (handler: (data: R) => void) => {
            removeFunc.add(forwarder.addHandler(handler))
        },
        sendForward: forwarder.sendForward
    }

}