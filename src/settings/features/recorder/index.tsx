import type { ExposeHandler, StateHandler, StateProxy } from "~hooks/binding"
import type { FeatureSettingsDefinition } from ".."
import { Fragment } from "react"
import { HotKeyInput, type HotKey } from "~settings/components/HotKeyInput"
import Selector from "~settings/components/Selector"

export const title: string = '快速切片'

export const define: FeatureSettingsDefinition = {
    offlineTable: false
}

export type FeatureSettingSchema = {
    duration: number
    recordFix: 'copy' | 'reencode'
    hotkeyClip: HotKey
}

export const defaultSettings: Readonly<FeatureSettingSchema> = {
    duration: 10,
    recordFix: 'copy',
    hotkeyClip: {
        key: 'z',
        ctrlKey: true,
        shiftKey: false,
    }
}

export function RecorderFeatureSettings({ state, useHandler }: StateProxy<FeatureSettingSchema>): JSX.Element {

    const onChangeHotKey = (key: HotKey) => {
        state.hotkeyClip.key = key.key
        state.hotkeyClip.ctrlKey = key.ctrlKey
        state.hotkeyClip.shiftKey = key.shiftKey
    }

    return (
        <Fragment>
            <Selector<typeof state.recordFix>
                label="录制后编译方式"
                value={state.recordFix}
                onChange={e => state.recordFix = e}
                options={[
                    { value: 'copy', label: '快速编译 (可能不完整)' },
                    { value: 'reencode', label: '完整编译 (速度极慢)' }
                ]}
            />
            <Selector<number>
                label="录制方式"
                value={state.duration}
                onChange={e => state.duration = e}
                options={[
                    { value: 5, label: '前5分钟' },
                    { value: 10, label: '前10分钟' },
                    { value: 15, label: '前15分钟' },
                    { value: -1, label: '即时录制' }
                ]}
            />
            <div>
                <HotKeyInput
                    label="快速切片热键"
                    value={state.hotkeyClip}
                    onChange={onChangeHotKey}
                />
            </div>
        </Fragment>
    )
}

export default RecorderFeatureSettings