import { Collapse, List, Switch, Typography } from "@material-tailwind/react"
import { type ChangeEvent } from "react"
import SwitchListItem from "~components/SwitchListItem"
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

function FeatureSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    const toggle = (feature: FeatureType) => {
        if (state.enabledFeatures.includes(feature)) {
            state.enabledFeatures = state.enabledFeatures.filter(f => f !== feature)
        } else {
            state.enabledFeatures.push(feature)
        }
    }


    return (
        <div className="col-span-2">
            <div className="bg-white shadow-md rounded-md p-4 mb-4">
                <Switch label={
                    <div>
                        <Typography color="blue-gray" className="font-semibold">
                            启用同传弹幕过滤
                        </Typography>
                    </div>
                } crossOrigin={'annoymous'} checked={state.enabledFeatures.includes('jimaku')} onChange={e => toggle('jimaku')} />
                <Collapse open={state.enabledFeatures.includes('jimaku')}>
                    <div className="ml-6">
                        <List>
                            <SwitchListItem label="弹出窗口" value={state.jimakuPopupWindow} onChange={checker('jimakuPopupWindow')} />
                            <SwitchListItem label="隐藏同传弹幕" value={state.hideJimakuDanmaku} onChange={checker('hideJimakuDanmaku')} />
                        </List>
                    </div>
                </Collapse>
            </div>
            <div className="bg-white shadow-md rounded-md p-4 mb-4">
                <Switch label={
                    <div>
                        <Typography color="blue-gray" className="font-semibold">
                            启用醒目留言记录
                        </Typography>
                    </div>
                } crossOrigin={'annoymous'} checked={state.enabledFeatures.includes('superchat')} onChange={e => toggle('superchat')} />
                <Collapse open={state.enabledFeatures.includes('superchat')}>
                    <div className="ml-6">
                        <List>
                            <SwitchListItem label="启用录制" value={state.enableRecording} onChange={checker('enableRecording')} />
                        </List>
                    </div>
                </Collapse>
            </div>
        </div>
    )
}


export default FeatureSettings