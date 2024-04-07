import { type ChangeEvent, Fragment } from 'react';
import CheckBoxListItem from '~options/components/CheckBoxListItem';

import { List } from '@material-tailwind/react';

import type { StateProxy } from "~hooks/binding";
export type SettingSchema = {
    restartButton: boolean
    blackListButton: boolean
    settingsButton: boolean
    themeToNormalButton: boolean
    supportWebFullScreen: boolean
}


export const defaultSettings: Readonly<SettingSchema> = {
    restartButton: false,
    blackListButton: true,
    settingsButton: true,
    themeToNormalButton: true,
    supportWebFullScreen: false
}

export const title = '界面按钮显示'

export const description = `此设定区块将控制你在主菜单上所显示的按钮，你可以在这里调整各个按钮的显示状态。`

function DisplaySettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {


    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    return (
        <Fragment>
            <List className="md:col-span-2 max-md:col-span-1">
                <CheckBoxListItem
                    label="支持在网页全屏下显示"
                    value={state.supportWebFullScreen}
                    onChange={checker('supportWebFullScreen')}
                />
                <CheckBoxListItem
                    label="重新启动按钮"
                    value={state.restartButton}
                    onChange={checker('restartButton')}
                />
                <CheckBoxListItem
                    label="添加到黑名单的按钮"
                    value={state.blackListButton}
                    onChange={checker('blackListButton')}
                    hint="别担心，在页面右键打开菜单仍可进行添加黑名单的动作。"
                />
                <CheckBoxListItem
                    label="设定按钮"
                    value={state.settingsButton}
                    onChange={checker('settingsButton')}
                    hint="一般情况下，你可透过点击浏览器扩展图标来进入设定界面"
                />
                <CheckBoxListItem
                    label="大海报房间新增返回正常房间按钮"
                    value={state.themeToNormalButton}
                    onChange={checker('themeToNormalButton')}
                />
            </List>
        </Fragment>
    )
}


export default DisplaySettings