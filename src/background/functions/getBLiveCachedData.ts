import type { GetInfoByRoomResponse, RoomInitResponse, V1Response } from "~types/bilibili"

// window.__NEPTUNE_IS_MY_WAIFU__
export type NeptuneIsMyWaifu = {
    'roomInfoRes': V1Response<GetInfoByRoomResponse>
    'roomInitRes': V1Response<RoomInitResponse>
}

export function getBLiveCachedData<K extends keyof NeptuneIsMyWaifu>(key: K): NeptuneIsMyWaifu[K] {
    return window['__NEPTUNE_IS_MY_WAIFU__']?.[key] as NeptuneIsMyWaifu[K]
}


export default getBLiveCachedData