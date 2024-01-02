
import { Fragment, type ChangeEvent } from "react"
import type { StateProxy } from "~hooks/binding"
import ColorInput from "~settings/components/ColorInput"
import type { HexColor } from "~types/common"

export type SettingSchema = {
    textColor: HexColor
    backgroundColor: HexColor
    backgroundListColor: HexColor
}

export const defaultSettings: Readonly<SettingSchema> = {
    textColor: '#ffffff',
    backgroundColor: '#000000',
    backgroundListColor: '#ffffff'
}

export const title = '字幕按钮样式设定'

function ButtonSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const handler = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value)

    return (
        <Fragment>
            <ColorInput label="按钮背景颜色" value={state.backgroundColor} onChange={handler('backgroundColor')} />
            <ColorInput label="按钮列表背景颜色" value={state.backgroundListColor} onChange={handler('backgroundListColor')} />
            <ColorInput label="按钮文字颜色" value={state.textColor} onChange={handler('textColor')} />
        </Fragment>
    )
}

export default ButtonSettings