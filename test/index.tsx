import type { ChangeEvent, SyntheticEvent } from 'react';
import { useState } from 'react';

type A = {
    b: {
        c: string;
        d: number;
    };
};

type Leaves<T> = T extends object ? { [K in keyof T]: `${K & string}${Leaves<T[K]> extends never ? '' : `.${Leaves<T[K]>}`}` }[keyof T] : never;

type FilterLeaves<T, V> = {
    [K in Leaves<T>]: PathValue<T, K> extends V ? K : never
}[Leaves<T>];

type PickType<T, V> = FilterLeaves<T, V>;


type PathValue<T, P extends Leaves<T>> =
    P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
    ? Rest extends Leaves<T[Key]>
    ? PathValue<T[Key], Rest>
    : never
    : never
    : P extends keyof T
    ? T[P]
    : never;

function useProxy<T extends object>(initialState: T) {
    const [state, setState] = useState(initialState);

    const useHandler = <E extends SyntheticEvent<HTMLInputElement>, W = any>(getter: (e: E) => W) => {
        type H = ReturnType<typeof getter>;
        return function<R extends PickType<T, H>>(k: R) {
            const parts = (k as string).split('.') as string[];
    
            return (e: E) => {
                const value = getter(e);
                setState((prevState) => {
                    const newState = { ...prevState };
                    let obj = newState;
                    for (let i = 0; i < parts.length - 1; i++) {
                        obj = obj[parts[i]];
                    }
                    obj[parts[parts.length - 1]] = value;
                    return newState;
                });
            };
        };
    }

    return [state, useHandler] as const;
}

const value: A = {
    b: {
        c: '',
        d: 0,
    },
};

function App() {
    const [state, useHandler] = useProxy<A>(value);

    const handle = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value);

    return (
        <div>
            <input value={state.b.c} onChange={handle('b.c')} />
            {/* This will cause a TypeScript error because the handle function returns a string but 'b.d' is a number */}
            {/* <input value={state.b.d} onChange={handle('b.d')} /> */}
        </div>
    );
}