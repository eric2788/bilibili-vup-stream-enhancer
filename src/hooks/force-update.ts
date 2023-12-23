import { useState } from "react";


/**
 * Custom hook that returns a state and a function to force update the component.
 * This hook is useful when you want to trigger a re-render of the component
 * without changing any of its dependencies.
 *
 * @returns An array containing the state object and the force update function.
 * The state object can be used as a dependency in `useEffect`, `useCallback`,
 * `useMemo`, etc.
 *
 * @example
 * ```typescript
 * const [forceUpdateState, forceUpdate] = useForceUpdate();
 *
 * useEffect(() => {
 *   // This effect will be triggered whenever `forceUpdateState` changes.
 *   // You can use this to force a re-render of the component.
 * }, [forceUpdateState]);
 *
 * const handleClick = useCallback(() => {
 *   // This callback will be memoized and will only change when `forceUpdateState` changes.
 *   // You can use this to trigger a re-render of the component.
 *   forceUpdate();
 * }, [forceUpdateState]);
 *
 * const memoizedValue = useMemo(() => {
 *   // This value will be memoized and will only change when `forceUpdateState` changes.
 *   // You can use this to trigger a re-render of the component.
 *   return someExpensiveComputation();
 * }, [forceUpdateState]);
 * ```
 */
export function useForceUpdate(): [any, () => void] {
    const [deps, setDeps] = useState({})
    return [
        deps,
        () => setDeps({})
    ] as const
}

/**
 * Custom hook that returns a function to force re-rendering of a component.
 * 
 * @returns {() => void} The function to force re-rendering.
 * 
 * @example
 * // Usage
 * const forceRender = useForceRender();
 * 
 * // Call the function to force re-rendering
 * forceRender();
 */
export function useForceRender(): () => void {
    const [, forceUpdate] = useForceUpdate()
    return forceUpdate
}