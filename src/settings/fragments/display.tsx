import type { StateProxy } from "~hooks/binding"



export type SettingSchema = {
    restartButton: boolean
    blackListButton: boolean
    settingsButton: boolean
    themeToNormalButton: boolean
}


export const defaultSettings: Readonly<SettingSchema> = {
    restartButton: false,
    blackListButton: true,
    settingsButton: true,
    themeToNormalButton: true,
}


function DisplaySettings({state, useHandler}: StateProxy<SettingSchema>): JSX.Element {
    return (
        <></>
    )
}