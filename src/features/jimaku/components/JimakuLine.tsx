import { useRowOptimizer } from '~hooks/optimizer';

// here must be a subset of database Jimaku schema
export type Jimaku = {
    date: string
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

    const ref = useRowOptimizer<HTMLParagraphElement>(observer)

    return (
        <p ref={ref} onContextMenu={show} jimaku-hash={item.hash} jimaku-index={index} >
            {item.text}
        </p>
    )
}


export default JimakuLine
