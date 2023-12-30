import styled from "@emotion/styled"
import { useInterval, useMutationObserver } from "@react-hooks-library/core"
import { useEffect, useMemo, useState } from "react"
import { Item, Menu, useContextMenu, type ItemParams } from "react-contexify"
import { toast } from "sonner/dist"
import type { StreamInfo } from "~api/bilibili"
import { sendForward } from "~background/forwards"
import { useBLiveMessageCommand } from "~hooks/message"
import type { Settings } from "~settings"
import type { SettingSchema as JimakuSchema } from "~settings/fragments/jimaku"
import { randomString, rgba, toStreamingTime } from "~utils/misc"
import type { Jimaku } from "./JimakuLine"
import JimakuLine from "./JimakuLine"

import "react-contexify/dist/ReactContexify.css"
import { createPortal } from "react-dom"
import { Rnd } from "react-rnd"
import { useWebScreenChange, type WebScreenStatus } from "~hooks/bilibili"
import { useTeleport } from "~hooks/teleport"
import { getSettingStorage, setSettingStorage } from "~utils/storage"
import { parseJimaku } from ".."

const createJimakuScope = (jimakuStyle: JimakuSchema) => styled.div`
.subtitle-normal::-webkit-scrollbar {
    width: 5px;
}

.subtitle-normal::-webkit-scrollbar-track {
    background-color: ${jimakuStyle.backgroundColor};
}

.subtitle-normal::-webkit-scrollbar-thumb {
    background-color: ${jimakuStyle.color};
}
#subtitle-list p:first-of-type {
    animation: ${jimakuStyle.animation} .3s ease-out;
    font-size: ${jimakuStyle.firstLineSize}px;
}
#subtitle-list p {
    font-weight: bold;
    color: ${jimakuStyle.color}; 
    opacity: 1.0; 
    margin: ${jimakuStyle.lineGap}px 0px;
    font-size: ${jimakuStyle.size}px;  
}
`

function warnIfAdaptive() {
    // warn: this will make context menu wrong position
    if (!document.documentElement.getAttribute('lab-style').includes('adaptive')) return
    toast.error(`检测到你已启用屏幕适配，这将导致字幕右键菜单位置错乱，建议关闭。`, {
        position: 'top-center',
        duration: 10000,
    })
}

export type JimakuAreaProps = {
    settings: Settings
    info: StreamInfo
}

const transactions: Jimaku[] = []

function JimakuArea({ settings, info }: JimakuAreaProps): JSX.Element {

    const jimakuStyle = settings['settings.jimaku']
    const dev = settings['settings.developer']
    const { jimakuPopupWindow } = settings["settings.features"]
    const { regex } = settings['settings.danmaku']
    const Area = useMemo(() => createJimakuScope(jimakuStyle), [settings])

    const { show } = useContextMenu({
        id: 'jimaku-context-menu'
    })


    useMutationObserver(document.documentElement, (mutations) => {
        mutations.find((mu) => mu.type === 'attributes' && mu.attributeName === 'lab-style') && warnIfAdaptive()
    }, { attributes: true })

    useEffect(() => {
        // make danmaku chat list peer with video 
        const chatListArea = document.querySelector('div#aside-area-vm') as HTMLDivElement
        chatListArea.style.marginBottom = `${jimakuStyle.backgroundHeight + 30}px`
        warnIfAdaptive()
        return () => {
            document.querySelector('div#jimaku-full-area')?.remove()
            delete chatListArea.style.marginBottom
        }
    }, [])

    const [jimaku, setJimaku] = useState<Jimaku[]>([])

    useBLiveMessageCommand('DANMU_MSG', (data) => {
        const jimaku = parseJimaku(data.info[1], regex)
        if (jimaku === undefined) return
        console.info(`[BJF] ${data.info[2][1]} => ${data.info[1]} (${data.info[0][5]})`)
        const jimakuBlock = {
            text: data.info[1],
            uid: data.info[2][0],
            uname: data.info[2][1],
            hash: randomString() + Date.now() + data.info[0][5],
        }
        transactions.push(jimakuBlock)
    })

    useInterval(() => {
        if (transactions.length === 0) return
        const jimaku = transactions.shift()
        setJimaku((prev) => [jimaku, ...prev])
        if (jimakuPopupWindow) {
            sendForward('pages', 'jimaku', { date: toStreamingTime(info.liveTime), text: jimaku.text, room: info.room })
        }
    }, 500)

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

    const screenStatus = useWebScreenChange(dev.classes)

    const { Teleport, rootContainer } = useTeleport(screenStatus, {
        parentQuerySelector: dev.elements.jimakuFullArea,
        id: 'jimaku-full-area',
        placement: (parent, child) => {
            parent.insertAdjacentElement('afterend', child)
        },
        shouldPlace: (status) => status !== 'normal'
    })

    const subTitleStyle: React.CSSProperties = {
        height: jimakuStyle.backgroundHeight,
        backgroundColor: jimakuStyle.backgroundColor,
        color: jimakuStyle.color,
        fontSize: jimakuStyle.size,
        textAlign: jimakuStyle.position,
        scrollbarWidth: 'thin',
        scrollbarColor: `${jimakuStyle.color} ${jimakuStyle.backgroundColor}`
    }

    if (screenStatus !== 'normal') {
        subTitleStyle.position = 'absolute'
        subTitleStyle.cursor = 'move'
        subTitleStyle.width = '100%'
        subTitleStyle.height = '100%'
        subTitleStyle.backgroundColor = rgba(jimakuStyle.backgroundColor, (jimakuStyle.backgroundOpacity / 100))
    }


    const subtitleList = (
        <div
            id="subtitle-list"
            style={subTitleStyle}
            className="z-[9999] overflow-y-auto overflow-x-hidden w-full subtitle-normal">
            {jimaku.map((item, i) => (<JimakuLine index={i} key={item.hash} item={item} show={displayContextMenu(item)}></JimakuLine>))}
            <Menu id="jimaku-context-menu">
                <Item onClick={blockUser}>屏蔽选中同传发送者</Item>
            </Menu>
        </div>
    )

    return (
        <Teleport container={rootContainer}>
            <Area>
                {screenStatus === 'normal' ? subtitleList : (
                    <Rnd
                        style={{zIndex: 9999}}
                        default={{
                            x: 100,
                            y: -300,
                            width: '50%',
                            height: jimakuStyle.backgroundHeight,
                        }}>
                        {subtitleList}
                    </Rnd>
                )}
            </Area>
        </Teleport>
    )
}


export default JimakuArea





const JimakuFullArea = ({ screenStatus, children, settings }: { screenStatus: WebScreenStatus, children: React.ReactNode, settings: Settings }) => {
    const el = document.createElement('div');

    useEffect(() => {
        const videoFullArea = document.querySelector(settings["settings.developer"].elements.jimakuFullArea);
        if (screenStatus === 'normal') {
            el.remove();
        } else if (videoFullArea) {
            el.id = 'jimaku-full-area';
            videoFullArea.insertAdjacentElement('afterend', el);
        }
        return () => {
            el.remove();
        };
    }, [screenStatus]);

    return createPortal(children, el);
};
