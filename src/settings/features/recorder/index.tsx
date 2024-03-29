import { List, Switch, Typography } from "@material-tailwind/react"
import { Fragment, type ChangeEvent } from "react"
import type { RecorderType } from "~features/recorder/recorders"
import type { StateProxy } from "~hooks/binding"
import { HotKeyInput, type HotKey } from "~settings/components/HotKeyInput"
import Selector from "~settings/components/Selector"
import type { FeatureSettingsDefinition } from ".."
import SwitchListItem from "~settings/components/SwitchListItem"
import type { PlayerType } from "~players"
import { toast } from "sonner/dist"

export const title: string = '快速切片'

export const define: FeatureSettingsDefinition = {
    offlineTable: false
}

export type FeatureSettingSchema = {
    duration: number
    outputType?: PlayerType
    recordFix: 'copy' | 'reencode'
    hotkeyClip: HotKey
    mechanism: RecorderType
    hiddenUI: boolean
    threads: number
    overflow: 'limit' | 'skip'
}

export const defaultSettings: Readonly<FeatureSettingSchema> = {
    duration: 5,
    outputType: 'hls',
    recordFix: 'copy',
    hotkeyClip: {
        key: 'x',
        ctrlKey: true,
        shiftKey: false,
    },
    mechanism: 'buffer',
    hiddenUI: false,
    threads: 0.5,
    overflow: 'limit'
}

export function RecorderFeatureSettings({ state, useHandler }: StateProxy<FeatureSettingSchema>): JSX.Element {

    const onChangeHotKey = (key: HotKey) => {
        state.hotkeyClip.key = key.key
        state.hotkeyClip.ctrlKey = key.ctrlKey
        state.hotkeyClip.shiftKey = key.shiftKey
    }

    const bool = useHandler<ChangeEvent<HTMLInputElement>, boolean>(e => e.target.checked)

    return (
        <Fragment>
            <Selector<typeof state.outputType>
                data-testid="record-output-type"
                label="输出格式"
                value={state.outputType}
                onChange={e => state.outputType = e}
                options={[
                    { value: 'hls', label: 'MP4' },
                    { value: 'flv', label: 'FLV' },
                    { value: undefined, label: '随机' }
                ]}
            />
            <Selector<typeof state.recordFix>
                data-testid="record-fix"
                label="录制后编译方式"
                value={state.recordFix}
                onChange={e => state.recordFix = e}
                options={[
                    { value: 'copy', label: '快速编译' },
                    { value: 'reencode', label: '完整编译 (速度较慢)' }
                ]}
            />
            <Selector<number>
                data-testid="record-duration"
                label="录制时长"
                value={state.duration}
                onChange={e => state.duration = e}
                options={[
                    { value: 5, label: '约前5分钟' },
                    { value: 10, label: '约前10分钟' },
                    { value: 15, label: '约前15分钟' },
                    { value: -1, label: '手动录制' }
                ]}
            />
            <Selector<typeof state.threads>
                data-testid="record-threads"
                label="最大线程占用"
                value={state.threads}
                disabled={state.recordFix !== 'reencode'}
                onChange={e => state.threads = e}
                options={[
                    { value: 0.15, label: '15%' },
                    { value: 0.25, label: '25%' },
                    { value: 0.35, label: '35%' },
                    { value: 0.45, label: '45%' },
                    { value: 0.5, label: '50%' },
                ]}
            />
            <Selector<typeof state.overflow> 
                data-testid="record-overflow"
                label="超出 2GB 大小时"
                value={state.overflow}
                onChange={e => state.overflow = e}
                options={[
                    { value: 'limit', label: '从前面的时间段裁减' },
                    { value: 'skip', label: '跳过 ffmpeg 编译 (资讯损坏状态)' }
                ]}
            />
            <div>
                <HotKeyInput
                    data-testid="record-hotkey"
                    label="快速切片热键"
                    value={state.hotkeyClip}
                    onChange={onChangeHotKey}
                />
            </div>
            <div>
                <Switch
                    data-testid="record-hide-ui"
                    crossOrigin="annoymous"
                    label={
                        <Fragment>
                            <Typography className="font-medium ml-3 flex items-center gap-2">
                                隐藏录制按钮
                            </Typography>
                            <Typography variant="small" className="font-normal ml-3">
                                隐藏后，你仍可通过热键使用本功能。
                            </Typography>
                        </Fragment>
                    }
                    checked={state.hiddenUI}
                    onChange={bool('hiddenUI')}
                />
            </div>
        </Fragment>
    )
}

export default RecorderFeatureSettings