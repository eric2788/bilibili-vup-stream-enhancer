import styled from "@emotion/styled"
import { useInterval } from "@react-hooks-library/core"
import { Fragment, useEffect, useMemo, useState } from "react"
import type { StreamInfo } from "~api/bilibili"
import { sendForward } from "~background/forwards"
import { useBLiveMessageCommand } from "~hooks/message"
import type { Settings } from "~settings"
import type { SettingSchema as JimakuSchema } from "~settings/fragments/jimaku"
import { getTimeStamp, randomString, rgba, toStreamingTime } from "~utils/misc"
import type { Jimaku } from "./JimakuLine"

import "react-contexify/dist/ReactContexify.css"
import { createPortal } from "react-dom"
import { Rnd } from "react-rnd"
import ConditionalWrapper from "~components/ConditionalWrapper"
import { useWebScreenChange } from "~hooks/bilibili"
import { useTeleport } from "~hooks/teleport"
import { parseJimaku } from ".."
import JimakuList from "./JimakuList"

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
#subtitle-list p:${jimakuStyle.order === 'top' ? 'first' : 'last'}-of-type {
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


export type JimakuAreaProps = {
    settings: Settings
    info: StreamInfo
}

const transactions: Jimaku[] = []

function JimakuArea({ settings, info }: JimakuAreaProps): JSX.Element {

    const jimakuStyle = settings['settings.jimaku']
    const dev = settings['settings.developer']
    const { jimakuPopupWindow, useStreamingTime } = settings["settings.features"]
    const { regex } = settings['settings.danmaku']
    const Area = useMemo(() => createJimakuScope(jimakuStyle), [jimakuStyle])

    useEffect(() => {
        // make danmaku chat list peer with video 
        const chatListArea = document.querySelector('div#aside-area-vm') as HTMLDivElement
        chatListArea.style.marginBottom = `${jimakuStyle.backgroundHeight + 30}px`
        return () => {
            document.querySelector('div#jimaku-full-area')?.remove()
            delete chatListArea.style.marginBottom
        }
    }, [])

    const [jimaku, setJimaku] = useState<Jimaku[]>([])

    useBLiveMessageCommand('DANMU_MSG', (data) => {
        const jimaku = parseJimaku(data.info[1], regex)
        //if (jimaku === undefined) return
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
        setJimaku((prev) => jimakuStyle.order === 'top' ? [jimaku, ...prev] : [...prev, jimaku])
        const datetime = useStreamingTime ? toStreamingTime(info.liveTime) : getTimeStamp()
        if (jimakuPopupWindow) {
            sendForward('pages', 'jimaku', { date: datetime, text: jimaku.text, room: info.room })
        }
    }, 500)

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

    const [visible, setVisible] = useState(true)

    if (screenStatus !== 'normal') {
        subTitleStyle.position = 'absolute'
        subTitleStyle.cursor = 'move'
        subTitleStyle.width = '100%'
        subTitleStyle.height = '100%'
        subTitleStyle.backgroundColor = rgba(jimakuStyle.backgroundColor, (jimakuStyle.backgroundOpacity / 100))
    }

    return (
        <Fragment>
            <Teleport container={rootContainer}>
                <Area>
                    <ConditionalWrapper
                        as={Rnd}
                        condition={screenStatus !== 'normal'}
                        bounds={dev.elements.danmakuArea}
                        style={{ zIndex: 9999, display: visible ? 'block' : 'none' }}
                        minHeight={100}
                        minWidth={200}
                        scale={0.93}
                        default={{
                            x: 100,
                            y: -300,
                            width: '50%',
                            height: jimakuStyle.backgroundHeight,
                        }}
                    >
                        <JimakuList
                            schema={jimakuStyle}
                            jimaku={jimaku}
                            style={subTitleStyle}
                        />
                    </ConditionalWrapper>
                </Area>
            </Teleport>
            {
                screenStatus !== 'normal' && createPortal(
                    <span title="字幕切换显示" onClick={() => setVisible(!visible)} className="icon-item danmu-block-icon live-skin-main-text align-top inline-block mx-2 cursor-pointer">
                        {visible ?
                            <svg width="24" height="24" viewBox="0 0 1034 1034" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1">
                                <path fill="currentColor"
                                    d="M499 226q-166 0 -280 117q-58 58 -88.5 131t-30.5 152.5t30 152t87.5 130t130 87.5t152 30t153.5 -30.5t133 -88.5q56 -55 85 -127t29 -153.5t-29.5 -154t-85.5 -128.5q-118 -118 -286 -118zM501 299q135 0 232 96q46 47 70.5 106t24.5 125q0 138 -94 230
                                        q-48 47 -108.5 72t-125 25t-124 -24.5t-106.5 -71.5t-72.5 -106.5t-25.5 -124.5t25.5 -124.5t72.5 -107.5q94 -95 231 -95zM389 502q-50 0 -83.5 33.5t-33.5 91.5t33 91t86 33q34 0 62 -17t43 -46l-49 -25q-14 34 -49 34q-27 0 -40.5 -19t-13.5 -52q0 -70 54 -70
                                        q11 0 23.5 7t20.5 25l54 -28q-32 -58 -107 -58zM621 502q-51 0 -84 33.5t-33 91.5t32.5 91t86.5 33q33 0 60.5 -17t44.5 -46l-50 -25q-14 34 -49 34q-27 0 -40.5 -19t-13.5 -52q0 -70 54 -70q11 0 23.5 7t21.5 25l52 -28q-31 -58 -105 -58z" />
                            </svg>
                            :
                            <svg width="24" height="24" viewBox="0 0 1034 1034" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1">
                                <path fill="currentColor"
                                    d="M500 227q-109 0 -202 55q-90 53 -143 143q-55 93 -55 202t55 202q53 90 143 143q93 55 202 55t202 -55q90 -53 143 -143q55 -93 55 -202t-55 -202q-53 -90 -143 -143q-93 -55 -202 -55zM500 302q88 0 164 44q73 44 117 117q44 76 44 164q0 43 -11 84l-362 -162
                                        q23 -42 65 -42q23 0 43 14q7 5 12 10l66 -67q-52 -44 -127 -44q-55 0 -97 23q-40 21 -65 60l-121 -54q45 -68 115 -107q73 -40 157 -40zM193 520l127 57q-5 26 -5 53q0 74 34 124q28 42 77 63q40 17 83 17q62 0 113 -35q8 -6 15 -12l-58 -71l-5 5q-23 22 -54 22v0
                                        q-42 0 -66 -39q-20 -32 -20 -77l351 156q-42 77 -117 122q-77 47 -168 47q-88 0 -164 -44q-73 -44 -117 -117q-44 -76 -44 -164q0 -55 18 -107z" />
                            </svg>
                        }
                    </span>
                    , document.querySelector('.control-panel-icon-row .icon-left-part'))
            }
        </Fragment>
    )
}


export default JimakuArea