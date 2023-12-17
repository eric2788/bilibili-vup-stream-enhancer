import { useEffect } from "react";
import { getForwarder, type ChannelType, type ForwardData, type ForwardResponse } from "~background/forwards";


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