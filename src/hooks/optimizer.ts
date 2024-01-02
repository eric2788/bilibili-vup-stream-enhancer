import { useCallback, useEffect, useRef } from 'react'

type ScrollOptimizeOptions<E extends Element> = {
    root: React.MutableRefObject<E>
    rootMargin?: string
    threshold?: number | number[]
}



export function useScrollOptimizer<E extends Element = Element>(options: ScrollOptimizeOptions<E>) {

    const { root, rootMargin, threshold } = options

    const observerRef = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver((list) => {
            for (const entry of list) {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).style.visibility = 'visible'
                } else {
                    (entry.target as HTMLElement).style.visibility = 'hidden'
                }
            }
        }, {
            root: root.current,
            rootMargin,
            threshold
        })
        observerRef.current = observer
        return () => {
            observer.disconnect()
        }
    }, [])

    return observerRef
}


export function useRowOptimizer<E extends HTMLElement>(observerRef: React.MutableRefObject<IntersectionObserver | null>) {

    const observer = observerRef.current

    const ref = useRef<E>(null)

    const refCallback = useCallback((node: E) => {
        if (ref.current) {
            observer?.unobserve(ref.current)
        }
        if (node) {
            ref.current = node
            observer?.observe(ref.current)
        }
    }, [observer])

    useEffect(() => {
        return () => {
            if (ref.current) {
                observer?.unobserve(ref.current)
            }
        }
    }, [])

    return refCallback

}