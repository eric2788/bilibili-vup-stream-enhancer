import { Switch, Typography } from "@material-tailwind/react"
import { Fragment, type ChangeEvent } from "react"
import type { RecorderType } from "~features/recorder/recorders"
import type { StateProxy } from "~hooks/binding"
import { HotKeyInput, type HotKey } from "~options/components/HotKeyInput"
import Selector from "~options/components/Selector"
import type { PlayerType } from "~players"
import type { FeatureSettingsDefinition } from ".."
import { toast } from "sonner/dist"

export const title: string = '快速切片'

export const define: FeatureSettingsDefinition = {
    offlineTable: false
}

export type FeatureSettingSchema = {
    duration: number
    outputType?: PlayerType
    recordFix: 'copy' | 'reencode'
    recordHotkey: HotKey
    screenshotHotkey: HotKey
    mechanism: RecorderType
    hiddenUI: boolean
    threads: number
    overflow: 'limit' | 'skip'
    autoSwitchQuality: boolean
}

export const defaultSettings: Readonly<FeatureSettingSchema> = {
    duration: 5,
    outputType: 'hls',
    recordFix: 'copy',
    recordHotkey: {
        key: 'x',
        ctrlKey: true,
        shiftKey: false,
    },
    screenshotHotkey: {
        key: 'v',
        ctrlKey: true,
        shiftKey: false,
    },
    mechanism: 'buffer',
    hiddenUI: false,
    threads: 0.5,
    overflow: 'limit',
    autoSwitchQuality: false
}

export function RecorderFeatureSettings({ state, useHandler }: StateProxy<FeatureSettingSchema>): JSX.Element {

    const validateKeyInConflict = (key: HotKey, type: 'record' | 'screenshot') => {
        const inputKey = key.key.toLowerCase()
        const currentKey = type === 'record' ? state.screenshotHotkey.key.toLowerCase() : state.recordHotkey.key.toLowerCase()
        console.debug('inputKey:', inputKey, 'currentKey:', currentKey)
        if (inputKey === currentKey) {
            toast.error('热键冲突: 快速切片热键与截图热键的主键不能相同。')
            return true
        }
        return false
    }

    const bool = useHandler<ChangeEvent<HTMLInputElement>, boolean>(e => e.target.checked)

    return (
        <Fragment>
            <Selector<typeof state.outputType>
                data-testid="record-output-type"
                label="输出格式"
                value={state.outputType}
                disabled={state.mechanism !== 'buffer'}
                onChange={e => state.outputType = e}
                options={[
                    { value: 'hls', label: 'MP4' },
                    { value: 'flv', label: 'FLV' },
                    { value: undefined, label: '随机' }
                ]}
            />
            <Selector<typeof state.mechanism>
                data-testid="record-mechanism"
                label="录制方式"
                value={state.mechanism}
                onChange={e => {
                    if (e === 'capture') {
                        state.outputType = 'hls'
                        toast.info('捕捉直播流媒体元素將使用当前直播的画质录制，录制前先记得调至原画。', { 
                            position: 'top-center',
                            action: {
                                label: '启用自动切换到原画',
                                onClick: () => {
                                    state.autoSwitchQuality = true
                                    toast.success('已启用自动切换到原画画质功能。')
                                }
                            }
                        })
                    } else {
                        state.autoSwitchQuality = false
                    }
                    state.mechanism = e
                }}
                options={[
                    { value: 'buffer', label: '另开直播线路录制' },
                    { value: 'capture', label: '捕捉直播流媒体元素' }
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
                <Switch
                    data-testid="record-hide-ui"
                    crossOrigin="annoymous"
                    label={
                        <Fragment>
                            <Typography className="font-medium ml-3 flex items-center gap-2">
                                隐藏界面按钮
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
            <div>
                <HotKeyInput
                    data-testid="record-hotkey"
                    label="快速切片热键"
                    value={state.recordHotkey}
                    onChange={key => {
                        if (validateKeyInConflict(key, 'record')) return
                        state.recordHotkey.key = key.key
                        state.recordHotkey.ctrlKey = key.ctrlKey
                        state.recordHotkey.shiftKey = key.shiftKey
                    }}
                />
            </div>
            <div>
                <HotKeyInput
                    data-testid="screenshot-hotkey"
                    label="截图热键"
                    value={state.screenshotHotkey}
                    onChange={key => {
                        if (validateKeyInConflict(key, 'screenshot')) return
                        state.screenshotHotkey.key = key.key
                        state.screenshotHotkey.ctrlKey = key.ctrlKey
                        state.screenshotHotkey.shiftKey = key.shiftKey
                    }}
                />
            </div>
        </Fragment>
    )
}

export default RecorderFeatureSettings