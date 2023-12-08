
type HexColor = `#${string}`
type Optional<T> = T | undefined

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type NumRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | T

type HundredNumber = NumRange<0, 100> 