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
                Reflect.set(this, k, v)
            } else {
                const [part, ...remain] = parts
                const fragment = this.get(part)
                fragment.set(remain.join('.'), v)
                Reflect.set(this, part, fragment)
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
            const parts = (k as string).split('.') as string[];

            return (e: E) => {
                const value = getter(e);
                const last = parts.pop()!;
                const target = parts.reduce((acc, cur) => acc[cur], state);
                target.set(last, value);
            };
        };
    }

    return [proxy, useHandler] as const;
}

export function asStateProxy<T extends object>(result: ReturnType<typeof useBinding<T>>): StateProxy<T> {
    const [state, useHandler] = result
    return { state, useHandler }
}