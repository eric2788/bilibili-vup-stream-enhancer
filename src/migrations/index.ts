import { getNestedValue, setNestedValue } from "~utils/misc";
import storage, { getFullSettingStroage, getSettingStorage, setSettingStorage } from "~utils/storage";
import migrations, { addMigrationMapping, addMigrationTransfer, type MV2Settings, type MV2SettingsMapping } from "./schema";
import type { FeatureType } from "~features";
import type { Settings } from "~settings";
import fragments from "~settings";


addMigrationMapping('regex', 'settings.features', 'jimaku.danmakuZone.regex')
addMigrationMapping('opacity', 'settings.features', 'jimaku.danmakuZone.opacity')
addMigrationMapping('color', 'settings.features', 'jimaku.danmakuZone.color')
addMigrationMapping('hideJimakuDanmaku', 'settings.features', 'jimaku.danmakuZone.hide')
addMigrationMapping('vtbOnly', 'settings.features', 'common.onlyVtuber')
addMigrationTransfer('record', 'settings.features', 'enabledRecording', (v) => (v ? ['superchat', 'jimaku'] : []) as FeatureType[])
addMigrationMapping('backgroundSubtitleOpacity', 'settings.features', 'jimaku.jimakuZone.backgroundOpacity')
addMigrationMapping('backgroundColor', 'settings.features', 'jimaku.jimakuZone.backgroundColor')
addMigrationMapping('backgroundHeight', 'settings.features', 'jimaku.jimakuZone.backgroundHeight')
addMigrationMapping('tongchuanMans', 'settings.features', 'jimaku.listingZone.tongchuanMans')
addMigrationMapping('tongchuanBlackList', 'settings.features', 'jimaku.listingZone.tongchuanBlackList')
addMigrationMapping('subtitleColor', 'settings.features', 'jimaku.jimakuZone.color')
addMigrationMapping('blacklistRooms', 'settings.listings', 'blackListRooms')
addMigrationMapping('useAsWhitelist', 'settings.listings', 'useAsWhiteListRooms')
addMigrationMapping('subtitleSize', 'settings.features', 'jimaku.jimakuZone.size')
addMigrationMapping('firstSubtitleSize', 'settings.features', 'jimaku.jimakuZone.firstLineSize')
addMigrationMapping('lineGap', 'settings.features', 'jimaku.jimakuZone.lineGap')
addMigrationMapping('jimakuAnimation', 'settings.features', 'jimaku.jimakuZone.animation')
addMigrationMapping('jimakuPosition', 'settings.features', 'jimaku.jimakuZone.position')
addMigrationMapping('webSocketSettings.danmakuPosition', 'settings.features', 'jimaku.danmakuZone.position')
addMigrationMapping('useStreamingTime', 'settings.features', 'common.useStreamingTime')
addMigrationMapping('buttonSettings.backgroundListColor', 'settings.features', 'jimaku.buttonZone.backgroundListColor')
addMigrationMapping('buttonSettings.backgroundColor', 'settings.features', 'jimaku.buttonZone.backgroundColor')
addMigrationMapping('buttonSettings.textColor', 'settings.features', 'jimaku.buttonZone.textColor')
addMigrationMapping('filterCNV', 'settings.features', 'jimaku.noNativeVtuber')
addMigrationTransfer('recordSuperChat', 'settings.features', 'enabledFeatures', (v) => (v ? ['superchat', 'jimaku'] : ['jimaku']) as FeatureType[])
addMigrationMapping('enableRestart', 'settings.display', 'restartButton')
addMigrationMapping('enableJimakuPopup', 'settings.features', 'jimaku.jimakuPopupWindow')
addMigrationMapping('enableStreamPopup', 'settings.features', 'common.monitorWindow')
addMigrationMapping('filterLevel', 'settings.features', 'jimaku.jimakuZone.filterUserLevel')
addMigrationTransfer('useLegacy', 'settings.capture', 'captureMechanism', (v) => v ? 'dom' : 'websocket')
addMigrationTransfer('hideBlackList', 'settings.display', 'blackListButton', v => !v)
addMigrationTransfer('hideSettingBtn', 'settings.display', 'settingsButton', v => !v)
addMigrationMapping('themeToNormal', 'settings.display', 'themeToNormalButton')
addMigrationMapping('developer.elements.upperButtonArea', 'settings.developer', 'elements.upperButtonArea')
addMigrationMapping('developer.elements.danmakuArea', 'settings.developer', 'elements.danmakuArea')
addMigrationMapping('developer.elements.userId', 'settings.developer', 'elements.userName')
addMigrationMapping('developer.elements.jimakuArea', 'settings.developer', 'elements.jimakuArea')
addMigrationMapping('developer.elements.jimakuFullArea', 'settings.developer', 'elements.jimakuFullArea')
addMigrationMapping('developer.elements.videoArea', 'settings.developer', 'elements.videoArea')
addMigrationMapping('developer.elements.liveTitle', 'settings.developer', 'elements.liveTitle')
addMigrationMapping('developer.elements.chatItems', 'settings.developer', 'elements.chatItems')
addMigrationMapping('developer.elements.newMsgButton', 'settings.developer', 'elements.newMsgButton')
addMigrationMapping('developer.classes.screenWeb', 'settings.developer', 'classes.screenWeb')
addMigrationMapping('developer.classes.screenFull', 'settings.developer', 'classes.screenFull')
addMigrationMapping('developer.attr.chatDanmaku', 'settings.developer', 'attr.chatDanmaku')
addMigrationMapping('developer.attr.chatUserId', 'settings.developer', 'attr.chatUserId')



async function migrateFromMV2(): Promise<Settings> {
    // reference: https://github.com/eric2788/bilibili-vup-stream-enhancer/blob/3a2cb04b3ddd6473e901c16b64da1fb3f5cdc132/src/utils/misc.js#L11C1-L76C2
    const mv2Settings = await getMV2Settings()
    if (!mv2Settings) return undefined
    const migratableKeys = Object.keys(migrations) as (keyof MV2SettingsMapping)[]
    for (const mv2Key of migratableKeys) {
        const { key: settingKey, value: schemaKey, transfer } = migrations[mv2Key]
        const value = getNestedValue(mv2Settings, mv2Key)
        const existedValue = await getSettingStorage(settingKey)
        setNestedValue(existedValue, schemaKey, transfer ? transfer(value) : value)
        await setSettingStorage(settingKey, existedValue)
        console.info(`Migrated ${mv2Key} to ${settingKey}.${schemaKey}`)
    }
    return await getFullSettingStroage()
}

export async function getMV2Settings(): Promise<MV2Settings> {
    const mv2 = await chrome.storage.sync.get()
    const clone = { ...mv2 }
    for (const newKey in fragments) {
        delete clone[newKey]
    }
    if (Object.keys(clone).length === 0) return undefined
    return clone as MV2Settings
}

export async function removeAllMV2Settings(): Promise<void> {
    const mv2 = await getMV2Settings()
    if (!mv2) return
    await chrome.storage.sync.remove(Object.keys(mv2))
}

export default migrateFromMV2