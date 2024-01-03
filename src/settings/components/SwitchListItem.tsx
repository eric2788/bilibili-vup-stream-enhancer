import {
    ListItem, ListItemPrefix, ListItemSuffix, Switch, Typography
} from '@material-tailwind/react';

import type { colors } from "@material-tailwind/react/types/generic";
import type { ChangeEventHandler } from "react";


export type SwitchListItemProps = {
    onChange?: ChangeEventHandler<HTMLInputElement>
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    value: boolean
    label: string | ((b: boolean) => string)
    hint?: string
    color?: colors
    disabled?: boolean
}




function SwitchListItem(props: SwitchListItemProps): JSX.Element {
    return (
        <ListItem className="p-0 dark:hover:bg-gray-800 dark:focus:bg-gray-800" disabled={props.disabled}>
            <label className="flex w-full cursor-pointer items-center px-3 py-2">
                {props.prefix && (
                    <ListItemPrefix>
                        {props.prefix}
                    </ListItemPrefix>
                )}
                <Switch
                    disabled={props.disabled}
                    onChange={props.onChange}
                    crossOrigin={'annoymous'}
                    checked={props.value}
                    ripple={false}
                    color={props.color}
                    label={
                        <div>
                            <Typography className="font-medium">
                                {props.label instanceof Function ? props.label(props.value) : props.label}
                            </Typography>
                            {props.hint && <Typography variant="small" className="font-normal">
                                {props.hint}
                            </Typography>}
                        </div>
                    }
                    containerProps={{
                        className: "flex items-center p-0",
                    }}
                />
                {props.suffix && (
                    <ListItemSuffix>
                        {props.suffix}
                    </ListItemSuffix>
                )}
            </label>
        </ListItem>
    )
}


export default SwitchListItem