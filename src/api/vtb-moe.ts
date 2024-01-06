import type { VtbMoeDetailResponse, VtbMoeListResponse } from "~types/bilibili"
import { sendRequest } from "~utils/fetch"

export async function getVupDetail(uid: string): Promise<VtbMoeDetailResponse | undefined> {
    try {
        return await sendRequest<VtbMoeDetailResponse>({
            url: `https://api.vtbs.moe/v1/detail/${uid}`,
            timeout: 5000
        })
    } catch (err: Error | any) {
        console.warn(err)
        return undefined
    }
}

export type VupResponse = {
    id: string
    name: string
    locale: string
}

export async function listAllVupUids(): Promise<VupResponse[]> {
    const res = await sendRequest<VtbMoeListResponse>({
        url: 'https://vdb.vtbs.moe/json/list.json',
        timeout: 5000
    })
    return res.vtbs.filter(v => v.type === 'vtuber').map(v => {
        const acc = v.accounts.find(acc => acc.platform == 'bilibili')
        return acc ? {
            id: acc.id,
            name: v.name[v.name.default],
            locale: v.name.default
        } : undefined
    }).filter(v => !!v)
}

export async function identifyVup(uid: string | number): Promise<VupResponse | undefined> {
    return (await listAllVupUids()).find(v => v.id === uid.toString())
}