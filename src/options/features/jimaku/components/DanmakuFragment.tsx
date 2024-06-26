import { type ChangeEvent, Fragment } from 'react';
import AffixInput from '~options/components/AffixInput';
import ColorInput from '~options/components/ColorInput';
import Hints from '~options/components/Hints';
import Selector from '~options/components/Selector';
import { sendMessager } from '~utils/messaging';

import { Input, Switch, Typography } from '@material-tailwind/react';

import type { StateProxy } from "~hooks/binding";
import type { HexColor, HundredNumber, Optional } from "~types/common";

export type DanmakuSchema = {
    regex: string
    hide: boolean,
    opacity: Optional<HundredNumber>
    color: Optional<HexColor>
    position: 'top' | 'bottom' | 'unchanged'
}


export const danmakuDefaultSettings: Readonly<DanmakuSchema> = {
    regex: '^(?<n>[^【】]+?)?\\:?\\s*【(?<cc>[^【】]+?)(】.?)?$',
    hide: false,
    opacity: undefined,
    color: undefined,
    position: 'unchanged'
}

export const title = '同传弹幕设定'

function DanmakuFragment({ state, useHandler }: StateProxy<DanmakuSchema>): JSX.Element {

    const handler = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value)
    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    const changePos = (e: typeof state.position) => {
        state.position = e
    }


    const changeOpacity = (v: number) => state.opacity = (v < 0 || v > 100) ? null : v as HundredNumber

    return (
        <Fragment>
            <div className="md:col-span-2 max-md:col-span-1">
                <Input data-testid="regex-input" crossOrigin="anonymous" variant="static" label="过滤使用的正则表达式" value={state.regex} onChange={handler('regex')} />
                <Hints values={[
                    <Fragment>
                        有关正则表达式可以到
                        <span
                            className="font-bold antialiased cursor-pointer text-sm leading-normal dark:text-white"
                            onClick={() => sendMessager('open-tab', { url: 'https://regex101.com' })}>这里</span>
                        进行测试。
                    </Fragment>,
                    '必须包含名称为cc的正则组别以捕捉字幕。',
                    '可包含名称为n的正则组别以捕捉说话者。'
                ]} />
            </div>
            <div className="md:col-span-2 max-md:col-span-1">
                <Switch
                    data-testid="danmaku-hide"
                    crossOrigin={'annoymous'}
                    label={
                        <Typography className="font-medium" >隐藏同传弹幕</Typography>
                    }
                    checked={state.hide}
                    onChange={checker('hide')}
                />
            </div>
            <div>
                <ColorInput data-testid="danmaku-color" disabled={state.hide} label="同传弹幕颜色" optional={true} onChange={handler('color')} value={state.color} />
                <Hints values={['留空不改变。']} />
            </div>
            <div>
                <AffixInput data-testid="danmaku-opacity" disabled={state.hide} label="同传弹幕透明度" suffix="%" onChange={e => changeOpacity(e.target.valueAsNumber)} value={state.opacity ?? -1} variant="static" type="number" min={-1} max={100} />
                <Hints values={['范围 0 ~ 100, -1 代表不改变。']} />
            </div>
            <Selector<typeof state.position>
                data-testid="danmaku-position"
                label="弹幕位置"
                value={state.position}
                onChange={changePos}
                disabled={state.hide}
                options={[
                    { value: 'unchanged', label: '不改变' },
                    { value: 'top', label: '置顶' },
                    { value: 'bottom', label: '置底' },
                ]}
            />
        </Fragment>
    )
}




export default DanmakuFragment