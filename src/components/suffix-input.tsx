import { Input, Typography, type InputProps } from "@material-tailwind/react"
import type { RefAttributes } from "react"


export type SuffixInputProps = {
    suffix: string
} & RefAttributes<HTMLInputElement> & InputProps

function SuffixInput(props: SuffixInputProps): JSX.Element {
    return (
        <div className="relative flex w-full">
            <Input
                crossOrigin={'annoymous'}
                {...props}
                containerProps={{
                    className: "min-w-0",
                }}
            />
            <div className="flex items-end px-3 text-blue-gray-500 dark:text-gray-400">
                <Typography as={'span'} className="antialiased">{props.suffix}</Typography>
            </div>
        </div>
    )
}

export default SuffixInput