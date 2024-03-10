import { useEffect, useRef } from 'react';

/**
 * Renders a component that attaches a shadow root to a DOM element and sets its inner HTML to a slot.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the shadow root.
 * @returns {React.ReactElement} The rendered component.
 * @example
 * // Usage:
 * <ShadowRoot>
 *   <div>Hello, world!</div>
 * </ShadowRoot>
 */
function ShadowRoot({ children }: { children: React.ReactNode }): JSX.Element {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      const shadowRoot = ref.current.attachShadow({ mode: 'open' })
      shadowRoot.innerHTML = '<slot></slot>'
    }
  }, []);

  return <div ref={ref}>{children}</div>
}

export default ShadowRoot