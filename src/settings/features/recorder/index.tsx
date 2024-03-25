import type { StateProxy } from "~hooks/binding"
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
    mechanism: 'ffmpeg' | 'fetch-buffer'
    hotkeyClip: HotKey
}

export const defaultSettings: Readonly<FeatureSettingSchema> = {
    duration: 10,
    mechanism: 'ffmpeg',
    hotkeyClip: {
        key: 'KeyC',
        ctrlKey: true,
        shiftKey: false,
    }
}

export function RecorderFeatureSettings({ state, useHandler }: StateProxy<FeatureSettingSchema>): JSX.Element {
    

    return (
        <Fragment>
            <Selector<typeof state.mechanism>
                label="录制方式"
                value={state.mechanism}
                onChange={e => state.mechanism = e}
                options={[
                    { value: 'ffmpeg', label: 'FFmpeg' },
                    { value: 'fetch-buffer', label: 'Fetch Buffer' }
                ]}
            />
            <Selector<number>
                label="录制时长"
                value={state.duration}
                onChange={e => state.duration = e}
                options={[
                    { value: 5, label: '5分钟' },
                    { value: 10, label: '10分钟' },
                    { value: 15, label: '15分钟' },
                ]}
            />
            <div>
                <HotKeyInput
                    label="快速切片热键"
                    value={state.hotkeyClip}
                    onChange={e => state.hotkeyClip = e}
                />
            </div>
        </Fragment>
    )
}

export default RecorderFeatureSettings