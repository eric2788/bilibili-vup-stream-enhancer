import type { FeatureType } from "~contents/features"
import type { StateProxy } from "~hooks/binding"



export type SettingSchema = {
    enabledFeatures: FeatureType[],
    enableRecording: boolean,
    onlyVtuber: boolean,
    noNativeVtuber: boolean,
    jimakuPopupWindow: boolean, // only when enabledFeatures.includes('jimaku')
    monitorWindow: boolean,
    hideJimakuDanmaku: boolean,
    useStreamingTime: boolean
}


export const defaultSettings: Readonly<SettingSchema> = {
    enabledFeatures: ['jimaku', 'superchat'],
    enableRecording: false,
    onlyVtuber: false,
    noNativeVtuber: false,
    jimakuPopupWindow: false,
    monitorWindow: false,
    hideJimakuDanmaku: false,
    useStreamingTime: true
}


export const title = '功能设定'

function FeatureSettings({state, useHandler}: StateProxy<SettingSchema>): JSX.Element {
    return (
        <></>
    )
}