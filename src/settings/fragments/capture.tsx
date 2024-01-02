
import { Fragment } from 'react';
import { toast } from 'sonner/dist';
import { type StateProxy } from '~hooks/binding';
import Selector from '~settings/components/Selector';

import type { AdapterType } from '~adapters';
export type SettingSchema = {
    captureMechanism: AdapterType
}

export const defaultSettings: Readonly<SettingSchema> = {
    captureMechanism: 'websocket',
}

export const title = '捕捉机制相关'

function CaptureSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {


    const changeMechanism = (e: AdapterType) => {
        if (e === 'dom' && !window.confirm('捕捉元素功能受限, 我们仅建议在WS挂接无法运作的情况下才作为备用, 是否继续?')) return
        state.captureMechanism = e
        if (state.captureMechanism === 'dom') {
            toast.warning('已切换到捕捉元素机制, 以下功能将无法使用:', {
                description: (
                    <ul>
                        <li>弹幕位置</li>
                        <li>除了弹幕以外的所有功能</li>
                    </ul>
                ),
                position: 'bottom-center'
            })
        }
    }

    return (
        <Fragment>
            <Selector<AdapterType>
                label="捕捉机制"
                value={state.captureMechanism}
                onChange={changeMechanism}
                options={[
                    { value: 'websocket', label: 'WebSocket挂接' },
                    { value: 'dom', label: '捕捉元素(功能受限)' },
                ]}
            />
        </Fragment>
    )
}



export default CaptureSettings