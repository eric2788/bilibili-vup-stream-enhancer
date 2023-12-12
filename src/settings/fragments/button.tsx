
import { Input } from "@material-tailwind/react"
import { Fragment } from "react"
import type { StateProxy } from "~hooks/binding"
import type { HexColor } from "~types"

export type SettingSchema = {
    textColor: HexColor
    backgroundColor: HexColor
    backgroundListColor: HexColor
}

export const defaultSettings: Readonly<SettingSchema> = {
    textColor: '#ffffff',
    backgroundColor: '#000000',
    backgroundListColor: '#808080'
}

export const title = '按钮样式设定'

function ButtonSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {
    return (
        <Fragment>
            <label htmlFor="hs-color-input" className="block font-medium text-lg mb-2 dark:text-white">按钮背景顏色</label>
            <div className="relative flex w-full max-w-[24rem]">
                <Input
                    crossOrigin={true}
                    type="email"
                    label="Email Address"
                    value=""
                    color="white"
                    onChange={() => {}}
                    className="pr-20"
                    containerProps={{
                        className: "min-w-0",
                    }}
                />
                <input type="color" className="p-1 h-10 w-14 block bg-gray-200 border border-[#d1d5db] dark:border-[#4b4b4b6c] cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700" id="hs-color-input" value={state.backgroundColor} title="Choose your color" />
            </div>

        </Fragment>
    )
}

export default ButtonSettings