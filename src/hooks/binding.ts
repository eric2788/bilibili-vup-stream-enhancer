import { type SyntheticEvent } from 'react'
import { stateProxy, stateWrapper } from 'react-state-proxy'

import type { Leaves, PathLeafType, Paths, PickLeaves } from '~types/common'

export type StateHandler<T> = <E extends SyntheticEvent<Element>, W = any>(getter: (e: E) => W) => <R extends PickLeaves<T, W>>(k: R) => (e: E) => void

export type StateProxy<T extends object> = {
    state: T
    useHandler: StateHandler<T>
}

// expose functions from proxyHandler
// Important: this is only work for proxy object of useBinding
export type ExposeHandler<T extends object> = T & {
    set: <K extends Leaves<T>>(k: K, v: PathLeafType<T, K>) => boolean
    get: <K extends Paths<T>>(k: K) => PathLeafType<T, K>
}

/**
 * Custom hook for creating a two-way binding between a state object and its handler functions.
 * 
 * @template T - The type of the state object.
 * @param initialState - The initial state object.
 * @returns An array containing the state object and its handler functions.
 *
 * @example
 * // Usage
 * const [state, useHandler] = useBinding({ text: '' })
 * 
 * // Accessing the state object
 * console.log(state.text) // Output: ''
 * 
 * // Creating a handler for updating the state
 * const handler = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value)
 * 
 * // Using the handler to update the state
 * <input onChange={handler('text')} value={state.text} />
 * 
 * // The state is updated when the input changes
 * console.log(state.text) // Output: (new value of the input)
 */
export function useBinding<T extends object>(initialState: T): [T, StateHandler<T>] {

    const proxyHandler = {
        set<K extends Leaves<T>>(k: K, v: PathLeafType<T, K>, useThis: boolean = false): boolean {
            const target = useThis ? this : proxy
            const parts = (k as string).split('.') as string[]
            if (parts.length === 1) {
                return Reflect.set(target, k, v)
            }
            const [part, ...remain] = parts
            const fragment = this.get(part)
            fragment.set(remain.join('.'), v, true)
            return Reflect.set(proxy, part, fragment)
        },
        get<K extends Paths<T>>(k: K): PathLeafType<T, K> {
            const parts = (k as string).split('.') as string[]
            if (parts.length === 1) {
                const v = Reflect.get(this, k)
                return typeof v !== 'object' ? v : stateWrapper({ ...v, ...proxyHandler })
            }
            const [part, ...remain] = parts
            const fragment = this.get(part)
            return fragment.get(remain.join('.'))
        }
    }

    const state = stateWrapper<T>({
        ...initialState,
        ...proxyHandler
    })

    const proxy = stateProxy<T>(state)
    const useHandler: StateHandler<T> = <E extends SyntheticEvent<Element>, W = any>(getter: (e: E) => W) => {
        type H = ReturnType<typeof getter>
        return function <R extends PickLeaves<T, H>>(k: R) {
            return (e: E) => {
                const value = getter(e) as PathLeafType<T, R>
                (state as ExposeHandler<T>).set<R>(k, value)
            }
        }
    }

    return [proxy, useHandler] as const
}



/**
 * Converts the result of the `useBinding` hook into a state proxy object.
 * 
 * @template T - The type of the state object.
 * @param result - The result of the `useBinding` hook.
 * @returns The state proxy object containing the state and useHandler.
 * 
 * @example
 * const bindingResult = useBinding<MyStateType>()
 * const stateProxy = asStateProxy(bindingResult)
 * 
 * // Access the state object
 * console.log(stateProxy.state)
 * 
 * // Access the useHandler function
 * console.log(stateProxy.useHandler)
 */
export function asStateProxy<T extends object>(result: ReturnType<typeof useBinding<T>>): StateProxy<T> {
    const [state, useHandler] = result
    return { state, useHandler }
}