import { useEffect, useRef, useState } from "react"
import ReactShadowRoot from "react-shadow-root"
import ShadowRootContext from "~contexts/ShadowRootContext"

/**
 * Props for the ShadowRoot component.
 */
export type ShadowRootProps = {
  /**
   * The children of the ShadowRoot component.
   */
  children: React.ReactNode
  /**
   * An array of styles to be applied to the ShadowRoot component.
   */
  styles: string[]
  /**
   * Specifies whether the ShadowRoot component should have a line wrap or not.
   */
  noWrap?: boolean
}

/**
 * Renders a component that creates a shadow root and provides it as a context value.
 *
 * @component
 * @example
 * // Example usage of ShadowRoot component
 * function App() {
 *   const styles = ['body { background-color: lightgray }']
 *   return (
 *     <div>
 *       <h1>App</h1>
 *       <ShadowRoot styles={styles}>
 *         <h2>ShadowRoot Content</h2>
 *       </ShadowRoot>
 *     </div>
 *   )
 * }
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the shadow root.
 * @param {string[]} props.styles - An array of CSS styles to be applied to the shadow root.
 * @returns {JSX.Element} The rendered ShadowRoot component.
 */
function ShadowRoot({ children, styles, noWrap = false }: ShadowRootProps): JSX.Element {
  const reactShadowRoot = useRef<ReactShadowRoot>(null)
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot>(null)

  useEffect(() => {
    if (reactShadowRoot.current) {
      setShadowRoot(reactShadowRoot.current.shadowRoot)
      console.debug("ShadowRoot created")
    }
  }, [])

  const child = shadowRoot && (
    <ShadowRootContext.Provider value={shadowRoot}>
      {children}
    </ShadowRootContext.Provider>
  )

  return (
    <ReactShadowRoot ref={reactShadowRoot}>
      {styles?.map((style, i) => (
        <style key={i}>{style}</style>
      ))}
      {noWrap ? child : (
        <div className="relative">{child}</div>
      )}
    </ReactShadowRoot>
  )
}

export default ShadowRoot
