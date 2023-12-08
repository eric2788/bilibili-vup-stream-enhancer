import { useState } from 'react';

export function useBinding<T extends object>(initialState: T) {
    const [state, setState] = useState(initialState);

    const stateProxy = new Proxy(state, {
        set(target, prop, value) {
            setState(prevState => ({ ...prevState, [prop]: value }));
            return true;
        }
    });

    return stateProxy;
}

export function useBindableState<T extends object>(initialState: T) {

    const stateProxy = useBinding(initialState);

    const bind = <E extends Element = Element, K extends keyof T = keyof T>(
        key: K, 
        event: keyof React.DOMAttributes<E> = 'onChange', 
        getValue: (e: React.SyntheticEvent<E>) => T[K] = (e) => (e.target as any).value as T[K]
    ) => ({
        [event]: (e: React.SyntheticEvent<E>) => {
            const value = getValue(e);
            if (value) {
                stateProxy[key] = value
            } else {
                console.warn(`Cannot bind '${key as string}' to '${event}'`)
            }
        },
        value: stateProxy[key]
    });

    return [stateProxy, bind] as const;
}

export type StateProxy<T extends object> = {
    state: T
    bind: ReturnType<typeof useBindableState<T>>[1]
}