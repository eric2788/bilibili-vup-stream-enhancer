import { useEffect, useRef, useState } from "react"
import ReactShadowRoot from "react-shadow-root"
import ShadowRootContext from "~contexts/ShadowRootContext"


export type ShadowRootProps = {
    children: React.ReactNode
    styles: string[]
}


/**
 * Renders a component that creates a shadow root and provides it as a context value.
 *
 * @component
 * @example
 * // Example usage of ShadowRoot component
 * function App() {
 *   const styles = ['body { background-color: lightgray; }'];
 *   return (
 *     <div>
 *       <h1>App</h1>
 *       <ShadowRoot styles={styles}>
 *         <h2>ShadowRoot Content</h2>
 *       </ShadowRoot>
 *     </div>
 *   );
 * }
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the shadow root.
 * @param {string[]} props.styles - An array of CSS styles to be applied to the shadow root.
 * @returns {JSX.Element} The rendered ShadowRoot component.
 */
function ShadowRoot({ children, styles }: ShadowRootProps): JSX.Element {
    const reactShadowRoot = useRef<ReactShadowRoot>(null);
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot>(null);

    useEffect(() => {
        if (reactShadowRoot.current) {
            setShadowRoot(reactShadowRoot.current.shadowRoot);
            console.debug('ShadowRoot created');
        }
    }, []);

    return (
        <ReactShadowRoot ref={reactShadowRoot}>
            {styles?.map((style, i) => (
                <style key={i}>{style}</style>
            ))}
            <div className="relative">
                {shadowRoot && (
                    <ShadowRootContext.Provider value={shadowRoot}>
                        {children}
                    </ShadowRootContext.Provider>
                )}
            </div>
        </ReactShadowRoot>
    );
}

export default ShadowRoot