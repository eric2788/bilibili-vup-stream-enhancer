import { Input, type InputProps, Typography } from '@material-tailwind/react';

import type { RefAttributes } from "react";


export type AffixInputProps = {
    suffix?: string
    prefix?: string
} & RefAttributes<HTMLInputElement> & InputProps

function AffixInput(props: AffixInputProps): JSX.Element {

    const { suffix, prefix, disabled, ...attrs } = props

    return (
        <div className="relative flex w-full">
            {prefix &&
                <div className={`flex items-end pr-3 text-blue-gray-500 dark:text-gray-400 ${disabled ? 'opacity-50' : ''}`}>
                    <Typography as={'span'} className="antialiased">{prefix}</Typography>
                </div>
            }
            <Input
                crossOrigin={'annoymous'}
                {...attrs}
                disabled={disabled}
                containerProps={{
                    className: "min-w-0",
                }}
                className="disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {suffix &&
                <div className={`flex items-end pl-3 text-blue-gray-500 dark:text-gray-400 ${disabled ? 'opacity-50' : ''}`}>
                    <Typography as={'span'} className="antialiased">{suffix}</Typography>
                </div>
            }
        </div>
    )
}

export default AffixInput