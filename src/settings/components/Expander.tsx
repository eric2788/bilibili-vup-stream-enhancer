import { Collapse } from "@material-tailwind/react"
import { useToggle } from "@react-hooks-library/core"
import { Fragment } from "react"

export type ExpanderProps = {
    title: string
    expanded?: boolean
    toggle?: VoidFunction
    prefix?: React.ReactNode
    colorClass?: string
    hoverColorClass?: string
    children: React.ReactNode
}

function Expander(props: ExpanderProps): JSX.Element {

    const color = props.colorClass ?? 'bg-gray-300 dark:bg-gray-800'
    const hoverColor = props.hoverColorClass ?? 'hover:bg-gray-400 dark:hover:bg-gray-900'
    const { toggle: internalToggle, bool: internalExpanded } = useToggle()
    const { title, expanded, toggle, children, prefix } = props

    return (
        <Fragment>
            <div onClick={toggle ?? internalToggle} className={`
                            cursor-pointer border border-[#d1d5db] dark:border-[#4b4b4b6c] px-5 py-3 ${color} w-full text-lg ${expanded ? '' : 'shadow-lg'}
                            ${(expanded ?? internalExpanded) ? 'rounded-t-lg border-b-0' : 'rounded-lg'} ${hoverColor}`}>
                <div className="flex items-center gap-3 dark:text-white">
                    {prefix}
                    <span>{title}</span>
                </div>
            </div>
            <Collapse open={expanded ?? internalExpanded}>
                {children}
            </Collapse>
        </Fragment>
    )
}

export default Expander