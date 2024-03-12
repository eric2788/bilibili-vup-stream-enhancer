import { useEffect, useRef, useState } from "react"
import ReactShadowRoot from "react-shadow-root"
import ShadowRootContext from "~contexts/ShadowRootContext"


export type ShadowRootProps = {
    children: React.ReactNode
    styles: string[]
}


function ShadowRoot({ children, styles }: ShadowRootProps): JSX.Element {

    const reactShadowRoot = useRef<ReactShadowRoot>(null)
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot>(null)

    useEffect(() => {

        if (reactShadowRoot.current) {
            setShadowRoot(reactShadowRoot.current.shadowRoot)
            console.debug('ShadowRoot created')
        }

    }, [])

    return (
        <ReactShadowRoot ref={reactShadowRoot}>
            {styles?.map((style, i) => <style key={i}>{style}</style>)}
            <div className="relative">
                {shadowRoot && (
                    <ShadowRootContext.Provider value={shadowRoot}>
                        {children}
                    </ShadowRootContext.Provider>
                )}
            </div>
        </ReactShadowRoot>
    )

}

export default ShadowRoot