
import { type ChangeEvent } from "react"
import ColorInput from "~components/color-input"
import type { StateProxy } from "~hooks/binding"
import type { HexColor } from "~types"

export type SettingSchema = {
    textColor: HexColor
    backgroundColor: HexColor
    backgroundListColor: HexColor
}

export const defaultSettings: Readonly<SettingSchema> = {
    textColor: '#ffffff',
    backgroundColor: '#000000',
    backgroundListColor: '#808080'
}

export const title = '按钮样式设定'

function ButtonSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const handler = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value)

    return (
        <div className="grid max-md:grid-cols-1 md:grid-cols-2 gap-3">
             <ColorInput label="按钮背景颜色" value={state.backgroundColor} onChange={handler('backgroundColor')} />
             <ColorInput label="按钮列表背景颜色" value={state.backgroundListColor} onChange={handler('backgroundListColor')} />
             <ColorInput label="按钮文字颜色" value={state.textColor} onChange={handler('textColor')} />
        </div>
    )
}

export default ButtonSettings