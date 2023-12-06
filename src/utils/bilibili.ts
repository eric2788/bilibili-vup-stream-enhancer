export async function fetchSameOrigin<T = any>(url: string): Promise<T> {
    const res = await fetch(url, { credentials: 'same-origin' })
    if (!res.ok){
        throw new Error(res.statusText)
    }
    const data = await res.json()
    if (data.code != 0){
        throw new Error(`B站API请求错误: ${data.message}`)
    }
    return data as T
}