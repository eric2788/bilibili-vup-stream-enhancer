export * from './room-info'
export * from './spec-area-rank'
export * from './stream-url'



export interface V1Response<T extends object> {
    code: number
    message: string
    ttl: number
    data: T
}

