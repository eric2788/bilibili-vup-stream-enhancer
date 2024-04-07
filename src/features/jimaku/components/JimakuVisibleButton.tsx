import { createPortal } from 'react-dom';

import type { SettingSchema } from "~options/fragments/developer";

export type JimakuVisibleButtonProps = {
    toggle: VoidFunction
    visible: boolean
    dev: SettingSchema
}

function JimakuVisibleButton({ toggle, visible, dev }: JimakuVisibleButtonProps): JSX.Element {

    const element = document.querySelector(dev.elements.upperInputArea)
    if (!element) {
        console.warn(`找不到元素 ${dev.elements.upperInputArea}，部分功能可能无法正常工作`)
        return null
    }

    return (
        <>
            {createPortal(
                <span title="字幕切换显示" onClick={toggle} className="icon-item danmu-block-icon live-skin-main-text align-top inline-block mx-2 cursor-pointer">
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
                , element)}
        </>
    )
}

export default JimakuVisibleButton