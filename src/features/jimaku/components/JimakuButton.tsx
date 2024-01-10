import { useContext, type MouseEventHandler } from 'react';
import JimakuFeatureContext from '~contexts/JimakuFeatureContext';

export type JimakuButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    children: React.ReactNode
}

function JimakuButton({ onClick, children }: JimakuButtonProps): JSX.Element {

    const { buttonZone: btnStyle } = useContext(JimakuFeatureContext)

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