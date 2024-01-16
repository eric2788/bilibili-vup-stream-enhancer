import { getNestedValue, setNestedValue } from "~utils/misc";
import storage, { getSettingStorage, setSettingStorage } from "~utils/storage";
import migrations, { addMigrationMapping, type MV2Settings, type MV2SettingsMapping } from "./schema";


addMigrationMapping('regex', 'settings.features', 'jimaku.danmakuZone.regex')

// TODO: add more mappings







async function migrateFromMV2(): Promise<void> {
    // reference: https://github.com/eric2788/bilibili-vup-stream-enhancer/blob/3a2cb04b3ddd6473e901c16b64da1fb3f5cdc132/src/utils/misc.js#L11C1-L76C2
    const mv2Settings = await storage.get<MV2Settings>('settings')
    if (!mv2Settings) return
    const migratableKeys = Object.keys(migrations) as (keyof MV2SettingsMapping)[]
    for (const mv2Key of migratableKeys) {
        const { key: settingKey, value: schemaKey } = migrations[mv2Key]
        console.info(`Migrating ${mv2Key} to ${settingKey}.${schemaKey}`)
        const value = getNestedValue(mv2Settings, mv2Key)
        const existedValue = await getSettingStorage(settingKey)
        setNestedValue(existedValue, schemaKey, value)
        await setSettingStorage(settingKey, existedValue)
        console.info(`Migrated ${mv2Key} to ${settingKey}.${schemaKey}`)
    }
}


export default migrateFromMV2