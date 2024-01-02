
import type { AdapterType } from '~contents/adapters'
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

export const title = '字幕捕捉机制相关'

function CaptureSettings({state, useHandler}: StateProxy<SettingSchema>): JSX.Element {
    return (
        <>
        </>
    )
}



export default CaptureSettings