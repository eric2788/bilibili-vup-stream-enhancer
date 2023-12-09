export type HexColor = `#${string}`
export type Optional<T> = T | undefined

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

export type NumRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | T

export type HundredNumber = NumRange<0, 100>
