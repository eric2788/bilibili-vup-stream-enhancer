import { useMutationObserver } from '@react-hooks-library/core'
import { useState } from 'react'
import { type SettingSchema as DeveloperSchema } from '~settings/fragments/developer'

export type WebScreenStatus = 'normal' | 'web-fullscreen' | 'fullscreen'

/**
 * Custom hook that tracks the screen status of a web page.
 * @param classes - The CSS classes used to identify different screen statuses.
 * @returns The current screen status.
 * @example
 * // Usage
 * const classes = {
 *   screenWeb: 'web-screen',
 *   screenFull: 'full-screen'
 * };
 * const screenStatus = useWebScreenChange(classes);
 * console.log(screenStatus); // 'web-fullscreen', 'fullscreen', or 'normal'
 */
export function useWebScreenChange(classes: DeveloperSchema['classes']): WebScreenStatus {

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