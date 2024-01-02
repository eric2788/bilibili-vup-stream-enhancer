

/**
 * Represents the paths of an object's properties.
 * @template T - The type of the object.
 * @example
 * type MyObject = {
 *   foo: {
 *     bar: string;
 *   };
 * };
 * type MyPaths = Paths<MyObject>; // "foo" | "foo.bar"
 */
export type Paths<T> = T extends object ? { [K in keyof T]:
    `${Exclude<K, symbol>}${"" | `.${Paths<T[K]>}`}`
}[keyof T] : never;

/**
 * Represents the leaf properties of an object.
 * @template T - The type of the object.
 * @example
 * type MyObject = {
 *   foo: {
 *     bar: string;
 *   };
 *   baz: number;
 * };
 * type MyLeaves = Leaves<MyObject>; // "foo.bar" | "baz"
 */
export type Leaves<T> = T extends object ? { [K in keyof T]:
    `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? "" : `.${Leaves<T[K]>}`}`
}[keyof T] : never;

/**
 * Represents the type of a leaf property in an object given its path.
 * @template T - The type of the object.
 * @template P - The path of the leaf property.
 * @example
 * type MyObject = {
 *   foo: {
 *     bar: string;
 *   };
 *   baz: number;
 * };
 * type LeafType = PathLeafType<MyObject, "foo.bar">; // string
 */
export type PathLeafType<T, P extends Leaves<T> | Paths<T>> =
    P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
    ? Rest extends Leaves<T[Key]>
    ? PathLeafType<T[Key], Rest>
    : never
    : never
    : P extends keyof T
    ? T[P]
    : never;

/**
 * Picks the leaf properties of an object that have a specific value type.
 * @template T - The type of the object.
 * @template V - The value type to filter by.
 * @example
 * type MyObject = {
 *   foo: {
 *     bar: string;
 *   };
 *   baz: number;
 *   qux: {
 *     quux: boolean;
 *   };
 * };
 * type MyPickedLeaves = PickLeaves<MyObject, string>; // "foo.bar"
 */
export type PickLeaves<T, V> = {
    [K in Leaves<T>]: PathLeafType<T, K> extends V ? K : never
}[Leaves<T>];


/**
 * Returns the keys of an object `T` whose values are of type `V`.
 *
 * @template T - The object type.
 * @template V - The value type.
 * @param {T} obj - The object to pick keys from.
 * @returns {PickKeys<T, V>} - The keys of `obj` whose values are of type `V`.
 *
 * @example
 * // Example 1
 * type Person = {
 *   name: string;
 *   age: number;
 *   address: string;
 * };
 *
 * type StringKeys = PickKeys<Person, string>;
 * // StringKeys is "name" | "address"
 *
 * // Example 2
 * const obj = {
 *   a: 1,
 *   b: 'hello',
 *   c: true,
 * };
 *
 * type NumberKeys = PickKeys<typeof obj, number>;
 * // NumberKeys is "a"
 */
export type PickKeys<T extends object, V> = {
    [K in keyof T]: T[K] extends V ? K : never
}[keyof T];