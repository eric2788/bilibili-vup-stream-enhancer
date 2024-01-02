
import type { AdapterType } from '~content/adapters'
import { type StateProxy } from '~hooks/binding'


export type SettingSchema = {
    useStreamingTime: boolean
    hideJimakuDanmaku: boolean
    captureMechanism: AdapterType
}



export const defaultSettings: Readonly<SettingSchema> = {
    useStreamingTime: false,
    hideJimakuDanmaku: false,
    captureMechanism: 'websocket',
}



function CaptureSettings({state, useHandler}: StateProxy<SettingSchema>): JSX.Element {
    return (
        <>
        </>
    )
}



export default CaptureSettings