import { List } from "@material-tailwind/react"
import { type ChangeEvent, Fragment } from "react"
import type { StateProxy } from "~hooks/binding"
import ExperienmentFeatureIcon from "~options/components/ExperientmentFeatureIcon"
import SwitchListItem from "~options/components/SwitchListItem"

export type AISchema = {
    summarizeEnabled: boolean
}


export const aiDefaultSettings: Readonly<AISchema> = {
    summarizeEnabled: false
}


function AIFragment({ state, useHandler }: StateProxy<AISchema>): JSX.Element {

    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    return (
        <Fragment>
            <List className="col-span-2 border border-[#808080] rounded-md">
                <SwitchListItem
                    data-testid="ai-enabled"
                    label="启用同传字幕AI总结"
                    hint="此功能将采用大语言模型对同传字幕进行总结"
                    value={state.summarizeEnabled}
                    onChange={checker('summarizeEnabled')}
                    marker={<ExperienmentFeatureIcon />}
                />
            </List>
        </Fragment>
    )
}

export default AIFragment