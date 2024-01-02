export * from './room-info'
export * from './spec-area-rank'
export * from './stream-url'
export * from './room-init'
export * from './web-interface-nav'
export * from './wbi-acc-info'

export interface CommonResponse<T extends object> {
    code: number
    message: string
    data?: T
}

export interface V1Response<T extends object> extends CommonResponse<T> {
    ttl: number
}


export interface BaseResponse<T extends object> extends CommonResponse<T> {
    msg: string
}
