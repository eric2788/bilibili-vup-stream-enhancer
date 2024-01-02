import type React from "react"
import { Item, Menu, useContextMenu, type ItemParams } from "react-contexify"
import { toast } from "sonner/dist"
import { useKeepBottom } from "~hooks/keep-bottom"
import { type SettingSchema as JimakuSchema } from "~settings/fragments/jimaku"
import { getSettingStorage, setSettingStorage } from "~utils/storage"
import type { Jimaku } from "./JimakuLine"
import JimakuLine from "./JimakuLine"
import { useEffect, useRef } from "react"
import { root } from "postcss"
import { useScrollOptimizer } from "~hooks/optimizer"



export type JimakuListProps = {
    schema: JimakuSchema
    jimaku: Jimaku[]
    style?: React.CSSProperties
}



function JimakuList(props: JimakuListProps): JSX.Element {

    const { jimaku, style, schema: jimakuStyle } = props


    const { ref, element } = useKeepBottom<HTMLDivElement>(
        jimakuStyle.order === 'bottom',
        (el) => el.scrollHeight - jimakuStyle.backgroundHeight,
        [jimaku]
    )


    const { show } = useContextMenu({
        id: 'jimaku-context-menu'
    })

    const displayContextMenu = (jimaku: Jimaku) => (e: React.MouseEvent<Element>) => {
        show({ event: e, props: jimaku })
    }

    const blockUser = async ({ props }: ItemParams<any, any>) => {
        if (!window.confirm(`是否屏蔽 ${props.uname}(${props.uid}) 的同传弹幕？`)) return
        const settings = await getSettingStorage('settings.listings')
        settings.tongchuanBlackList.push({ id: props.uid, name: props.uname, addedDate: new Date().toLocaleDateString() })
        await setSettingStorage('settings.listings', settings)
        toast.success(`已成功屏蔽 ${props.uname}(${props.uid}) 的同传弹幕`, { position: 'bottom-center' })
    }


    const observerRef = useScrollOptimizer({ root: element, rootMargin: '100px', threshold: 0.13 })

    return (
        <div
            id="subtitle-list"
            ref={ref}
            style={style}
            className="z-[9999] overflow-y-auto overflow-x-hidden w-full subtitle-normal">
            {jimaku.map((item, i) => (
                <JimakuLine
                    observer={observerRef}
                    index={i}
                    key={item.hash}
                    item={item}
                    show={displayContextMenu(item)}
                />
            ))}
            <Menu id="jimaku-context-menu">
                <Item onClick={blockUser}>屏蔽选中同传发送者</Item>
            </Menu>
        </div>
    )

}


export default JimakuList