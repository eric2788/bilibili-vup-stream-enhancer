import { List } from "@material-tailwind/react"
import { Fragment, type ChangeEvent } from "react"
import { asStateProxy, useBinding, type StateProxy } from "~hooks/binding"
import ExperienmentFeatureIcon from "~settings/components/ExperientmentFeatureIcon"
import SwitchListItem from "~settings/components/SwitchListItem"
import type { FeatureSettingsDefinition } from ".."
import ButtonFragment, { buttonDefaultSettings, type ButtonSchema } from "./components/ButtonFragment"
import DanmakuZone, { danmakuDefaultSettings, type DanmakuSchema } from "./components/DanmakuFragment"
import JimakuZone, { jimakuDefaultSettings, type JimakuSchema } from "./components/JimakuFragment"


export const title: string = '同传弹幕过滤'

export const define: FeatureSettingsDefinition = {
    offlineTable: 'jimakus'
}

export type FeatureSettingSchema = {
    // common schema
    noNativeVtuber: boolean
    jimakuPopupWindow: boolean,

    // fragments
    jimakuZone: JimakuSchema,
    danmakuZone: DanmakuSchema,
    buttonZone: ButtonSchema
}

export const defaultSettings: Readonly<FeatureSettingSchema> = {
    // common
    noNativeVtuber: false,
    jimakuPopupWindow: false,

    // fragments
    jimakuZone: jimakuDefaultSettings,
    danmakuZone: danmakuDefaultSettings,
    buttonZone: buttonDefaultSettings
}


function JimakuFeatureSettings({ state, useHandler }: StateProxy<FeatureSettingSchema>): JSX.Element {

    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>(e => e.target.checked)

    const jimakuStateProxy = asStateProxy(useBinding(state.jimakuZone, true))
    const danmakuStateProxy = asStateProxy(useBinding(state.danmakuZone, true))
    const buttonStateProxy = asStateProxy(useBinding(state.buttonZone, true))

    return (
        <Fragment>
            <List className="col-span-2">
                <SwitchListItem
                    label="过滤国内虚拟主播"
                    hint="此功能目前处于测试阶段, 因此无法过滤所有的国V"
                    value={state.noNativeVtuber}
                    onChange={checker('noNativeVtuber')}
                    marker={<ExperienmentFeatureIcon />}
                />
                <SwitchListItem label="启用同传弹幕彈出式视窗" hint="使用弹出式视窗时必须开着直播间才能运行" value={state.jimakuPopupWindow} onChange={checker('jimakuPopupWindow')} />
            </List>
            <div className="col-span-2 flex justify-start text-lg font-bold">
                <h3>字幕设定</h3>
            </div>
            <JimakuZone {...jimakuStateProxy} />
            <div className="col-span-2 flex justify-start text-lg font-bold">
                <h3>同传弹幕设定</h3>
            </div>
            <DanmakuZone {...danmakuStateProxy} />
            <div className="col-span-2 flex justify-start text-lg font-bold">
                <h3>字幕按钮样式设定</h3>
            </div>
            <ButtonFragment {...buttonStateProxy} />
        </Fragment>
    )
}


export default JimakuFeatureSettings