import type { BaseResponse, CommonResponse, V1Response } from '~types/bilibili'

import { sleep } from './misc'
import type { RequestBody } from '~background/messages/request'
import { sendMessager } from './messaging'
import { localStorage } from './storage'

/**
 * Fetches data from the specified URL with the same credentials.
 * @param url - The URL to fetch data from.
 * @returns A promise that resolves to the fetched data.
 * @throws An error if the response is not successful.
 */
export async function fetchSameCredential<T extends object = any>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  return await res.json() as T
}


const defaultHandle = <R extends CommonResponse<any>>(data: R) => {
  if (data.code != 0) {
    throw data
  }
}

/**
 * Returns a function that fetches data from the specified URL with the same credentials and validates the response.
 * @template R - The type of the response object.
 * @param validate - Optional. A function that validates the response object.
 * @returns A function that fetches data from the specified URL and returns a Promise of the response data.
 */
export function fetchSameCredentialWith<R extends CommonResponse<any>>(validate: (b: R, url: string) => void = defaultHandle): <T = any>(url: string) => Promise<T> {
  return async <T = any>(url: string) => {
    const data = await fetchSameCredential<R>(url)
    validate(data, url)
    return data.data as T
  }
}

export const fetchSameCredentialBase = fetchSameCredentialWith<BaseResponse<any>>()
export const fetchSameCredentialV1 = fetchSameCredentialWith<V1Response<any>>()


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
    onRetry?: (err: Error | any, times: number) => void,
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
      info.onRetry ? info.onRetry(err, retryTimes) : console.warn(`請求錯誤，5秒後重試`, err)
      await sleep(5000)
      retryTimes++
    }
  }
}


/**
 * Executes a series of asynchronous jobs with fallbacks.
 * If any job fails, it will wait for 5 seconds and then try the next job.
 * If all jobs fail, it will return the default value.
 *
 * @param jobs - An array of functions that return a Promise.
 * @param defaultValue - The default value to return if all jobs fail. Default is undefined.
 * @returns A Promise that resolves to the result of the successful job or the default value.
 */
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

/**
 * Executes a promise and catches any errors that occur.
 * If an error occurs, it returns a default value provided by the user.
 * 
 * @template T - The type of the promise result.
 * @param {Promise<T>} job - The promise to execute.
 * @param {(T | undefined) | ((err: Error | any) => (T | undefined))} [defaultValue=undefined] - The default value to return if an error occurs.
 * @returns {Promise<T | undefined>} - The result of the promise or the default value.
 */
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

/**
 * Retries the given job function a specified number of times and catches any errors.
 * @param job The job function to be executed.
 * @param maxTimes The maximum number of times to retry the job function. Default is 3.
 * @param defaultValue The default value to return if all retries fail. Default is undefined.
 * @returns A promise that resolves to the result of the job function, or the default value if all retries fail.
 */
export async function retryCatcher<T>(job: () => Promise<T>, maxTimes: number = 3, defaultValue: T | undefined = undefined): Promise<T | undefined> {
  return await catcher(withRetries(job, maxTimes))
}

/**
 * Sends a request via service worker.
 * This function should only be used in content scripts.
 * @param request - The request body.
 * @returns A promise that resolves to the response data.
 * @throws An error if the response contains an error.
 * @template T - The type of the response data.
 */
export async function sendRequest<T = any>(request: RequestBody): Promise<T> {
  const res = await sendMessager('request', request)
  if (res.error) throw new Error(res.error)
  return res.data as T
}


export type CacheInfo<T> = {
  data: T
  timestamp: number
}

/**
 * Fetches data from the specified URL and caches it.
 * If the data is already cached and not expired, it will return the cached data.
 * @param url - The URL to fetch data from.
 * @param maxAge - The maximum age of the cached data in milliseconds. Default is 1 hour.
 * @returns A promise that resolves to the fetched data.
 */
export async function fetchAndCache<T>(url: string, maxAge: number = 3600000): Promise<T> {
  const cache = await localStorage.get<CacheInfo<T>>(url)
  if (cache && Date.now() - cache.timestamp < maxAge) return cache.data
  const res = await fetch(url)
  if (!res.ok) throw await res.json()
  const data = await res.json() as T
  await localStorage.set(url, { data, timestamp: Date.now() })
  return data
}