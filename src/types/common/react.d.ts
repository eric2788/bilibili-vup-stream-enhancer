export type MaybeRef<T> = T | React.RefObject<T>

export type UseState<T> = [T, React.Dispatch<React.SetStateAction<T>>]