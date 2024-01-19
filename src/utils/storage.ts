import fragments, { type Schema, type SettingFragments, type Settings } from '~settings'
import { Storage } from '@plasmohq/storage'
import { assignDefaults } from './misc'

export const storage = new Storage({ area: 'sync' })
export const sessionStorage = new Storage({ area: 'session' })
export const localStorage = new Storage({ area: 'local' })


/**
 * Retrieves a value from the setting storage.
 * 
 * @template K - The key type of the setting.
 * @template V - The value type of the setting.
 * @param key - The key of the setting to retrieve.
 * @param withDefault - Indicates whether to return the default value if the setting is not found. Default is true.
 * @returns A promise that resolves to the retrieved value from the setting storage.
 */
export async function getSettingStorage<K extends keyof SettingFragments, V extends Schema<SettingFragments[K]>>(key: K, withDefault: boolean = true): Promise<V> {
    const { defaultSettings } = fragments[key]
    const result = await storage.get<V>(key)
    if (withDefault) {
        return assignDefaults<V>(result, defaultSettings as V)
    }
    return result
}

/**
 * Sets the value of a setting in the storage.
 * @param key - The key of the setting.
 * @param value - The value to be set.
 * @returns A promise that resolves when the value is successfully set.
 */
export async function setSettingStorage<K extends keyof SettingFragments, V extends Schema<SettingFragments[K]>>(key: K, value: V): Promise<void> {
    return storage.set(key, value)
}

/**
 * Retrieves the full settings from storage.
 * @returns A promise that resolves to the full settings object.
 */
export async function getFullSettingStroage(): Promise<Settings> {
    const settings = await Promise.all(Object.keys(fragments).map(async (key: keyof SettingFragments) => {
        const setting = await getSettingStorage(key)
        return { [key]: setting }
    }))
    return Object.assign({}, ...settings)
}

/**
 * Executes a callback function while setting a processing flag in the session storage.
 * @param callback - The callback function to be executed.
 * @returns A promise that resolves to the result of the callback function.
 */
export async function processing<T = void>(callback: () => Promise<T>): Promise<T> {
    await sessionStorage.set('processing', true)
    return callback().finally(() => sessionStorage.set('processing', false))
}

// create decirator version of transactions
/**
 * Wraps a callback function with a processing flag.
 * @param callback - The callback function to be wrapped.
 * @returns The wrapped callback function.
 */
export function withProcessingFlag<T extends (...args: any[]) => Promise<any>>(callback: T): T {
    return async function(...args: any[]) {
        await sessionStorage.set('processing', true)
        return callback(...args).finally(() => sessionStorage.set('processing', false))
    } as T
}

export default storage