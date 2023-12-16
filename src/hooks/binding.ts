import type { ChangeEvent, EventHandler, SyntheticEvent } from 'react';
import { stateProxy, stateWrapper } from 'react-state-proxy';
import type { PickLeaves, Leaves, PathLeafType, Paths } from '~types'

export type StateHandler<T> = <E extends SyntheticEvent<Element>, W = any>(getter: (e: E) => W) => <R extends PickLeaves<T, W>>(k: R) => (e: E) => void

export type StateProxy<T extends object> = {
    state: T
    useHandler: StateHandler<T>
}


// expose functions from proxyHandler
// Important: this is only work for proxy object of useBinding
export type ExposeHandler<T extends object> = T & {
    set: <K extends Leaves<T>>(k: K, v: PathLeafType<T, K>, useThis?: boolean) => boolean
    get: <K extends Paths<T>>(k: K) => PathLeafType<T, K>
}

export function useBinding<T extends object>(initialState: T): [T, StateHandler<T>] {

    const proxyHandler = {
        set<K extends Leaves<T>>(k: K, v: PathLeafType<T, K>, useThis: boolean = false): boolean {
            console.info('proxy: ', proxy)
            console.info('this: ', this)
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
                console.info('getting ', k, v)
                return typeof v !== 'object' ? v : stateWrapper({ ...v, ...proxyHandler })
            }
            const [part, ...remain] = parts
            const fragment = this.get(part)
            console.info('getting ', k, fragment)
            return fragment.get(remain.join('.'))
        }
    }

    const state = stateWrapper<T>({
        ...initialState,
        ...proxyHandler
    })

    const proxy = stateProxy<T>(state)
    const useHandler: StateHandler<T> = <E extends SyntheticEvent<Element>, W = any>(getter: (e: E) => W) => {
        type H = ReturnType<typeof getter>;
        return function <R extends PickLeaves<T, H>>(k: R) {
            return (e: E) => {
                const value = getter(e) as PathLeafType<T, R>;
                console.debug(`setting ${k} to ${value}`);
                (state as ExposeHandler<T>).set<R>(k, value);
            }
        }
    }

    return [proxy, useHandler] as const;
}

export function asStateProxy<T extends object>(result: ReturnType<typeof useBinding<T>>): StateProxy<T> {
    const [state, useHandler] = result
    return { state, useHandler }
}