import fragments, { type Schema, type SettingFragments, type Settings } from '~settings'
import { Storage } from '@plasmohq/storage'
import { assignDefaults } from './misc'

export const storage = new Storage({ area: 'sync' })
export const sessionStorage = new Storage({ area: 'session' })
export const localStorage = new Storage({ area: 'local' })


export async function getSettingStorage<K extends keyof SettingFragments, V extends Schema<SettingFragments[K]>>(key: K, withDefault: boolean = true): Promise<V> {
    const { defaultSettings } = fragments[key]
    const result = await storage.get<V>(key)
    if (withDefault) {
        assignDefaults(result, defaultSettings)
    }
    return result
}

export async function setSettingStorage<K extends keyof SettingFragments, V extends Schema<SettingFragments[K]>>(key: K, value: V): Promise<void> {
    return storage.set(key, value)
}

export async function getFullSettingStroage(): Promise<Settings> {
    const settings = await Promise.all(Object.keys(fragments).map(async (key: keyof SettingFragments) => {
        const setting = await getSettingStorage(key)
        return { [key]: setting }
    }))
    return Object.assign({}, ...settings)
}

export async function processing<T = void>(callback: () => Promise<T>): Promise<T> {
    await sessionStorage.set('processing', true)
    return callback().finally(() => sessionStorage.set('processing', false))
}

// create decirator version of transactions
export function withProcessingFlag<T extends (...args: any[]) => Promise<any>>(callback: T): T {
    return async function(...args: any[]) {
        await sessionStorage.set('processing', true)
        return callback(...args).finally(() => sessionStorage.set('processing', false))
    } as T
}

export default storage