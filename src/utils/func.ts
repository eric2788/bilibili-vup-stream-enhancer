import type { InjectableFunction, InjectableFunctionParameters, InjectableFunctionType } from "~background/functions"


/**
 * Creates a higher-order function that flattens the execution of the provided function.
 * 
 * @template T - The type of the provided function.
 * @template R - The type of the parameters of the provided function.
 * @param fn - The function to be flattened.
 * @param args - The arguments to be passed to the function.
 * @returns A function that, when called, executes the provided function with the given arguments.
 * 
 * @example
 * // Define a function
 * function add(a: number, b: number): number {
 *   return a + b;
 * }
 * 
 * // Create a flattened function
 * const flattenedAdd = flat(add, 2, 3);
 * 
 * // Call the flattened function
 * const result = flattenedAdd(); // Returns 5
 */
export function flat<T extends (...args: any[]) => any, R extends Parameters<T>>(fn: T, ...args: R): () => ReturnType<T> {
    return () => fn(...args)
}


/**
 * Wraps a function and returns a new function that, when called, invokes the original function
 * with the provided arguments and returns a function that, when called, invokes the original function
 * with the original arguments and returns the original function's return value.
 * 
 * @template T - The type of the original function.
 * @template R - The type of the arguments of the original function.
 * @param {T} fn - The original function to wrap.
 * @returns {(...args: R) => (() => ReturnType<T>)} - The wrapped function.
 * 
 * @example
 * // Define a function
 * function add(a: number, b: number): number {
 *   return a + b;
 * }
 * 
 * // Wrap the function
 * const wrappedAdd = wrap(add);
 * 
 * // Invoke the wrapped function
 * const result = wrappedAdd(2, 3);
 * console.log(result()); // Output: 5
 */
export function wrap<T extends (...args: any[]) => any, R extends Parameters<T>>(fn: T): (...args: R) => (() => ReturnType<T>) {
    return (...args: R) => flat(fn, ...args)
}


/**
 * Creates an injectable function that can be used for background sendMessagers.
 * @param key - The key representing the injectable function.
 * @returns A function that takes arguments and returns an injectable function.
 * @example
 * // Define an injectable function
 * const myFunction = inject('myFunction');
 * 
 * // Use the injectable function
 * const result = myFunction('arg1', 'arg2');
 * 
 * // Then run it for background sendMessagers
 * const result = await sendMessager('inject-func', { function: result });
 */
export function inject<K extends InjectableFunctionType>(key: K): (...args: InjectableFunctionParameters<K>) => InjectableFunction<K> {
    return (...args) => ({ name: key as K, args })
}


export default {
    flat,
    wrap,
    inject
}