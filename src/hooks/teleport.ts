import { memo, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

export type TeleportSettings<T> = {
    parentQuerySelector: string
    id: string
    placement: (parent: Element, child: Element) => void
    shouldPlace: (data: T) => boolean
}


/**
 * Custom hook for teleporting a component to a different location in the DOM.
 * @template T - The type of the state object.
 * @param {T} state - The state object.
 * @param {TeleportSettings<T>} settings - The settings for the teleportation.
 * @returns {{ Teleport: JSX.Element, rootContainer: HTMLElement | null }} - The Teleport component and the root container element.
 *
 * @example
 * const state = { isVisible: true };
 * const settings = {
 *   id: 'teleport-container',
 *   parentQuerySelector: '#app',
 *   shouldPlace: (state) => state.isVisible,
 *   placement: (parent, child) => parent.appendChild(child)
 * };
 * const { Teleport, rootContainer } = useTeleport(state, settings);
 * 
 * // Usage of the Teleport component
 * <Teleport container={rootContainer} >
 *  <div>Teleported content</div>
 * </Teleport>
 */
export function useTeleport<T>(state: T, settings: TeleportSettings<T>) {

    // dont forget to remove the root container when unmount
    useEffect(() => {
        return () => document.getElementById(settings.id)?.remove()
    }, [])

    const rootContainer = useMemo(() => {
        const parentElement = document.querySelector(settings.parentQuerySelector)
        if (!parentElement) {
            console.warn(`找不到父元素，請檢查 parentQuerySelector: ${settings.parentQuerySelector}`)
        }
        let childElement = document.getElementById(settings.id)
        if (!settings.shouldPlace(state)) {
            childElement?.remove()
            childElement = null
        } else if (parentElement && childElement === null) {
            childElement = document.createElement('div')
            childElement.id = settings.id
            settings.placement(parentElement, childElement)
        }
        return childElement
    }, [state])

    if (settings.shouldPlace(state) && rootContainer === null) {
        console.warn(`找不到子元素，請檢查 id: ${settings.id}`)
    }

    return { Teleport, rootContainer }

}

const Teleport = memo(({ children, container }: { children: JSX.Element, container?: Element }): React.ReactNode => {
    return container ? createPortal(children, container) : children
})
