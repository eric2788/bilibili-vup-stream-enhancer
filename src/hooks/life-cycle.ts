import { useEffect, useState, useMemo, useRef } from 'react';

/**
 * Hook to run an async effect on mount and another on unmount.
 * 
 * edited from: https://marmelab.com/blog/2023/01/11/use-async-effect-react.html
 */
export const useAsyncEffect = <R = void>(
    mountCallback: () => Promise<R>,
    unmountCallback: (r: R) => Promise<void>,
    deps: any[] = [],
): UseAsyncEffectResult => {
    const isMounted = useRef(false);
    const [error, setError] = useState<unknown>(undefined);

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
                if (isMounted.current && !ignore) {
                    setError(undefined);
                } else {
                    // Component was unmounted before the mount callback returned, cancel it
                    unmountCallback(cleaner);
                }
            } catch (error) {
                if (!isMounted.current) return;
                setError(error);
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
                        setError(error);
                    });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return useMemo(() => ({ error }), [error]);
};

export interface UseAsyncEffectResult {
    error: any;
}