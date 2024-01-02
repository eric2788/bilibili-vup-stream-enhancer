import { stateProxy } from 'react-state-proxy';

export type Loaders = Record<string, () => Promise<void>>

export type LoaderBinding<L extends Loaders> = [
    Record<keyof L, () => Promise<void>>,
    Readonly<Record<keyof L, boolean>>
]


/**
 * Custom hook that creates a loader binding for a set of loaders.
 * @template L - The type of the loaders object.
 * @param loaders - An object containing loader functions.
 * @param onCatch - Optional error handler function. Defaults to console.error.
 * @returns A tuple containing the loader functions and a loading state object.
 * @example
 * const [loader, loading] = useLoader({
 *   loadUsers: async () => {
 *     // Load users
 *   },
 *   loadPosts: async () => {
 *     // Load posts
 *   },
 * }, handleError);
 * 
 * // Usage
 * loader.loadUsers(); // Start loading users
 * 
 * if (loading.loadUsers) {
 *   // Show loading indicator for users
 * }
 */
export function useLoader<L extends Loaders>(loaders: L, onCatch: (e: Error | any) => void = console.error): LoaderBinding<L> {

    const loading = stateProxy(Object.keys(loaders)
        .reduce((acc, k: keyof L) =>
        ({
            ...acc,
            [k]: false
        })
            , {})) as { [key in keyof L]: boolean }

    const loader = Object.keys(loaders)
        .reduce((acc, k: keyof L) =>
        ({
            ...acc,
            [k]: async () => {
                try {
                    loading[k] = true
                    await loaders[k]()
                } catch (e: Error | any) {
                    onCatch(e)
                } finally {
                    loading[k] = false
                }
            }
        })
            , {}) as { [key in keyof L]: () => Promise<void> }

    return [loader, loading] as const
}

