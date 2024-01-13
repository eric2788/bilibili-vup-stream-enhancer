
import { type ChangeEvent, Fragment } from 'react';
import ColorInput from '~settings/components/ColorInput';

import type { StateProxy } from "~hooks/binding";
import type { HexColor } from "~types/common";

export type ButtonSchema = {
    textColor: HexColor
    backgroundColor: HexColor
    backgroundListColor: HexColor
}

export const buttonDefaultSettings: Readonly<ButtonSchema> = {
    textColor: '#ffffff',
    backgroundColor: '#000000',
    backgroundListColor: '#ffffff'
}

function ButtonFragment({ state, useHandler }: StateProxy<ButtonSchema>): JSX.Element {

    const handler = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value)

    return (
        <Fragment>
            <ColorInput label="按钮背景颜色" value={state.backgroundColor} onChange={handler('backgroundColor')} />
            <ColorInput label="按钮列表背景颜色" value={state.backgroundListColor} onChange={handler('backgroundListColor')} />
            <ColorInput label="按钮文字颜色" value={state.textColor} onChange={handler('textColor')} />
        </Fragment>
    )
}

export default ButtonFragment