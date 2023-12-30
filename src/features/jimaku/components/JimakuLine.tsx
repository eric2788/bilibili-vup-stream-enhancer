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
}


function JimakuLine({ item, show, index }: JimakuLineProps): JSX.Element {
    return (
        <p onContextMenu={show} jimaku-hash={item.hash} jimaku-index={index} >
            {item.text}
        </p>
    )
}


export default JimakuLine
