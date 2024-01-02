export type HexColor = `#${string}`

export type Optional<T> = T | undefined

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

export type NumRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | T

export type HundredNumber = NumRange<0, 100>

export type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[]
  ? ElementType
  : never;


export type Primitive = string | number | boolean | bigint | symbol | null | undefined

export type Stringify<T> = `${T}`

export type PrimitiveType = Stringify<Primitive>

type ConvertToPrimitive<T extends PrimitiveType> = T extends 'string' ? string :
    T extends 'number' ? number :
    T extends 'boolean' ? boolean :
    T extends 'bigint' ? bigint :
    T extends 'symbol' ? symbol :
    T extends 'null' ? null :
    T extends 'undefined' ? undefined :
    never;