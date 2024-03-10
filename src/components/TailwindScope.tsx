import ShadowRoot from './ShadowRoot';
import styleText from 'data-text:~style.css';

/**
 * Renders a component that applies a Tailwind CSS scope to its children.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children to be rendered within the Tailwind scope.
 * @param {boolean} [props.dark] - Optional. Specifies whether the dark mode should be applied.
 * @returns {JSX.Element} The rendered TailwindScope component.
 */
function TailwindScope({ children, dark }: { children: React.ReactNode, dark?: boolean }): JSX.Element {
    return (
        <div className={dark === true ? `dark` : ''}>
            <ShadowRoot>
                <style>{styleText}</style>
                {children}
            </ShadowRoot>
        </div>
    )
}

export default TailwindScope