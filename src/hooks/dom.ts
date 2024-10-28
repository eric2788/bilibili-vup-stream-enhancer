import { useInterval, useMutationObserver } from "@react-hooks-library/core"
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Custom hook that keeps the scroll position at the bottom of an element.
 * @template E The type of the element to be referenced.
 * @param {boolean} enabled Determines whether the hook is enabled or not.
 * @param {Function} calculateRange A function that calculates the range of the element.
 * @param {any[]} deps The dependencies array for the useEffect hook.
 * @returns {Object} An object containing the ref callback, the element ref, and the keepBottom state.
 *
 * @example
 * const calculateRange = (el: Element) => {
 *   // Calculate the range of the element
 * };
 *
 * const { ref, element, keepBottom } = useKeepBottom(true, calculateRange, []);
 * 
 * // Usage of the returned values
 * <div ref={ref}>
 *   // Content
 * </div>
 */
export function useKeepBottom<E extends HTMLElement>(enabled: boolean, calculateRange: (el: Element) => number, deps: any[]) {

    const ref = useRef<E>(null)
    const [keepBottom, setKeepBottom] = useState(true)

    const onScroll = useCallback((e: Event) => {
        if (!enabled) return
        const el = e.target as Element
        const range = calculateRange(el)
        const current = el.scrollTop
        setKeepBottom(current >= range)
    }, [enabled])

    const refCallback = useCallback((node: E) => {
        if (ref.current) {
            ref.current.removeEventListener('scrollend', onScroll)
        }
        if (node) {
            ref.current = node
            ref.current.addEventListener('scrollend', onScroll)
        }
    }, [])

    useEffect(() => {
        if (enabled && ref.current && keepBottom) {
            ref.current.scrollTop = ref.current.scrollHeight
        }
    }, deps)

    // also remove the listener when unmount
    useEffect(() => {
        return () => {
            ref.current?.removeEventListener('scrollend', onScroll)
        }
    }, [])

    return { ref: refCallback, element: ref, keepBottom }
}





/**
 * Custom hook that returns an element matching the specified selector.
 * It uses `useState` to store the element and `useInterval` to periodically
 * update the element if it changes in the DOM.
 *
 * @template E - The type of the element to be returned.
 * @param {string} selector - The CSS selector to query the element.
 * @returns {E | null} - The element matching the selector or null if not found.
 *
 * @example
 * ```typescript
 * const myElement = useQuerySelector<HTMLDivElement>('#my-div');
 * ```
 */
export function useQuerySelector<E extends Element>(selector: string): E | null {

    const [element, setElement] = useState<Element | null>(document.querySelector(selector))

    useInterval(() => {
        const el = document.querySelector(selector)
        if (el) {
            setElement(el)
        }
    }, 500, { paused: !!element, immediate: true })

    return element as E
}