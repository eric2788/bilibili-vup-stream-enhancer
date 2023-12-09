export type Paths<T> = T extends object ? { [K in keyof T]:
    `${Exclude<K, symbol>}${"" | `.${Paths<T[K]>}`}`
}[keyof T] : never

export type Leaves<T> = T extends object ? { [K in keyof T]:
    `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? "" : `.${Leaves<T[K]>}`}`
}[keyof T] : never

export type LeafType<T, P extends Leaves<T>> =
    P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
    ? Rest extends Leaves<T[Key]>
    ? LeafType<T[Key], Rest>
    : never
    : never
    : P extends keyof T
    ? T[P]
    : never;

export type PickLeaves<T, V> = {
    [K in Leaves<T>]: LeafType<T, K> extends V ? K : never
}[Leaves<T>];