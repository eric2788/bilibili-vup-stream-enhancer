import { Input } from "@material-tailwind/react"
import { type ChangeEvent } from "react"
import type { HexColor } from "~types"
import { isDarkTheme } from "~utils/misc"


export type ColorInputProps = {
    value: HexColor
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void
    optional?: boolean
    label?: string
}


function ColorInput(props: ColorInputProps): JSX.Element {


    const optional = props.optional ?? false

    return (
        <div className="w-full flex justify-center">
            <div className="relative flex w-full">
                <Input
                    id="hs-color-input"
                    variant="static"
                    crossOrigin="anonymous"
                    type="text"
                    label={props.label}
                    required={!optional}
                    value={props.value ?? ''}
                    onChange={props.onChange}
                    
                    pattern="^#[A-Fa-f0-9]{6}$"
                    error={!/^#[A-Fa-f0-9]{6}$/.test(props.value) && !optional}
                    className="pr-20"
                    containerProps={{
                        className: "min-w-0",
                    }}
                />
                <input type="color" required className="!absolute right-0 bottom-0 h-8 rounded bg-transparent" defaultValue={props.value} onChange={props.onChange} onBlur={props.onBlur} />
            </div>
        </div>
    )
}


export default ColorInput