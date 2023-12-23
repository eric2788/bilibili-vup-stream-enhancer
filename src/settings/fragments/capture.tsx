
import { Fragment } from 'react'
import type { AdapterType } from '~adapters'
import { type StateProxy } from '~hooks/binding'
import Selector from '~settings/components/Selector'


export type SettingSchema = {
    captureMechanism: AdapterType
}

export const defaultSettings: Readonly<SettingSchema> = {
    captureMechanism: 'websocket',
}

export const title = '捕捉机制相关'

function CaptureSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {


    const changeMechanism = (e: AdapterType) => {
        state.captureMechanism = e
    }

    return (
        <Fragment>
            <Selector<AdapterType>
                label="捕捉机制"
                value={state.captureMechanism}
                onChange={changeMechanism}
                options={[
                    { value: 'websocket', label: 'WebSocket挂接' },
                    { value: 'dom', label: '捕捉元素' },
                ]}
            />
        </Fragment>
    )
}



export default CaptureSettings