import { useContext, useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import ShadowRootContext from "~contexts/ShadowRootContext";



/**
 * promote a style element to the root level of ShadowRoot.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children to be promoted inside the style element.
 * @returns {JSX.Element} - The rendered style element.
 * 
 * @example
 * import { ShadowStyle } from "~components/ShadowStyle";
 * 
 * function MyComponent() {
 *    return (
 *       // The style will be promoted to the root level of the ShadowRoot.
 *      <ShadowStyle>
 *       {`
 *          .my-class {
 *             color: red;
 *         }
 *      `}
 *      </ShadowStyle>
 *   )
 * }
 */
function ShadowStyle({ children }: { children: React.ReactNode }): JSX.Element {

    const host = useContext(ShadowRootContext)

    if (!host) {
        console.warn('No ShadowRoot found: ShadowStyle must be used inside a ShadowRoot')
    }

    return host ? createPortal(<style>{children}</style>, host) : <></>
    
}


export default ShadowStyle