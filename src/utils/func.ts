


export function flat<T extends (...args: any[]) => any, R extends Parameters<T>>(fn: T, ...args: R): () => ReturnType<T> {
    return () => fn(...args)
}

export function wrap<T extends (...args: any[]) => any, R extends Parameters<T>>(fn: T): (...args: R) => (() => ReturnType<T>) {
    return (...args: R) => flat(fn, ...args)
}



export default {
    flat,
    wrap
}