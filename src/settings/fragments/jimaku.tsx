import type { StateProxy } from "~hooks/binding"

export type SettingSchema = {
    size: HundredNumber
    firstLineSize: HundredNumber
    position: 'left' | 'right' | 'center',
    lineGap: HundredNumber
    color: HexColor
    animation: 'slide-x' | 'slide-y' | 'scale'
    backgroundHeight: NumRange<100, 700>
    backgroundColor: HexColor
    backgroundOpacity: HundredNumber
    filterUserLevel: number
}


export const defaultSettings: Readonly<SettingSchema> = {
    size: 16,
    firstLineSize: 18,
    position: 'center',
    lineGap: 7,
    color: '#ffffff',
    animation: 'slide-y',
    backgroundHeight: 100,
    backgroundColor: '#808080',
    backgroundOpacity: 40,
    filterUserLevel: 0
}


function JimakuSettings({state, bind}: StateProxy<SettingSchema>): JSX.Element {
    return (
        <></>
    )
}



export default JimakuSettings