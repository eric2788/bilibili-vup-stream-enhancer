import styleText from 'data-text:~style.css';
import ReactShadowRoot from 'react-shadow-root';

/**
 * Renders a component that applies a Tailwind CSS scope to its children.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children to be rendered within the Tailwind scope.
 * @param {boolean} [props.dark] - Optional. Specifies whether the dark mode should be applied.
 * @param {string[]} [props.styles] - Optional. Additional styles to be applied within the Tailwind scope.
 * @returns {JSX.Element} The rendered TailwindScope component.
 */
function TailwindScope({ children, dark, styles }: { children: React.ReactNode, dark?: boolean, styles?: string[] }): JSX.Element {
    return (
        <div className={dark === true ? `dark` : ''}>
            <ReactShadowRoot>
                <style key="tailwind">{styleText}</style>
                {styles?.map((style, i) => <style key={i}>{style}</style>)}
                <div className="relative z-[3000]">
                    {children}
                </div>
            </ReactShadowRoot>
        </div>
    )
}

export default TailwindScope