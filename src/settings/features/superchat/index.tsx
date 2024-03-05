import type { HexColor } from "~types/common"
import type { FeatureSettingsDefinition } from ".."
import { Fragment, type ChangeEvent } from "react"
import ColorInput from "~settings/components/ColorInput"
import type { StateProxy } from "~hooks/binding"

export const title: string = '醒目留言'

export const define: FeatureSettingsDefinition = {
    offlineTable: 'superchats'
}

export type FeatureSettingSchema = {
    floatingButtonColor: HexColor,
    buttonColor: HexColor,
}

export const defaultSettings: Readonly<FeatureSettingSchema> = {
    floatingButtonColor: '#db7d1f',
    buttonColor: '#db7d1f',
}


function SuperchatFeatureSettings({state, useHandler}: StateProxy<FeatureSettingSchema>): JSX.Element {

    const handler = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value)

    return (
        <div className="grid max-md:grid-cols-1 md:grid-cols-2 gap-10">
            <ColorInput label="浮动按钮颜色" value={state.floatingButtonColor} onChange={handler('floatingButtonColor')}  />
            <ColorInput label="操作按钮颜色" value={state.buttonColor} onChange={handler('buttonColor')}  />
        </div>
    )
}


export default SuperchatFeatureSettings