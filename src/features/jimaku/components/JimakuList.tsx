import type React from "react";
import { Item, type ItemParams, Menu, useContextMenu } from 'react-contexify';
import { toast } from 'sonner/dist';
import { useKeepBottom } from '~hooks/keep-bottom';
import { useScrollOptimizer } from '~hooks/optimizer';
import { getSettingStorage, setSettingStorage } from '~utils/storage';

import JimakuLine from './JimakuLine';
import type { Jimaku } from "./JimakuLine";

import 'react-contexify/dist/ReactContexify.css';
import { useContext } from "react";
import JimakuFeatureContext from "~contexts/JimakuFeatureContext";


export type JimakuListProps = {
    jimaku: Jimaku[]
    style?: React.CSSProperties
}



function JimakuList(props: JimakuListProps): JSX.Element {

    const { jimakuZone: jimakuStyle } = useContext(JimakuFeatureContext)
    const { jimaku, style } = props


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
        toast.success(`已成功屏蔽 ${props.uname}(${props.uid}) 的同传弹幕`)
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