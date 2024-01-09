import { type ChangeEvent, Fragment } from "react"
import type { FeatureSettingsDefinition } from "."
import type { StateProxy } from "~hooks/binding"
import ExperienmentFeatureIcon from "~settings/components/ExperientmentFeatureIcon"
import SwitchListItem from "~settings/components/SwitchListItem"


export const title: string = '同传弹幕过滤'

export const define: FeatureSettingsDefinition= {
    enabledRoomList: true,
    offlineTable: 'jimakus'
}

export type FeatureSettingSchema = {
    noNativeVtuber: boolean
    jimakuPopupWindow: boolean
}

export const defaultSettings: Readonly<FeatureSettingSchema> = {
    noNativeVtuber: false,
    jimakuPopupWindow: false
}


function JimakuFeatureSettings({ state, useHandler }: StateProxy<FeatureSettingSchema>): JSX.Element {

    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>(e => e.target.checked)

    return (
        <Fragment>
            <SwitchListItem
                label="过滤国内虚拟主播"
                hint="此功能目前处于测试阶段, 因此无法过滤所有的国V"
                value={state.noNativeVtuber}
                onChange={checker('noNativeVtuber')}
                marker={<ExperienmentFeatureIcon />}
            />
            <SwitchListItem label="启用同传弹幕彈出式视窗" hint="使用弹出式视窗时必须开着直播间才能运行" value={state.jimakuPopupWindow} onChange={checker('jimakuPopupWindow')} />
        </Fragment>
    )
}


export default JimakuFeatureSettings