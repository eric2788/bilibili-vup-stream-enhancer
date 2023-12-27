import { useEffect } from "react";
import { addWindowMessageListener } from "~utils/messaging";



export function useWindowMessage(command: string, handler: (data: object, event: MessageEvent) => void) {
    useEffect(() => {
        const removeListener = addWindowMessageListener(command, handler)
        return () => removeListener()
    }, [])

}