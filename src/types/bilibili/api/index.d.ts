export * from './room-info'
export * from './spec-area-rank'
export * from './stream-url'
export * from './room-init'



export interface V1Response<T extends object> {
    code: number
    message: string
    ttl: number
    data?: T
}


export interface BaseResponse<T extends object> {
    code: number
    msg: string
    message: string
    data?: T
}
