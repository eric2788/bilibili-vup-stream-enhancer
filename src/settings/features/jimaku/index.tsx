import { Collapse, List } from "@material-tailwind/react"
import { Fragment, type ChangeEvent } from "react"
import { asStateProxy, useBinding, type StateProxy } from "~hooks/binding"
import ExperienmentFeatureIcon from "~settings/components/ExperientmentFeatureIcon"
import SwitchListItem from "~settings/components/SwitchListItem"
import type { FeatureSettingsDefinition } from ".."
import ButtonFragment, { buttonDefaultSettings, type ButtonSchema } from "./components/ButtonFragment"
import DanmakuZone, { danmakuDefaultSettings, type DanmakuSchema } from "./components/DanmakuFragment"
import JimakuZone, { jimakuDefaultSettings, type JimakuSchema } from "./components/JimakuFragment"
import ListingFragment, { listingDefaultSettings, type ListingSchema } from "./components/ListingFragment"
import { useToggle } from "@react-hooks-library/core"
import Expander from "~settings/components/Expander"
import type { PickKeys } from "~types/common"


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
    buttonZone: ButtonSchema,
    listingZone: ListingSchema
}

export const defaultSettings: Readonly<FeatureSettingSchema> = {
    // common
    noNativeVtuber: false,
    jimakuPopupWindow: false,

    // fragments
    jimakuZone: jimakuDefaultSettings,
    danmakuZone: danmakuDefaultSettings,
    buttonZone: buttonDefaultSettings,
    listingZone: listingDefaultSettings
}

const zones: {
    Zone: React.FC<StateProxy<object>>,
    title: string,
    key: PickKeys<FeatureSettingSchema, object>
}[] = [
        {
            Zone: JimakuZone,
            title: '字幕设定',
            key: 'jimakuZone'
        },
        {
            Zone: DanmakuZone,
            title: '同传弹幕设定',
            key: 'danmakuZone'
        },
        {
            Zone: ButtonFragment,
            title: '字幕按钮样式设定',
            key: 'buttonZone'
        },
        {
            Zone: ListingFragment,
            title: '同传名单设定',
            key: 'listingZone'
        }
    ]


function JimakuFeatureSettings({ state, useHandler }: StateProxy<FeatureSettingSchema>): JSX.Element {

    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>(e => e.target.checked)

    return (
        <Fragment>
            <div className="col-span-2">
                <List>
                    <SwitchListItem
                        data-testid="no-native-vtuber"
                        label="过滤国内虚拟主播"
                        hint="此功能目前处于测试阶段, 因此无法过滤所有的国V"
                        value={state.noNativeVtuber}
                        onChange={checker('noNativeVtuber')}
                        marker={<ExperienmentFeatureIcon />}
                    />
                    <SwitchListItem data-testid="jimaku-window" label="启用同传弹幕弹出式视窗" hint="使用弹出式视窗时必须开着直播间才能运行" value={state.jimakuPopupWindow} onChange={checker('jimakuPopupWindow')} />
                </List>
            </div>
            <div className="col-span-2">
                {zones.map(({ Zone, title, key }) => {
                    const stateProxy = asStateProxy(useBinding(state[key], true))
                    return (
                        <div key={key} className="py-2">
                            <Expander title={title} colorClass="bg-gray-100 dark:bg-gray-700">
                                <div className="px-5 pt-7 pb-5 grid max-md:grid-cols-1 md:grid-cols-2 gap-10 border border-t-0 border-gray-100 dark:border-gray-700 rounded-md rounded-t-none">
                                    <Zone {...stateProxy} />
                                </div>
                            </Expander>
                        </div>
                    )
                })}
            </div>
        </Fragment>
    )
}


export default JimakuFeatureSettings