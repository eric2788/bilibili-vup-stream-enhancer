import type { StateProxy } from "~hooks/binding"

export type SettingSchema = {
    tongchuanMans: string[],
    tongchuanBlackList: string[],
    blackListRooms: string[]
}


export const defaultSettings: Readonly<SettingSchema> = {
    tongchuanMans: [],
    tongchuanBlackList: [],
    blackListRooms: []
}



function ListingSettings({state, useHandler}: StateProxy<SettingSchema>): JSX.Element {
    return (
        <></>
    )
}

export default ListingSettings