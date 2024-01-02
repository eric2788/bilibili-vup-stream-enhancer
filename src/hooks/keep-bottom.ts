import { useCallback, useEffect, useRef, useState } from 'react'

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