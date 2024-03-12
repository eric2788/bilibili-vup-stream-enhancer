import { useContext, useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import ShadowRootContext from "~contexts/ShadowRootContext";



function ShadowStyle({ children }: { children: React.ReactNode }): JSX.Element {

    const host = useContext(ShadowRootContext)

    if (!host) {
        console.warn('No ShadowRoot found: ShadowStyle must be used inside a ShadowRoot')
    }

    return host ? createPortal(<style>{children}</style>, host) : <></>
    
}


export default ShadowStyle