import { Input, Typography, Select, Option } from "@material-tailwind/react"
import { Fragment, type ChangeEventHandler, type ChangeEvent } from "react"
import ColorInput from "~components/color-input"
import Selector from "~components/selector"
import type { StateProxy } from "~hooks/binding"
import type { Optional, HundredNumber, HexColor } from "~types"
import { sendBackground } from "~utils/messaging"
import { isDarkTheme } from "~utils/misc"

export type SettingSchema = {
    regex: string
    opacity: Optional<HundredNumber>
    color: Optional<HexColor>
    position: 'top' | 'bottom' | 'unchanged'
}


export const defaultSettings: Readonly<SettingSchema> = {
    regex: '^(?<n>[^【】]+?)?\\:?\\s*【(?<cc>[^【】]+?)(】.?)?$',
    opacity: undefined,
    color: undefined,
    position: 'unchanged'
}

export const title = '同传弹幕设定'

function DanmakuSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const handler = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value)

    const changePos = (e: typeof state.position) => {
        state.position = e
    }


    const changeOpacity = (v: number) => state.opacity = (v < 0 || v > 100) ? undefined : v as HundredNumber

    return (
        <Fragment>
            <div className="md:col-span-2 max-md:col-span-1">
                <Input crossOrigin="anonymous" variant="static" label="过滤使用的正则表达式" value={state.regex} onChange={handler('regex')} />
                <Typography
                    variant="small"

                    className="mt-2 flex items-center gap-1 font-normal dark:text-gray-400"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="-mt-px h-4 w-4"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    有关正则表达式可以到
                    <span
                        className="font-bold antialiased cursor-pointer text-sm leading-normal dark:text-white"
                        onClick={() => sendBackground('open-tab', { url: 'https://regex101.com' })}>这里</span>
                    进行测试。
                </Typography>
                <Typography variant="small" className="font-normal pl-5 dark:text-gray-400">必须包含名称为cc的正则组别以捕捉字幕。</Typography>
                <Typography variant="small" className="font-normal pl-5 dark:text-gray-400">可包含名称为n的正则组别以捕捉说话者。</Typography>

            </div>
            <div>
                <ColorInput label="同传弹幕颜色" optional={true} onChange={handler('color')} value={state.color} />
                <Typography variant="small" className="mt-2 flex items-center gap-1 font-normal dark:text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="-mt-px h-4 w-4"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    留空不改变。
                </Typography>
            </div>
            <div>
                <Input label="同传弹幕透明度" crossOrigin={'annoymous'} onChange={e => changeOpacity(e.target.valueAsNumber)} value={state.opacity ?? -1} variant="static" type="number" min={-1} max={100} />
                <Typography variant="small" className="mt-2 flex items-center gap-1 font-normal dark:text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="-mt-px h-4 w-4"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    范围 0 ~ 100, -1 代表不改变。
                </Typography>
            </div>
            <Selector<typeof state.position>
                label="弹幕位置"
                value={state.position}
                onChange={changePos}
                options={[
                    { value: 'unchanged', label: '不改变' },
                    { value: 'top', label: '置顶' },
                    { value: 'bottom', label: '置底' },
                ]}
            />
        </Fragment>
    )
}




export default DanmakuSettings