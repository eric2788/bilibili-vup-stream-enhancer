import { Input } from "@material-tailwind/react"
import { type ChangeEvent } from "react"
import type { HexColor } from "~types"
import { isDarkTheme } from "~utils/misc"


export type ColorInputProps = {
    value: HexColor
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    label?: string
    title?: string
}


function ColorInput(props: ColorInputProps) {
    return (
        <div className="py-5 w-full flex justify-center">
            <div className="relative flex w-full max-w-[24rem]">
                <Input
                    id="hs-color-input"
                    variant="static"
                    crossOrigin="true"
                    type="text"
                    label={props.label}
                    required
                    value={props.value}
                    onChange={props.onChange}
                    color={isDarkTheme() ? 'white' : 'gray'}
                    pattern="^#[A-Fa-f0-9]{6}$"
                    error={!/^#[A-Fa-f0-9]{6}$/.test(props.value)}
                    className="pr-20"
                    containerProps={{
                        className: "min-w-0",
                    }}
                />
                <input type="color" required className="!absolute right-0 bottom-0 h-8 rounded bg-transparent" defaultValue={props.value} onBlur={props.onChange} />
            </div>
        </div>
    )
}


export default ColorInput