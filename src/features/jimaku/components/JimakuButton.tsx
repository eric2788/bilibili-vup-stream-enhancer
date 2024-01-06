import type { MouseEventHandler } from 'react';
import { type SettingSchema as ButtonSchema } from '~settings/fragments/button';

export type JimakuButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    btnStyle: ButtonSchema,
    children: React.ReactNode
}

function JimakuButton({ onClick, btnStyle, children }: JimakuButtonProps): JSX.Element {
    return (
        <button
            onClick={onClick}
            style={{
                backgroundColor: btnStyle.backgroundColor,
                color: btnStyle.textColor
            }}
            className="m-[5px] px-[20px] py-[10px] rounded-md text-[15px] cursor-pointer">
            {children}
        </button>
    )
}

export default JimakuButton