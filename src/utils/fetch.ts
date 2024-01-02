import { type BaseResponse, type V1Response } from "~types/bilibili"
import { sleep } from "./misc"

export async function fetchSameOrigin<T extends object = any>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'same-origin' })
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  return await res.json() as T
}

export function fetchSameOriginWith<B extends object>(validate: (b: B, url: string) => void): <T extends object = any>(url: string) => Promise<T> {
  return async <T extends object = any>(url: string) => {
    const data = await fetchSameOrigin<B>(url)
    validate(data, url)
    return data as T
  }
}

const fetchSameOriginBase = fetchSameOriginWith<BaseResponse<any>>((data, url) => {
  if (data.code != 0) {
    throw new Error(`B站API请求错误: ${data.message}`)
  }
})

const fetchSameOriginV1 = fetchSameOriginWith<V1Response<any>>((data, url) => {
  if (data.code != 0) {
    throw new Error(`B站API请求错误: ${data.message}`)
  }
})



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


/**
 * Executes a job with retries.
 * @param job - The job to be executed, which returns a promise.
 * @param maxTimes - The maximum number of times to retry the job.
 * @param info - Additional information for handling retries.
 * @param info.onRetry - Optional callback function to be called when a retry occurs.
 * @param info.onFinalErr - Optional callback function to be called when all retries fail.
 * @returns A promise that resolves with the result of the job.
 * @throws If the job fails after all retries.
 */
export async function withRetries<T>(
  job: () => Promise<T>,
  maxTimes: number,
  info: {
    onRetry?: (err: Error | any) => void,
    onFinalErr?: (err: Error | any) => void
  } = {}
): Promise<T> {

  let retryTimes = 0

  while (retryTimes < maxTimes) {
    try {
      return await job()
    } catch (err: Error | any) {
      if (retryTimes === maxTimes - 1) {
        info.onFinalErr ? info.onFinalErr(err) : console.error(`重試${maxTimes}次后依然錯誤，已略過`, err)
        throw err
      }
      info.onRetry ? info.onRetry(err) : console.warn(`請求錯誤，3秒後重試`, err)
      await sleep(3000)
      retryTimes++
    }
  }
}

export async function catcher<T>(job: Promise<T>, defaultValue: T | undefined = undefined): Promise<T | undefined> {
  try {
    return await job
  } catch (err: Error | any) {
    console.warn('got', err, ', returning undefined')
    return defaultValue
  }
}

export async function retryCatcher<T>(job: () => Promise<T>, maxTimes: number = 3, defaultValue: T | undefined = undefined): Promise<T | undefined> {
  return await catcher(withRetries(job, maxTimes))
}