import { Storage } from "@plasmohq/storage"
import fragments, { type Schema, type SettingFragments, type Settings } from "~settings"

export const storage = new Storage({ area: 'sync' })
export const localStorage = new Storage({ area: 'local' })


export async function getSettingStorage<K extends keyof SettingFragments, V extends Schema<SettingFragments[K]>>(key: K, withDefault: boolean = true): Promise<V> {
    const { defaultSettings } = fragments[key]
    const result = await storage.get<V>(key)
    return withDefault ? { ...defaultSettings, ...result } : result
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

export default storage