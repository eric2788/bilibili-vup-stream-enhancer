import { useMutationObserver } from "@react-hooks-library/core";
import { createPortal } from "react-dom";
import { toast } from "sonner/dist";
import TailwindScope from "~components/TailwindScope";
import type { Settings } from "~settings";
import type { FeatureHookRender } from "..";
import ButtonArea from "./components/ButtonArea";
import JimakuArea from "./components/JimakuArea";
import type { StreamInfo } from "~api/bilibili";
import { useEffect } from "react";
import { sleep } from "~utils/misc";
import PromiseHandler from "~components/PromiseHandler";
import { Typography } from "@material-tailwind/react";


export function parseJimaku(danmaku: string, regex: string) {
    if (danmaku === undefined) return undefined
    const reg = new RegExp(regex)
    const g = reg.exec(danmaku)?.groups
    danmaku = g?.cc
    const name = g?.n
    if (danmaku === "") {
        danmaku = undefined
    }
    return name && danmaku ? `${name}: ${danmaku}` : danmaku
}

function warnIfAdaptive() {
    // warn: this will make context menu wrong position
    if (!document.documentElement.getAttribute('lab-style').includes('adaptive')) return
    toast.error(`检测到你已启用屏幕适配，这将导致字幕右键菜单位置错乱，建议关闭。`, {
        position: 'top-center',
        duration: 10000,
    })
}

export function App({ settings }: { settings: Settings, info: StreamInfo }): JSX.Element {

    const dev = settings['settings.developer']
    const { regex, opacity, hide } = settings['settings.danmaku']

    const danmakuArea = document.querySelector(dev.elements.danmakuArea)
    if (!danmakuArea) {
        toast.warning(`找不到弹幕区域 ${dev.elements.danmakuArea}，部分功能可能无法正常工作`)
    }

    useEffect(warnIfAdaptive, [])

    // adaptive style callback
    useMutationObserver(
        document.documentElement,
        (mutations) => mutations
            .find((mu) => mu.type === 'attributes' && mu.attributeName === 'lab-style') &&
            warnIfAdaptive(),
        { attributes: true }
    )

    // danmaku style callback
    useMutationObserver(danmakuArea, (mutationsList: MutationRecord[]) => {
        for (const node of mutationsList.flatMap(mu => mu.addedNodes)) {
            let danmaku: string = undefined
            let danmakuNode: HTMLElement = undefined
            if (node instanceof Text) {
                danmaku = node.textContent?.trim() ?? node.data?.trim()
                danmakuNode = node.parentElement
            } else if (node instanceof HTMLElement) {
                danmaku = node.innerText?.trim()
                danmakuNode = node
            }
            if (danmaku === undefined || danmaku === '') continue
            const jimaku = parseJimaku(danmaku, regex)
            if (jimaku === undefined) continue
            if (hide) {
                danmakuNode.style.display = 'none'
                danmakuNode.style.visibility = 'hidden'
                return
            }
            if (opacity) {
                danmakuNode.style.opacity = opacity.toFixed(1)
            }
        }
    }, { childList: true })


    return <></>
}

const handler: FeatureHookRender = async (settings, info) => {
    console.info('hello world from jimaku.tsx!')

    const dev = settings['settings.developer']
    const { backgroundHeight, backgroundColor, color, firstLineSize, lineGap } = settings['settings.jimaku']

    const playerSection = document.querySelector(dev.elements.jimakuArea)
    const jimakuArea = document.createElement('div')
    jimakuArea.id = 'jimaku-area'
    playerSection.insertAdjacentElement('afterend', jimakuArea)

    const testFetch = sleep(5000)

    return [
        createPortal(
            <TailwindScope>
                <PromiseHandler promise={testFetch} >
                    <PromiseHandler.Error>
                        {err => (
                            <div style={{ height: backgroundHeight }} className="flex justify-center items-center bg-gray-700 text-red-700">
                                <div>{err}</div>
                            </div>
                        )}
                    </PromiseHandler.Error>
                    <PromiseHandler.Response>
                        {(data) => <JimakuArea settings={settings} info={info} />}
                    </PromiseHandler.Response>
                    <PromiseHandler.Loading>
                        <div style={{ height: backgroundHeight, backgroundColor }} className="flex justify-center items-start">
                            <h1 style={{color, fontSize: firstLineSize, marginTop: lineGap }} className="animate-pulse font-bold">字幕加载中...</h1>
                        </div>
                    </PromiseHandler.Loading>
                </PromiseHandler>
                <ButtonArea settings={settings} info={info} />
            </TailwindScope>
            , jimakuArea)
    ]
}

export default handler