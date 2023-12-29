import { useEffect } from "react";
import type { BLiveDataWild } from "~types/bilibili";
import { addBLiveMessageCommandListener, addBLiveMessageListener, addWindowMessageListener } from "~utils/messaging";

export function useWindowMessage(command: string, handler: (data: any, event: MessageEvent) => void) {
    useEffect(() => {
        const removeListener = addWindowMessageListener(command, handler)
        return () => removeListener()
    }, [])

}

export function useBLiveMessage<K extends string>(handler: (data: { cmd: K, command: BLiveDataWild<K> }, event: MessageEvent) => void) {
    useEffect(() => {
        const removeListener = addBLiveMessageListener(handler)
        return () => removeListener()
    }, [])
}


export function useBLiveMessageCommand<K extends string>(command: K, handler: (command: BLiveDataWild<K>, event: MessageEvent) => void) {
    useEffect(() => {
        const removeListener = addBLiveMessageCommandListener(command, handler)
        return () => removeListener()
    }, [])
}