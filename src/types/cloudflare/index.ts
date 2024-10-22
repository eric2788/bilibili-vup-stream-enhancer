export * from './workers-ai'

export type Result<T> = {
    success: boolean
    result: T
    errors: { code: number, message: string}[]
    messages: string[]
}