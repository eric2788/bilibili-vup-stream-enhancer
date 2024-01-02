import { Switch, Typography, ListItem } from "@material-tailwind/react"
import type { ChangeEventHandler } from "react"


export type SwitchListItemProps = {
    onChange?: ChangeEventHandler<HTMLInputElement>
    value: boolean
    label: string
    hint?: string
}




function SwitchListItem(props: SwitchListItemProps): JSX.Element {
    return (
        <ListItem className="p-0">
            <label className="flex w-full cursor-pointer items-center px-3 py-2">
                <Switch
                    onChange={props.onChange}
                    crossOrigin={'annoymous'}
                    checked={props.value}
                    ripple={false}
                    label={
                        <div>
                            <Typography color="blue-gray" className="font-medium">
                                {props.label}
                            </Typography>
                            {props.hint && <Typography variant="small"  className="font-normal">
                                {props.hint}
                            </Typography>}
                        </div>
                    }
                    containerProps={{
                        className: "flex items-center p-0",
                    }}
                />
            </label>
        </ListItem>
    )
}


export default SwitchListItem