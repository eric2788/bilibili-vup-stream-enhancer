import type { ComponentType } from "react"


/**
 * Props for the ConditionalWrapper component.
 * @template P - The type of additional props for the wrapped component.
 */
export type ConditionWrapperProps<P extends {}> = {
    condition: boolean;
    children: React.ReactNode;
    as: ComponentType<P>;
} & P;

/**
 * Wraps the children with a specified component if a condition is met, otherwise returns the children as is.
 *
 * @template P - The props type of the component.
 * @param {Object} props - The component props.
 * @param {boolean} props.condition - The condition to check.
 * @param {React.ReactNode} props.children - The children to wrap.
 * @param {React.ComponentType<P>} props.as - The component to wrap the children with.
 * @param {P} props.rest - The rest of the props to pass to the wrapped component.
 * @returns {JSX.Element} - The wrapped or unwrapped children.
 *
 * @example
 * // Wraps the children with a <div> component if the condition is true.
 * <ConditionalWrapper condition={true} as="div">
 *   <p>Hello, world!</p>
 * </ConditionalWrapper>
 *
 * @example
 * // Returns the children as is if the condition is false.
 * <ConditionalWrapper condition={false} as="div">
 *   <p>Hello, world!</p>
 * </ConditionalWrapper>
 */
function ConditionalWrapper<P extends {}>({ condition, children, as: Component, ...rest }: ConditionWrapperProps<P>): JSX.Element {
    if (condition) {
        return <Component {...rest as unknown as P}>{children}</Component>
    } else {
        return <>{children}</>
    }
}


export default ConditionalWrapper