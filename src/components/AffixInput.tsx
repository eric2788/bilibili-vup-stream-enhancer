import { Input, Typography, type InputProps } from "@material-tailwind/react"
import type { RefAttributes } from "react"


export type AffixInputProps = {
    suffix?: string
    prefix?: string
} & RefAttributes<HTMLInputElement> & InputProps

function AffixInput(props: AffixInputProps): JSX.Element {

    const { suffix, prefix, ...attrs } = props

    return (
        <div className="relative flex w-full">
            {prefix &&
                <div className="flex items-end pr-3 text-blue-gray-500 dark:text-gray-400">
                    <Typography as={'span'} className="antialiased">{prefix}</Typography>
                </div>
            }
            <Input
                crossOrigin={'annoymous'}
                {...attrs}
                containerProps={{
                    className: "min-w-0",
                }}
            />
            {suffix &&
                <div className="flex items-end pl-3 text-blue-gray-500 dark:text-gray-400">
                    <Typography as={'span'} className="antialiased">{suffix}</Typography>
                </div>
            }
        </div>
    )
}

export default AffixInput