import { IconButton, Input, type InputProps } from "@material-tailwind/react"
import type { Keys } from "@react-hooks-library/core"
import { useState, type RefAttributes } from "react"

export type HotKey = {
    key: string
    ctrlKey: boolean
    shiftKey: boolean
}

export type HotKeyInputProps = {
    onChange: (value: HotKey) => void
    value: HotKey
    optional?: boolean
} & RefAttributes<HTMLInputElement> & Omit<InputProps, 'value' | 'required' | 'pattern' | 'error' | 'type' | 'optional' | 'onChange'>

export function HotKeyInput(props: HotKeyInputProps): JSX.Element {

    const { optional: opt, value, onChange, ...attrs } = props
    const optional = opt ?? true

    const [ listening, setListening ] = useState(false)

    const onListenKeyInput = () => {
        const listener = (e: KeyboardEvent) => {
            e.preventDefault()
            e.stopPropagation()
            onChange?.(e)
            window.removeEventListener('keydown', listener)
            setListening(false)
        }
        window.addEventListener('keydown', listener)
        setListening(true)
    }

    return (
        <div className="w-full flex justify-center">
            <div className="relative flex w-full">
                <Input
                    variant="static"
                    crossOrigin={'annoymous'}
                    type="text"
                    readOnly
                    required={!optional}
                    value={listening ? '监听输入中...' : value.key}
                    className="pr-20 font-mono tracking-[0.2rem] font-medium disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    containerProps={{
                        className: "min-w-0",
                    }}
                    {...attrs}
                />
                <IconButton onClick={onListenKeyInput} disabled={listening}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 disabled:animate-ping disabled:stroke-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </IconButton>
            </div>
        </div>
    )
}

export default HotKeyInput