import { type BaseResponse, type CommonResponse, type V1Response } from "~types/bilibili"
import { sleep } from "./misc"

export async function fetchSameOrigin<T extends object = any>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'same-origin' })
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  return await res.json() as T
}


const defaultHandle = <R extends CommonResponse<any>>(data: R) => {
  if (data.code != 0) {
    throw new Error(`B站API请求错误: ${data.message}`)
  }
}

export function fetchSameOriginWith<R extends CommonResponse<any>>(validate: (b: R, url: string) => void = defaultHandle): <T = any>(url: string) => Promise<T> {
  return async <T = any>(url: string) => {
    const data = await fetchSameOrigin<R>(url)
    validate(data, url)
    return data.data as T
  }
}

export const fetchSameOriginBase = fetchSameOriginWith<BaseResponse<any>>()
export const fetchSameOriginV1 = fetchSameOriginWith<V1Response<any>>()


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
      info.onRetry ? info.onRetry(err) : console.warn(`請求錯誤，5秒後重試`, err)
      await sleep(5000)
      retryTimes++
    }
  }
}


export async function withFallbacks<T>(jobs: (() => Promise<T>)[], defaultValue: T | undefined = undefined): Promise<T | undefined> {
  for (const job of jobs) {
    try {
      return await job()
    } catch (err: Error | any) {
      console.warn('請求錯誤', err, ', 5秒後嘗試下一個')
      await sleep(5000)
    }
  }
  console.warn('所有請求都失敗了，返回預設值')
  return defaultValue
}

export async function catcher<T>(job: Promise<T>, defaultValue: (T | undefined) | ((err: Error | any) => (T | undefined)) = undefined): Promise<T | undefined> {
  try {
    return await job
  } catch (err: Error | any) {
    console.warn('got', err, ', returning defaultValue')
    if (defaultValue instanceof Function) {
      return defaultValue(err)
    } else {
      return defaultValue as T
    }
  }
}

export async function retryCatcher<T>(job: () => Promise<T>, maxTimes: number = 3, defaultValue: T | undefined = undefined): Promise<T | undefined> {
  return await catcher(withRetries(job, maxTimes))
}