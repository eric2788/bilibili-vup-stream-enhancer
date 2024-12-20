import { useEffect, useRef, useState } from 'react';

/**
 * Hook to run an async effect on mount and another on unmount.
 * 
 * edited from: https://marmelab.com/blog/2023/01/11/use-async-effect-react.html
 */
export const useAsyncEffect = <R = void>(
    mountCallback: () => Promise<R>,
    unmountCallback: (r: R) => Promise<void>,
    errorCallback: (error: any) => void,
    deps: any[] = [],
): void => {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        let cleaner = null;
        let ignore = false;
        let mountSucceeded = false;

        (async () => {
            await Promise.resolve(); // wait for the initial cleanup in Strict mode - avoids double mutation
            if (!isMounted.current || ignore) {
                return;
            }
            try {
                cleaner = await mountCallback();
                mountSucceeded = true;
                if (!isMounted.current || ignore) {
                    // Component was unmounted before the mount callback returned, cancel it
                    unmountCallback(cleaner);
                }
            } catch (error) {
                if (!isMounted.current) return;
                errorCallback(error);
            }
        })();

        return () => {
            ignore = true;
            if (mountSucceeded) {
                unmountCallback(cleaner)
                    .then(() => {
                        if (!isMounted.current) return;
                    })
                    .catch((error: unknown) => {
                        if (!isMounted.current) return;
                        errorCallback(error);
                    });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};


/**
 * A React hook that switches between two JSX elements after a specified timeout.
 *
 * @param before - The initial JSX element to display before the timeout.
 * @param after - The JSX element to display after the timeout.
 * @param timeout - The duration (in milliseconds) to wait before switching to the `after` element.
 * @returns The current JSX element, which will be `before` initially and `after` after the timeout.
 *
 * @example
 * ```typescript
 * const MyComponent = () => {
 *   const element = useTimeoutElement(
 *     <div>Loading...</div>,
 *     <div>Loaded!</div>,
 *     3000
 *   );
 *
 *   return <div>{element}</div>;
 * };
 * ```
 */
export function useTimeoutElement(before: JSX.Element, after: JSX.Element, timeout: number) {
    const [element, setElement] = useState(before);

    useEffect(() => {
        const timer = setTimeout(() => {
            setElement(after);
        }, timeout);

        return () => clearTimeout(timer);
    }, [after, before, timeout]);

    return element;
}

/**
 * A React hook that ensures the provided disposable resource is properly disposed of
 * when the component is unmounted.
 *
 * @param disposable - The resource to be disposed of, which can be either a `Disposable`
 * or an `AsyncDisposable`. The resource must implement either the `Symbol.dispose` or
 * `Symbol.asyncDispose` method.
 *
 * @example
 * ```typescript
 * const MyComponent = () => {
 *   const disposableResource = useMemo(() => createDisposableResource(), []);
 *   withDisposable(disposableResource);
 *   
 *   return <div>My Component</div>;
 * };
 * ```
 */
export function useDisposable(disposable: Disposable | AsyncDisposable) {
    useEffect(() => {
        return () => {
            if (!!disposable[Symbol.dispose]) {
                disposable[Symbol.dispose]();
            } else if (!!disposable[Symbol.asyncDispose]) {
                disposable[Symbol.asyncDispose]();
            }
        }
    }, [])
}