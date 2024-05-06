import {
    Checkbox, ListItem, ListItemPrefix, ListItemSuffix, Tooltip, Typography
} from '@material-tailwind/react';
import type { ChangeEventHandler } from "react";


export type CheckboxListItemProps = {
    onChange?: ChangeEventHandler<HTMLInputElement>
    suffix?: React.ReactNode
    value: boolean
    label: string
    hint?: string
}

function CheckBoxListItem(props: CheckboxListItemProps): JSX.Element {
    return (
        <ListItem className="p-0 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
            <label className="flex w-full cursor-pointer items-center px-3 py-2">
                <ListItemPrefix className="mr-3">
                    <Checkbox
                        data-testid={props['data-testid']}
                        onChange={props.onChange}
                        checked={props.value}
                        crossOrigin={'annoymous'}
                        ripple={false}
                        className="hover:before:opacity-0"
                        containerProps={{
                            className: "p-0",
                        }}
                    />
                </ListItemPrefix>
                <Typography className="font-medium">
                    {props.label}
                </Typography>
                {props.hint && <Tooltip content={props.hint}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-sm dark:stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                </Tooltip>}
                {props.suffix && (
                    <ListItemSuffix>
                        {props.suffix}
                    </ListItemSuffix>
                )}
            </label>
        </ListItem>
    )
}



export default CheckBoxListItem