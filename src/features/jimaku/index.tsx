import { useMutationObserver } from "@react-hooks-library/core";
import { createPortal } from "react-dom";
import { toast } from "sonner/dist";
import TailwindScope from "~components/TailwindScope";
import type { Settings } from "~settings";
import type { FeatureHookRender } from "..";
import ButtonArea from "./components/ButtonArea";
import JimakuArea from "./components/JimakuArea";


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


function App({ settings }: { settings: Settings }): JSX.Element {

    const dev = settings['settings.developer']
    const { regex, opacity, hide } = settings['settings.danmaku']

    const danmakuArea = document.querySelector(dev.elements.danmakuArea)
    if (!danmakuArea) {
        toast.warning(`找不到弹幕区域 ${dev.elements.danmakuArea}，部分功能可能无法正常工作`)
    }

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

    const playerSection = document.querySelector(dev.elements.jimakuArea)
    const jimakuArea = document.createElement('div')
    jimakuArea.id = 'jimaku-area'
    playerSection.insertAdjacentElement('afterend', jimakuArea)



    return [
        createPortal(
            <TailwindScope>
                <App settings={settings} />
                <JimakuArea settings={settings} info={info} />
                <ButtonArea settings={settings} info={info} />
            </TailwindScope>
            , jimakuArea)
    ]
}

export default handler