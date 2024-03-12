import { List } from "@material-tailwind/react"
import { type ChangeEvent, Fragment } from "react"
import type { StateProxy } from "~hooks/binding"
import AffixInput from "~settings/components/AffixInput"
import ColorInput from "~settings/components/ColorInput"
import Hints from "~settings/components/Hints"
import Selector from "~settings/components/Selector"
import SwitchListItem from "~settings/components/SwitchListItem"
import type { HundredNumber, HexColor, NumRange } from "~types/common"

export type JimakuSchema = {
    size: HundredNumber
    firstLineSize: HundredNumber
    position: 'left' | 'right' | 'center'
    lineGap: HundredNumber
    color: HexColor
    animation: 'left' | 'top' | 'size'
    order: 'top' | 'bottom'
    backgroundHeight: NumRange<100, 700>
    backgroundColor: HexColor
    backgroundOpacity: HundredNumber
    filterUserLevel: number
    areaDragBoundary: boolean
}


export const jimakuDefaultSettings: Readonly<JimakuSchema> = {
    size: 16,
    firstLineSize: 18,
    position: 'center',
    lineGap: 7,
    color: '#ffffff',
    animation: 'top',
    order: 'top',
    backgroundHeight: 150,
    backgroundColor: '#808080',
    backgroundOpacity: 40,
    filterUserLevel: 0,
    areaDragBoundary: false
}

function JimakuFragment({ state, useHandler }: StateProxy<JimakuSchema>): JSX.Element {

    const str = useHandler<ChangeEvent<HTMLInputElement>>((e) => e.target.value)
    const num = useHandler<ChangeEvent<HTMLInputElement>, number>((e) => e.target.valueAsNumber)
    const bool = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    const hundredHints = <Hints values={['范围 0 ~ 100']} />

    return (
        <Fragment>
            <div>
                <AffixInput data-testid="jimaku-size" label="字幕大小" variant="static" min={0} max={100} type="number" value={state.size} onChange={num('size')} suffix="px" />
                {hundredHints}
            </div>
            <div>
                <AffixInput data-testid="jimaku-first-size" label="第一行字幕大小" variant="static" min={0} max={100} type="number" value={state.firstLineSize} onChange={num('firstLineSize')} suffix="px" />
                {hundredHints}
            </div>
            <Selector<typeof state.position>
                data-testid="jimaku-position"
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
                <AffixInput data-testid="jimaku-gap" label="字幕行距间隔" variant="static" min={0} max={100} type="number" value={state.lineGap} onChange={num('lineGap')} suffix="px" />
                {hundredHints}
            </div>
            <div>
                <ColorInput data-testid="jimaku-bg-color" label="字幕背景颜色" value={state.backgroundColor} onChange={str('backgroundColor')} />
            </div>
            <div>
                <AffixInput data-testid="jimaku-bg-opacity" label="全屏时字幕背景透明度" variant="static" min={0} max={100} type="number" value={state.backgroundOpacity} onChange={num('backgroundOpacity')} suffix="%" />
                {hundredHints}
            </div>
            <div>
                <AffixInput data-testid="jimaku-ul" label="同传用户UL等级过滤" variant="static" min={0} max={100} type="number" value={state.filterUserLevel} onChange={num('filterUserLevel')} prefix="UL" />
                <Hints values={[
                    '用户低于该等级将无视其同传弹幕, 同传man名单内的用户除外',
                    <span className="text-red-800">(UL等级过滤无法应用于隐藏同传弹幕和透明度)</span>
                ]} />
            </div>
            <div>
                <ColorInput data-testid="jimaku-color" label="字幕顏色" value={state.color} onChange={str('color')} />
            </div>
            <div>
                <AffixInput data-testid="jimaku-bg-height" label="字幕背景高度" variant="static" min={0} max={700} type="number" value={state.backgroundHeight} onChange={num('backgroundHeight')} suffix="px" />
                <Hints values={['范围 100 ~ 700']} />
            </div>
            <Selector<typeof state.animation>
                data-testid="jimaku-animation"
                label="字幕动画"
                value={state.animation}
                onChange={e => state.animation = e}
                options={[
                    { value: 'left', label: '右移' },
                    { value: 'top', label: '下移' },
                    { value: 'size', label: '缩放' },
                ]}
            />
            <Selector<typeof state.order>
                data-testid="jimaku-order"
                label="字幕顺序"
                value={state.order}
                onChange={e => state.order = e}
                options={[
                    { value: 'top', label: '上到下' },
                    { value: 'bottom', label: '下到上' },
                ]}
            />
            <List className="col-span-2">
                <SwitchListItem 
                    label="全屏时字幕背景拖拽范围边界限制"
                    hint="开启后, 字幕背景将无法拖拽出播放器范围以外"
                    onChange={bool('areaDragBoundary')}
                    value={state.areaDragBoundary}
                />
            </List>
        </Fragment>
    )
}



export default JimakuFragment