import type { StateProxy } from "~hooks/binding"
import type { Optional, HundredNumber, HexColor } from "~types"

export type SettingSchema = {
    regex: string
    opacity: Optional<HundredNumber>
    color: Optional<HexColor>
    position: 'top' | 'bottom' | 'unchanged'
}


export const defaultSettings: Readonly<SettingSchema> = {
    regex: '^(?<n>[^【】]+?)?\\:?\\s*【(?<cc>[^【】]+?)(】.?)?$',
    opacity: undefined,
    color: undefined,
    position: 'unchanged'
}

export const title = '同传弹幕设定'

// TODO: change to use tailwindcss
function DanmakuSettings({state, useHandler}: StateProxy<SettingSchema>): JSX.Element {
    return (
        <></>
    )
}




export default DanmakuSettings