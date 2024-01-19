import { useInterval } from '@react-hooks-library/core'
import { useCallback, useEffect, useRef } from 'react'

type ScrollOptimizeOptions<E extends Element> = {
    root: React.MutableRefObject<E>
    rootMargin?: string
    threshold?: number | number[]
}



/**
 * Custom hook for optimizing scroll behavior by controlling the visibility of elements based on their intersection with the viewport.
 * @template E The type of the element being observed.
 * @param {ScrollOptimizeOptions<E>} options - The options for scroll optimization.
 * @returns {React.MutableRefObject<IntersectionObserver | null>} - A mutable ref object containing the IntersectionObserver instance.
 *
 * @example
 * const options = {
 *   root: document.querySelector('#scrollContainer'),
 *   rootMargin: '0px',
 *   threshold: 0.5
 * };
 * const observerRef = useScrollOptimizer(options);
 * // Use observerRef.current to access the IntersectionObserver instance.
 */
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


/**
 * Custom hook that optimizes rendering of a row element using an IntersectionObserver.
 * @template E The type of the row element.
 * @param {React.MutableRefObject<IntersectionObserver | null>} observerRef A mutable ref object that holds the IntersectionObserver instance.
 * @returns {React.RefCallback<E>} A callback function that should be assigned to the ref prop of the row element.
 * @example
 * const observer = useScrollOptimizer(...);
 * const rowRef = useRowOptimizer(observer);
 * 
 * return (
 *   <div ref={rowRef}>
 *     {/* Row content */
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


export function useTransaction<T>(interval: number, callback: (data: T) => void) {

    const dataRef = useRef<T[]>([])

    const push = useCallback((data: T) => {
        dataRef.current.push(data)
    }, [dataRef])

    useInterval(() => {
        if (dataRef.current.length === 0) return
        const data = dataRef.current.shift()
        callback(data)
    }, interval)

    return push

}