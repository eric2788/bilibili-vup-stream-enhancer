import { useEffect } from "react";
import type { BLiveDataWild, BLiveType } from "~types/bilibili";
import { addBLiveMessageCommandListener, addBLiveMessageListener, addWindowMessageListener } from "~utils/messaging";

export function useWindowMessage(command: string, handler: (data: any, event: MessageEvent) => void) {
    useEffect(() => {
        const removeListener = addWindowMessageListener(command, handler)
        return () => removeListener()
    }, [])

}

export function useBLiveMessage(handler: (data: { cmd: string, command: any }, event: MessageEvent) => void) {
    useEffect(() => {
        const removeListener = addBLiveMessageListener(handler)
        return () => removeListener()
    }, [])
}


export function useBLiveMessageCommand<K extends BLiveType | string>(command: K, handler: (command: BLiveDataWild<K>, event: MessageEvent) => void) {
    useEffect(() => {
        const removeListener = addBLiveMessageCommandListener(command, handler)
        return () => removeListener()
    }, [])
}