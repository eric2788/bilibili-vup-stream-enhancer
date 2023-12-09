import type { ChangeEvent, EventHandler, SyntheticEvent } from 'react';
import { stateProxy, stateWrapper } from 'react-state-proxy';
import type { PickLeaves } from '~types'

export type StateHandler<T> = <E extends SyntheticEvent<Element>, W = any>(getter: (e: E) => W) => <R extends PickLeaves<T, W>>(k: R) => (e: E) => void

export type StateProxy<T extends object> = {
    state: T
    useHandler: StateHandler<T>
}

export function useBinding<T extends object>(initialState: T) {


    const state = stateWrapper({
        ...initialState,
        set<K extends keyof T>(k: K, v: T[K]) {
            this[k] = v
        },
    })

    const proxy = stateProxy<T>(state)
    const useHandler: StateHandler<T> = <E extends SyntheticEvent<Element>, W = any>(getter: (e: E) => W) => {
        type H = ReturnType<typeof getter>;
        return function<R extends PickLeaves<T, H>>(k: R) {
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