import type { ComponentType } from "react"


export type ConditionWrapperProps<P extends {}> = {
    condition: boolean
    children: React.ReactNode
    as: ComponentType<P>
} & P

function ConditionalWrapper<P extends {}>({ condition, children, as: Component, ...rest }: ConditionWrapperProps<P>): JSX.Element {
    if (condition) {
        return <Component {...rest as unknown as P}>{children}</Component>
    } else {
        return <>{children}</>
    }
}


export default ConditionalWrapper