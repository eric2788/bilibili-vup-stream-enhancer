import { Switch, Typography } from "@material-tailwind/react"
import { type ChangeEvent } from "react"
import type { StateProxy } from "~hooks/binding"
import ColorInput from "~settings/components/ColorInput"
import type { HexColor } from "~types/common"
import type { FeatureSettingsDefinition } from ".."

export const title: string = '醒目留言'

export const define: FeatureSettingsDefinition = {
    offlineTable: 'superchats'
}

export type FeatureSettingSchema = {
    floatingButtonColor: HexColor,
    buttonColor: HexColor,
    displayFullScreen: boolean
}

export const defaultSettings: Readonly<FeatureSettingSchema> = {
    floatingButtonColor: '#db7d1f',
    buttonColor: '#db7d1f',
    displayFullScreen: true
}


function SuperchatFeatureSettings({ state, useHandler }: StateProxy<FeatureSettingSchema>): JSX.Element {

    const str = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value)
    const bool = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    return (
        <div className="grid max-md:grid-cols-1 md:grid-cols-2 gap-10">
            <ColorInput data-testid="floater-color" label="浮动按钮颜色" value={state.floatingButtonColor} onChange={str('floatingButtonColor')} />
            <ColorInput data-testid="operator-color" label="操作按钮颜色" value={state.buttonColor} onChange={str('buttonColor')} />
            <div className="md:col-span-2 max-md:col-span-1">
                <Switch
                    crossOrigin={'annoymous'}
                    label={
                        <Typography className="font-medium" >在全屏模式下显示</Typography>
                    }
                    checked={state.displayFullScreen}
                    onChange={bool('displayFullScreen')}
                />
            </div>
        </div>
    )
}


export default SuperchatFeatureSettings