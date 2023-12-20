import { type V1Response } from "~types/bilibili"

export async function fetchSameOrigin<T = any>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'same-origin' })
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  return await res.json() as T
}

export async function fetchSameOriginV1<T extends object = any>(url: string): Promise<T> {
  const data = await fetchSameOrigin<V1Response<T>>(url)
  if (data.code != 0) {
    throw new Error(`B站API请求错误: ${data.message}`)
  }
  return data as T
}

export async function getPageVariable(name: string, tabId: number): Promise<any> {
  const [{ result }] = await chrome.scripting.executeScript({
    func: name => window[name],
    args: [name],
    target: {
      tabId: tabId ??
        (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id
    },
    world: 'MAIN',
  });
  return result;
}


export async function withRetries<T>(
  job: () => Promise<T>,
  info: {
    onRetry?: (err: Error | any) => void,
    onFinalErr?: (err: Error | any) => void
  },
  maxTiems: number): Promise<T> {

  let retryTimes = 0

  while (retryTimes < maxTiems) {
    try {
      return await job()
    } catch (err: Error | any) {
      console.warn(err)
      if (retryTimes === maxTiems - 1) {
        info.onFinalErr?.(err)
        throw err
      }
      info.onRetry?.(err)
      retryTimes++
    }
  }
}