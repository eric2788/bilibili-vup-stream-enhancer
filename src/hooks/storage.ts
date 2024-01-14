import { useStorage as useStorageApi } from '@plasmohq/storage/hook'
import { useState, useEffect } from 'react'
import { Storage, type StorageCallbackMap } from '@plasmohq/storage'
import { storage } from '~utils/storage'

type Setter<T> = ((v?: T, isHydrated?: boolean) => T) | T

export const useStorage = <T extends object>(key: string, onInit?: Setter<T>) => useStorageApi<T>({ key, instance: storage }, onInit)


/**
 * Custom hook for watching changes in browser storage and returning the watched value.
 * 
 * @template T - The type of the value stored in the storage.
 * @param {string} key - The key used to store the value in the storage.
 * @param {"sync" | "local" | "managed" | "session"} area - The storage area to watch for changes.
 * @param {T} [defaultValue] - The default value to be returned if the value is not found in the storage.
 * @returns {T} - The watched value from the storage.
 * 
 * @example
 * // Watching changes in "sync" storage for the key "myKey" with a default value of 0
 * const watchedValue = useStorageWatch<number>("myKey", "sync", 0);
 */
export function useStorageWatch<T = any>(key: string, area: "sync" | "local" | "managed" | "session", defaultValue?: T): T {
    if (process.env.PLASMO_BROWSER === 'firefox') {
        area = 'local' // firefox doesn't support session storage
    }
    const storage = new Storage({ area })
    const [watchedValue, setWatchedValue] = useState(defaultValue)
    const watchCallback: StorageCallbackMap = {
        [key]: (value, ar) => ar === area && setWatchedValue(value.newValue)
    }
    useEffect(() => {
        storage.get<T>(key)
            .then(value => setWatchedValue(value))
            .catch(() => console.error(`Failed to get ${key} from ${area} storage`))
        storage.watch(watchCallback)
        return () => {
            storage.unwatch(watchCallback)
        }
    }, [])
    return watchedValue
}