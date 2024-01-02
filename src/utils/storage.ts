import { Storage } from "@plasmohq/storage"
import fragments, { type Schema, type SettingFragments } from "~settings"

export const storage = new Storage({area: 'sync'})
export const localStorage = new Storage({ area: 'local' })


export async function getSettingStorage<K extends keyof SettingFragments, V extends Schema<SettingFragments[K]>>(key: K): Promise<V> {
    const { defaultSettings } = fragments[key]
    const result = await storage.get<V>(key)
    return { ...defaultSettings, ...result }
}

export async function setSettingStorage<K extends keyof SettingFragments, V extends Schema<SettingFragments[K]>>(key: K, value: V): Promise<void> {
    return storage.set(key, value)
}


export default storage