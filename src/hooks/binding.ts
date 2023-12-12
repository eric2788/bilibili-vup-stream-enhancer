import type { ChangeEvent, EventHandler, SyntheticEvent } from 'react';
import { stateProxy, stateWrapper } from 'react-state-proxy';
import type { PickLeaves, Leaves, LeafType } from '~types'

export type StateHandler<T> = <E extends SyntheticEvent<Element>, W = any>(getter: (e: E) => W) => <R extends PickLeaves<T, W>>(k: R) => (e: E) => void

export type StateProxy<T extends object> = {
    state: T
    useHandler: StateHandler<T>
}

export function useBinding<T extends object>(initialState: T): [T, StateHandler<T>] {

    const proxyHandler = {
        set<K extends Leaves<T>>(k: K, v: LeafType<T, K>) {
            const parts = (k as string).split('.') as string[]
            if (parts.length === 1) {
                Reflect.set(proxy, k, v)
            } else {
                const [part, ...remain] = parts
                const fragment = this.get(part)
                fragment.set(remain.join('.'), v)
                Reflect.set(proxy, part, fragment)
            }
        },
        get(k: keyof T): any {
            const v = Reflect.get(this, k)
            return typeof v !== 'object' ? v : stateWrapper({ ...v, ...proxyHandler })
        }
    }

    const state = stateWrapper({
        ...initialState,
        ...proxyHandler
    })

    const proxy = stateProxy<T>(state)
    const useHandler: StateHandler<T> = <E extends SyntheticEvent<Element>, W = any>(getter: (e: E) => W) => {
        type H = ReturnType<typeof getter>;
        return function <R extends PickLeaves<T, H>>(k: R) {
            return (e: E) => {
                const value = getter(e) as LeafType<T, R>;
                console.debug(`setting ${k} to ${value}`)
                state.set<R>(k, value);
                
            };
        };
    }

    return [proxy, useHandler] as const;
}

export function asStateProxy<T extends object>(result: ReturnType<typeof useBinding<T>>): StateProxy<T> {
    const [state, useHandler] = result
    return { state, useHandler }
}