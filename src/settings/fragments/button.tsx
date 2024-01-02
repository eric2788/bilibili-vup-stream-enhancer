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

function ButtonSettings({state, useHandler}: StateProxy<SettingSchema>): JSX.Element {
    return (
        <></>
    )
}

export default ButtonSettings