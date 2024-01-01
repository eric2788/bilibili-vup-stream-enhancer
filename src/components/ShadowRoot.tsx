import { useEffect, useRef } from 'react';

function ShadowRoot({ children }) {
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