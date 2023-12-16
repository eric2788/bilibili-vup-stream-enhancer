import { Collapse, List, Switch, Typography } from "@material-tailwind/react"
import { type ChangeEvent } from "react"
import SwitchListItem from "~components/SwitchListItem"
import type { FeatureType } from "~contents/features"
import type { StateProxy } from "~hooks/binding"



export type SettingSchema = {
    enabledFeatures: FeatureType[],
    enabledRecording: FeatureType[],
    onlyVtuber: boolean,
    noNativeVtuber: boolean,
    jimakuPopupWindow: boolean, // only when enabledFeatures.includes('jimaku')
    monitorWindow: boolean,
    hideJimakuDanmaku: boolean,
    useStreamingTime: boolean
}


export const defaultSettings: Readonly<SettingSchema> = {
    enabledFeatures: ['jimaku', 'superchat'],
    enabledRecording: [],
    onlyVtuber: false,
    noNativeVtuber: false,
    jimakuPopupWindow: false,
    monitorWindow: false,
    hideJimakuDanmaku: false,
    useStreamingTime: true
}


export const title = '功能设定'

function FeatureSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    const toggle = (feature: FeatureType) => {
        if (state.enabledFeatures.includes(feature)) {
            state.enabledFeatures = state.enabledFeatures.filter(f => f !== feature)
        } else {
            state.enabledFeatures.push(feature)
        }
    }

    const toggleRecord = (feature: FeatureType) => {
        if (state.enabledRecording.includes(feature)) {
            state.enabledRecording = state.enabledRecording.filter(f => f !== feature)
        } else {
            state.enabledRecording.push(feature)
        }
    }


    return (
        <div className="col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4">
                <div>
                    <Typography className="font-semibold">
                        通用设定
                    </Typography>
                </div>
                <List className="pl-6">
                    <SwitchListItem label="仅限虚拟主播" value={state.onlyVtuber} onChange={checker('onlyVtuber')} />
                    <SwitchListItem label="过滤国内虚拟主播" hint="需要先开启仅限虚拟主播才能生效" value={state.noNativeVtuber} onChange={checker('noNativeVtuber')} />
                    <SwitchListItem label="启用监控视窗" hint="如要传入字幕，必须开着直播间" value={state.monitorWindow} onChange={checker('monitorWindow')} />
                    <SwitchListItem label={(v) => `使用${v ? '直播' : '真实'}时间戳记`} value={state.useStreamingTime} onChange={checker('useStreamingTime')} />
                </List>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4">
                <Switch label={
                    <div>
                        <Typography className="font-semibold">
                            启用同传弹幕过滤
                        </Typography>
                    </div>
                } crossOrigin={'annoymous'} checked={state.enabledFeatures.includes('jimaku')} onChange={e => toggle('jimaku')} />
                <Collapse open={state.enabledFeatures.includes('jimaku')}>
                    <List className="pl-6">
                        <SwitchListItem label="启用离线记录" value={state.enabledRecording.includes('jimaku')} onChange={e => toggleRecord('jimaku')} />
                        <SwitchListItem label="启用同传弹幕彈出式视窗" hint="使用弹出式视窗时必须开着直播间才能运行" value={state.jimakuPopupWindow} onChange={checker('jimakuPopupWindow')} />
                        <SwitchListItem label="隐藏同传弹幕" value={state.hideJimakuDanmaku} onChange={checker('hideJimakuDanmaku')} />
                    </List>
                </Collapse>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4">
                <Switch label={
                    <div>
                        <Typography className="font-semibold">
                            启用醒目留言记录
                        </Typography>
                    </div>
                } crossOrigin={'annoymous'} checked={state.enabledFeatures.includes('superchat')} onChange={e => toggle('superchat')} />
                <Collapse open={state.enabledFeatures.includes('superchat')}>
                    <List className="pl-6">
                        <SwitchListItem label="启用离线记录" value={state.enabledRecording.includes('superchat')} onChange={e => toggleRecord('superchat')} />
                    </List>
                </Collapse>
            </div>
        </div>
    )
}


export default FeatureSettings