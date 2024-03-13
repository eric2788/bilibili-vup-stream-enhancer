import type React from "react";
import { Item, Menu, useContextMenu, type ItemParams } from 'react-contexify';
import { toast } from 'sonner/dist';
import { useKeepBottom } from '~hooks/keep-bottom';
import { useScrollOptimizer } from '~hooks/optimizer';
import { getSettingStorage, setSettingStorage } from '~utils/storage';

import type { Jimaku } from "./JimakuLine";
import JimakuLine from './JimakuLine';

import styleText from 'data-text:react-contexify/dist/ReactContexify.css';
import { useContext, useRef } from "react";
import 'react-contexify/dist/ReactContexify.css';
import JimakuFeatureContext from "~contexts/JimakuFeatureContext";
import type { UserRecord } from "~settings/features/jimaku/components/ListingFragment";
import ShadowStyle from "~components/ShadowStyle";


export type JimakuListProps = {
    jimaku: Jimaku[]
    style?: React.CSSProperties
}



function JimakuList(props: JimakuListProps): JSX.Element {

    const { jimakuZone: jimakuStyle, listingZone } = useContext(JimakuFeatureContext)
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

        const parent = element.current

        if (!parent) {
            console.warn('cannot show menu: parent is not mounted yet')
            return
        }

        const rootElement = (parent.getRootNode() as ShadowRoot).host;
        const inFullScreen = rootElement.clientHeight === 0
        // dunno why, but the clientX and clientY are not correct in fullscreen mode
        // const mouseX = inFullScreen ? parent.clientWidth / 2 + 10 : e.clientX
        // const mouseY = inFullScreen ? (e.screenY - parent.getBoundingClientRect().top) - Math.max(1400 - window.innerHeight, 0) : e.clientY

        // console.log(
        //     e.screenY,
        //     parent.getBoundingClientRect().top,
        //     window.innerHeight
        // )

        // currently we don't support fullscreen mode
        if (inFullScreen) return

        show({
            event: e,
            props: jimaku,
            // position: {
            //     x: mouseX,
            //     y: mouseY
            // }
        })
    }

    const blockUser = async ({ props }: ItemParams<Jimaku, any>) => {
        if (!window.confirm(`是否屏蔽 ${props.uname}(${props.uid}) 的同传弹幕？`)) return
        const settings = await getSettingStorage('settings.features')
        const record: UserRecord = { id: props.uid.toString(), name: props.uname, addedDate: new Date().toLocaleDateString() }
        settings.jimaku.listingZone.tongchuanBlackList.push(record)
        await setSettingStorage('settings.features', settings)
        // add blacklist for current (no need restart)
        listingZone.tongchuanBlackList.push(record)
        toast.success(`已不再接收 ${props.uname}(${props.uid}) 的同传弹幕`)
    }


    const observerRef = useScrollOptimizer({ root: element, rootMargin: '100px', threshold: 0.13 })

    return (
        <div
            id="subtitle-list"
            ref={ref}
            style={style}
            className="z-[3000] overflow-y-auto overflow-x-hidden w-full subtitle-normal">
            {jimaku.map((item, i) => (
                <JimakuLine
                    observer={observerRef}
                    index={i}
                    key={item.hash}
                    item={item}
                    show={displayContextMenu(item)}
                />
            ))}
            <ShadowStyle>{styleText}</ShadowStyle>
            <Menu id="jimaku-context-menu" style={{ zIndex: 9999 }}>
                <Item onClick={blockUser}>屏蔽选中同传发送者</Item>
            </Menu>
        </div>
    )

}


export default JimakuList