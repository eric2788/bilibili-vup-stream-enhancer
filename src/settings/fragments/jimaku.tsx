import { Input, Typography } from "@material-tailwind/react"
import { Fragment, type ChangeEvent } from "react"
import Hints from "~components/hints"
import Selector from "~components/selector"
import SuffixInput from "~components/suffix-input"
import type { StateProxy } from "~hooks/binding"
import type { HexColor, HundredNumber, NumRange } from "~types"

export type SettingSchema = {
    size: HundredNumber
    firstLineSize: HundredNumber
    position: 'left' | 'right' | 'center',
    lineGap: HundredNumber
    color: HexColor
    animation: 'slide-x' | 'slide-y' | 'scale'
    backgroundHeight: NumRange<100, 700>
    backgroundColor: HexColor
    backgroundOpacity: HundredNumber
    filterUserLevel: number
}


export const defaultSettings: Readonly<SettingSchema> = {
    size: 16,
    firstLineSize: 18,
    position: 'center',
    lineGap: 7,
    color: '#ffffff',
    animation: 'slide-y',
    backgroundHeight: 100,
    backgroundColor: '#808080',
    backgroundOpacity: 40,
    filterUserLevel: 0
}

export const title = '字幕设定'

function JimakuSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const stringHandler = useHandler<ChangeEvent<HTMLInputElement>>((e) => e.target.value)
    const numberHandler = useHandler<ChangeEvent<HTMLInputElement>, number>((e) => e.target.valueAsNumber)

    return (
        <Fragment>
            <div>
                <SuffixInput label="字幕大小" variant="static" min={0} max={100} type="number" value={state.size} onChange={numberHandler('size')} suffix="px"  />
                <Hints values={['范围 0 ~ 100']} />
            </div>
            <div>
                <SuffixInput label="行间距" variant="static" min={0} max={100} type="number" value={state.lineGap} onChange={numberHandler('lineGap')} suffix="px" />
                <Hints values={['范围 0 ~ 100']} />
            </div>
            <Selector<typeof state.position>
                label="字幕位置"
                value={state.position}
                onChange={e => state.position = e}
                options={[
                    { value: 'left', label: '置左' },
                    { value: 'right', label: '置右' },
                    { value: 'center', label: '置中' },
                ]}
            />
        </Fragment>
    )
}



export default JimakuSettings