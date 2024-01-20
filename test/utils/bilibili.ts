


export async function getLiveRooms(page: number = 1): Promise<any> {
    const res = await fetch(`https://api.live.bilibili.com/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=9&area_id=0&sort_type=online&page=${page}`)
    if (!res.ok) throw new Error(`failed to fetch bilibili live room list: ${res.statusText}`)
    const data = await res.json()
    if (data.code !== 0) throw new Error(`failed to fetch bilibili live room list: ${data.message}`)
    return data.data.list
}