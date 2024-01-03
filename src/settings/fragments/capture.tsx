
import { Fragment, type ChangeEvent } from 'react';
import { toast } from 'sonner/dist';
import { type StateProxy } from '~hooks/binding';
import Selector from '~settings/components/Selector';

import type { AdapterType } from '~adapters';
import SwitchListItem from '~settings/components/SwitchListItem';
import { List } from '@material-tailwind/react';
export type SettingSchema = {
    captureMechanism: AdapterType
    boostWebSocketHook: boolean
}

export const defaultSettings: Readonly<SettingSchema> = {
    captureMechanism: 'websocket',
    boostWebSocketHook: true
}

export const title = '捕捉机制相关'

function CaptureSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const boolHandler = useHandler<ChangeEvent<HTMLInputElement>, boolean>(e => e.target.checked)

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
            <List>
                <SwitchListItem
                    disabled={state.captureMechanism !== 'websocket'}
                    label="提高WebSocket挂接速度"
                    value={state.boostWebSocketHook}
                    onChange={boolHandler('boostWebSocketHook')}
                    hint="启用后, 将在页面加载前执行WebSocket挂接以大幅提高速度。若发现未知问题请关闭此选项。"
                />
            </List>
        </Fragment>
    )
}



export default CaptureSettings