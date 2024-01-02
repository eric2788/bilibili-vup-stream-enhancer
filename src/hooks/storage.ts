import { useStorage as useStorageApi } from '@plasmohq/storage/hook'
import { useState, useEffect } from 'react'
import { Storage, type StorageCallbackMap } from '@plasmohq/storage'
import { storage } from '~utils/storage'

type Setter<T> = ((v?: T, isHydrated?: boolean) => T) | T

export const useStorage = <T extends object>(key: string, onInit?: Setter<T>) => useStorageApi<T>({ key, instance: storage }, onInit)


export function useStorageWatch<T = any>(key: string, area: "sync" | "local" | "managed" | "session", defaultValue?: T): T {
    const storage = new Storage({ area })
    const [watchedValue, setWatchedValue] = useState(defaultValue)
    const watchCallback: StorageCallbackMap = {
        [key]: (value, ar) => ar === area && setWatchedValue(value.newValue)
    } 
    useEffect(() => {
        storage.watch(watchCallback)
        return () => {
            storage.unwatch(watchCallback)
        }
    }, [])
    return watchedValue
}