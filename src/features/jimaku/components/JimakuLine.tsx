import { useEffect, useRef } from "react"
import { useRowOptimizer } from "~hooks/optimizer"

export type Jimaku = {
    text: string
    uid: number
    uname: string
    hash: string
}



export type JimakuLineProps = {
    item: Jimaku
    show: (e: React.MouseEvent<HTMLParagraphElement>) => void
    index: number
    observer: React.MutableRefObject<IntersectionObserver | null>
}


function JimakuLine({ item, show, index, observer }: JimakuLineProps): JSX.Element {

    const ref = useRowOptimizer(observer)
    
    return (
        <p ref={ref} onContextMenu={show} jimaku-hash={item.hash} jimaku-index={index} >
            {item.text}
        </p>
    )
}


export default JimakuLine
