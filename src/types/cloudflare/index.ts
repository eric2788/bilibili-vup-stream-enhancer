export * from './workers-ai'

export type Result<T> = {
    success: boolean
    result: T
    errors: string[]
    messages: string[]
}