import { Input, type InputProps } from "@material-tailwind/react"
import { type ChangeEvent, type RefAttributes } from "react"
import type { HexColor } from "~types"


export type ColorInputProps = {
    value: HexColor
    optional?: boolean
} & RefAttributes<HTMLInputElement> & Omit<InputProps, 'value' | 'required' | 'pattern' | 'error' | 'type' | 'optional'>


function ColorInput(props: ColorInputProps): JSX.Element {

    const { optional: opt, value, ...rest } = props
    const optional = opt ?? false

    return (
        <div className="w-full flex justify-center">
            <div className="relative flex w-full">
                <Input
                    id="hs-color-input"
                    variant="static"
                    crossOrigin="anonymous"
                    type="text"
                    required={!optional}
                    pattern="^#[A-Fa-f0-9]{6}$"
                    value={value}
                    error={!/^#[A-Fa-f0-9]{6}$/.test(value) && !optional}
                    className="pr-20"
                    containerProps={{
                        className: "min-w-0",
                    }}
                    {...rest}
                />
                { value && <input type="color" required={!optional} className="!absolute right-0 bottom-0 h-8 rounded bg-transparent cursor-crosshair" defaultValue={value} onChange={props.onChange} onBlur={props.onBlur} />}
            </div>
        </div>
    )
}


export default ColorInput