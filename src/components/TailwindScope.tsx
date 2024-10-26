import styleText from 'data-text:~style.css';
import ShadowRoot from '~components/ShadowRoot';

/**
 * Renders a component that applies a Tailwind CSS scope to its children.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children to be rendered within the Tailwind scope.
 * @param {boolean} [props.dark] - Optional. Specifies whether the dark mode should be applied.
 * @returns {JSX.Element} The rendered TailwindScope component.
 */
function TailwindScope({ children, dark, noWrap = false }: { children: React.ReactNode, dark?: boolean, noWrap?: boolean }): JSX.Element {
    return (
        <div className={dark === true ? `dark` : ''}>
            <ShadowRoot styles={[styleText]} noWrap={noWrap}>
                {children}
            </ShadowRoot>
        </div>
    )
}

export default TailwindScope