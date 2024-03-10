import type { Schema, SettingFragments } from "~settings"
import type { Leaves, PathLeafType, PickLeaves } from "~types/common";

export interface MV2Settings {
    regex: string;
    opacity: number;
    color: string;
    hideJimakuDanmaku: boolean;
    vtbOnly: boolean;
    record: boolean;
    backgroundSubtitleOpacity: number;
    backgroundColor: string;
    backgroundHeight: number;
    tongchuanMans: string[];
    tongchuanBlackList: string[];
    subtitleColor: string;
    blacklistRooms: string[];
    useAsWhitelist: boolean;
    subtitleSize: number;
    firstSubtitleSize: number;
    lineGap: number;
    jimakuAnimation: string;
    jimakuPosition: string;
    webSocketSettings: {
        danmakuPosition: string;
    };
    useStreamingTime: boolean;
    buttonSettings: {
        backgroundListColor: string;
        backgroundColor: string;
        textColor: string;
    };
    filterCNV: boolean;
    autoCheckUpdate: boolean;
    recordSuperChat: boolean;
    enableRestart: boolean;
    enableJimakuPopup: boolean;
    enableStreamPopup: boolean;
    filterLevel: number;
    useLegacy: boolean;
    hideBlackList: boolean;
    hideSettingBtn: boolean;
    themeToNormal: boolean;
    useRemoteCDN: boolean;
    developer: {
        elements: {
            upperButtonArea: string;
            danmakuArea: string;
            userId: string;
            jimakuArea: string;
            jimakuFullArea: string;
            videoArea: string;
            liveTitle: string;
            chatItems: string;
            newMsgButton: string;
        };
        classes: {
            screenWeb: string;
            screenFull: string;
        };
        attr: {
            chatUserId: string;
            chatDanmaku: string;
        };
        code: {
            scList: string;
        };
    };
}

export type MV2SettingsKey = Leaves<MV2Settings>

export type SchemaMirror = {
    key: keyof SettingFragments
    value: Leaves<Schema<SettingFragments[keyof SettingFragments]>>
    transfer?: (v: any) => any
}


export type MV2SettingsMapping = {
    [K in Leaves<MV2Settings>]: SchemaMirror
}

const mapping: Partial<MV2SettingsMapping> = {}

export function addMigrationMapping<
    K extends Leaves<MV2Settings>,
    S extends keyof SettingFragments,
    L extends PickLeaves<Schema<SettingFragments[S]>, PathLeafType<MV2Settings, K>>
>(
    mv2Key: K,
    schemaKey: S,
    value: L
) {
    mapping[mv2Key] = {
        key: schemaKey,
        value: value as Leaves<Schema<SettingFragments[S]>>
    }
}

export function addMigrationTransfer<
    K extends Leaves<MV2Settings>,
    S extends keyof SettingFragments,
    L extends Leaves<Schema<SettingFragments[S]>>
>(
    mv2Key: K,
    schemaKey: S,
    value: L,
    transfer: (v: PathLeafType<MV2Settings, K>) => PathLeafType<Schema<SettingFragments[S]>, L>
) {
    mapping[mv2Key] = {
        key: schemaKey,
        value,
        transfer
    }
}

export default mapping as Readonly<typeof mapping>