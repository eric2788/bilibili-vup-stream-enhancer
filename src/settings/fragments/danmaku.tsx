import type { StateProxy } from "~hooks/binding"


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

// TODO: change to use tailwindcss
function DanmakuSettings({state, bind}: StateProxy<SettingSchema>): JSX.Element {
    return (
        <></>
    )
}




export default DanmakuSettings