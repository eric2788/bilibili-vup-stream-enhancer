import styled from "@emotion/styled";
import { useClickOutside } from "@react-hooks-library/core";
import { memo, useState } from "react";
import { Menu as ContextMenu, Item, useContextMenu } from "react-contexify";
import { createPortal } from "react-dom";
import VirtualScroller from "virtual-scroller/react";
import { injectFunction } from "~background/functions";
import TailwindScope from "~components/TailwindScope";
import { useWindowMessage } from "~hooks/window-message";
import type { Settings } from "~settings";
import type { SettingSchema as ButtonSchema } from "~settings/fragments/button";
import type { SettingSchema as JimakuSchema } from "~settings/fragments/jimaku";
import { sendMessager, sendWindowMessage } from "~utils/messaging";
import type { FeatureHookRender } from ".";


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
div#subtitle-list p:first-of-type {
    font-size: ${jimakuStyle.firstLineSize}px;
}
div#subtitle-list p {
    animation: ${jimakuStyle.animation} .3s ease-out;
    font-weight: bold;
    color: ${jimakuStyle.color}; 
    opacity: 1.0; 
    margin: ${jimakuStyle.lineGap}px;
    font-size: ${jimakuStyle.size}px;  
}
`

function JimakuLine({ item, show }: { item: string, show: (e: React.MouseEvent<HTMLParagraphElement>) => void }): JSX.Element {
    return (
        <p key={item} onContextMenu={show}>
            {item}
        </p>
    )
}

function JimakuArea({ settings }: { settings: Settings }): JSX.Element {

    const jimakuStyle = settings['settings.jimaku']

    const Area = createJimakuScope(jimakuStyle)

    const { show, hideAll } = useContextMenu({
        id: 'jimaku-context-menu'
    })

    useClickOutside(document.getElementById('jimaku-context-menu'), hideAll, { event: 'pointerdown' })

    const [jimaku, setJimaku] = useState<string[]>([])

    useWindowMessage('blive-ws', (data) => {
        console.info('received blive-ws: ', data)
    })

    return (
        <Area>
            <div id="subtitle-list" style={{
                height: jimakuStyle.backgroundHeight,
                backgroundColor: jimakuStyle.backgroundColor,
                color: jimakuStyle.color,
                fontSize: jimakuStyle.size,
                textAlign: jimakuStyle.position,
                scrollbarWidth: 'thin',
                scrollbarColor: `${jimakuStyle.color} ${jimakuStyle.backgroundColor}`
            }} className="z-10 overflow-y-auto overflow-x-hidden w-full subtitle-normal">
                <VirtualScroller
                    items={jimaku}
                    itemComponent={memo(JimakuLine)}
                    itemComponentProps={{ show: (e: React.MouseEvent<HTMLParagraphElement>) => show({ event: e }) }}
                />
            </div>
            <ContextMenu id="jimaku-context-menu" className="fixed z-[9999] bg-[#1b1a1a] cursor-pointer">
                <Item className="px-3 py-2 text-[#dbdbdb] text-[12px] cursor-pointer hover:bg-gray-800">屏蔽选中同传发送者</Item>
                <Item className="px-3 py-2 text-[#dbdbdb] text-[12px] cursor-pointer hover:bg-gray-800">hello 123</Item>
            </ContextMenu>
        </Area>
    )
}


function JimakuButton({ onClick, btnStyle, children }: { onClick?: VoidFunction, btnStyle: ButtonSchema, children: React.ReactNode }): JSX.Element {
    return (
        <button
            onClick={onClick}
            style={{
                backgroundColor: btnStyle.backgroundColor,
                color: btnStyle.textColor
            }}
            className="m-[5px] px-[20px] py-[10px] rounded-md text-[15px] cursor-pointer">
            {children}
        </button>
    )
}

function ButtonArea({ settings }: { settings: Settings }): JSX.Element {

    const btnStyle = settings['settings.button']
    const features = settings["settings.features"]

    console.info('backgroundListColor: ', btnStyle.backgroundListColor)

    const testClick = async () => {
        const result = await sendMessager('inject-js', {
            function: injectFunction('getBLiveCachedData', 'roomInitRes')
        })
        if (!result) return
        console.info('inject: ', result[0].result.data)
        console.info('sandbox: ', window)
    }

    return (
        <div style={{ backgroundColor: btnStyle.backgroundListColor }} className="text-center overflow-x-auto flex justify-center gap-3">
            <JimakuButton btnStyle={btnStyle}>
                删除所有字幕记录
            </JimakuButton>
            {features.enabledRecording.includes('jimaku') &&
                <JimakuButton btnStyle={btnStyle}>
                    下载字幕记录
                </JimakuButton>
            }
            {features.jimakuPopupWindow &&
                <JimakuButton btnStyle={btnStyle}>
                    弹出同传视窗
                </JimakuButton>
            }
            <JimakuButton btnStyle={btnStyle} onClick={testClick}>
                測試按鈕
            </JimakuButton>
        </div>
    )
}

const handler: FeatureHookRender = async (settings, info) => {
    console.info('hello world from jimaku.tsx!')

    const dev = settings['settings.developer']

    const playerSection = document.querySelector('div.player-section')
    const jimakuArea = document.createElement('div')
    jimakuArea.id = 'jimaku-area'
    playerSection.insertAdjacentElement('afterend', jimakuArea)

    return [
        createPortal(
            <TailwindScope>
                <JimakuArea settings={settings} />
                <ButtonArea settings={settings} />
            </TailwindScope>
            , jimakuArea)
    ]
}

export default handler