import { useMutationObserver } from '@react-hooks-library/core';
import { useState } from 'react';

export type WebScreenStatus = 'normal' | 'web-fullscreen' | 'fullscreen'

export function useWebScreenChange(classes: { screenWeb: string, screenFull: string }): WebScreenStatus {

    const fetchScreenStatus = (bodyElement: HTMLElement) =>
        bodyElement.classList.contains(classes.screenWeb) ?
            'web-fullscreen' :
            bodyElement.classList.contains(classes.screenFull) ?
                'fullscreen' :
                'normal'

    const [screenStatus, setScreenStatus] = useState<WebScreenStatus>(() => fetchScreenStatus(document.body))

    useMutationObserver(document.body, (mutations: MutationRecord[]) => {
        if (mutations[0].type !== 'attributes') return
        if (!(mutations[0].target instanceof HTMLElement)) return
        const bodyElement = mutations[0].target

        const newStatus: WebScreenStatus = fetchScreenStatus(bodyElement)

        setScreenStatus(newStatus)

    }, { attributes: true, subtree: false, childList: false })

    return screenStatus
}