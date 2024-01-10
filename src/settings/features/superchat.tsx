import type { FeatureSettingsDefinition } from "."

export const title: string = '醒目留言'

export const define: FeatureSettingsDefinition = {
    enabledRoomList: false,
    offlineTable: 'superchats'
}

export type FeatureSettingSchema = {}

export const defaultSettings: Readonly<FeatureSettingSchema> = {}


function SuperchatFeatureSettings(): JSX.Element {
    return (
        <></>
    )
}


export default SuperchatFeatureSettings