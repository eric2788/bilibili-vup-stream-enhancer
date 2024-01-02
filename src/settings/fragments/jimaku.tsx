import { Fragment, type ChangeEvent } from "react"
import AffixInput from "~settings/components/AffixInput"
import ColorInput from "~settings/components/ColorInput"
import Hints from "~settings/components/Hints"
import Selector from "~settings/components/Selector"
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

    const hundredHints = <Hints values={['范围 0 ~ 100']} />

    return (
        <Fragment>
            <div>
                <AffixInput label="字幕大小" variant="static" min={0} max={100} type="number" value={state.size} onChange={numberHandler('size')} suffix="px"  />
                {hundredHints}
            </div>
            <div>
                <AffixInput label="第一行字幕大小" variant="static" min={0} max={100} type="number" value={state.firstLineSize} onChange={numberHandler('firstLineSize')} suffix="px" />
                {hundredHints}
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
            <div>
                <AffixInput label="字幕行距间隔" variant="static" min={0} max={100} type="number" value={state.lineGap} onChange={numberHandler('lineGap')} suffix="px" />
                {hundredHints}
            </div>
            <div>
                <ColorInput label="字幕背景颜色" value={state.backgroundColor} onChange={stringHandler('backgroundColor')} />
            </div>
            <div>
                <AffixInput label="全屏时字幕背景透明度" variant="static" min={0} max={100} type="number" value={state.backgroundOpacity} onChange={numberHandler('backgroundOpacity')} suffix="%" />
                {hundredHints}
            </div>
            <div>
                <AffixInput label="同传用户UL等级过滤" variant="static" min={0} max={100} type="number" value={state.filterUserLevel} onChange={numberHandler('filterUserLevel')} prefix="UL" />
                <Hints values={[
                    '用户低于该等级将无视其同传弹幕, 同传man名单内的用户除外',
                    <span className="text-red-800">(UL等级过滤无法应用于隐藏同传弹幕和透明度)</span>
                ]}/>
            </div>
            <div>
                <ColorInput label="字幕顏色" value={state.color} onChange={stringHandler('color')} />
            </div>
            <div>
                <AffixInput label="字幕背景高度" variant="static" min={0} max={700} type="number" value={state.backgroundHeight} onChange={numberHandler('backgroundHeight')} suffix="px" />
                <Hints values={['范围 100 ~ 700']} />
            </div>
        </Fragment>
    )
}



export default JimakuSettings