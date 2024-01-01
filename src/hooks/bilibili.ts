

// const monObserver = new Observer((mu,) => {
//     const currentState = $(mu[0].target).hasClass(classes.screenWeb) ? 'web-fullscreen' : $(mu[0].target).hasClass(classes.screenFull) ? 'fullscreen' : 'normal'
//     if (currentState === lastState) return
//     const fullScreen = currentState === 'web-fullscreen' || currentState === 'fullscreen'
//     fullScreenTrigger(fullScreen, settings)
//     lastState = currentState
// })
// monObserver.observe(document.body, { attributes: true, subtree: false, childList: false })
// observers.push(monObserver)

import { useState } from 'react';

import { useMutationObserver } from '@react-hooks-library/core';

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