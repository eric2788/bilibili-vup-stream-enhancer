import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner/dist';
import OfflineRecordsProvider from '~components/OfflineRecordsProvider';
import TailwindScope from '~components/TailwindScope';

import { useMutationObserver } from '@react-hooks-library/core';

import JimakuCaptureLayer from './components/JimakuCaptureLayer';

import type { StreamInfo } from "~api/bilibili";
import type { Settings } from "~settings";
import type { FeatureHookRender } from "..";
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

    const dev = settings['settings.developer']
    const { backgroundHeight, backgroundColor, color, firstLineSize, lineGap, size, order } = settings['settings.jimaku']
    const { backgroundListColor } = settings['settings.button']

    const playerSection = document.querySelector(dev.elements.jimakuArea)
    const jimakuArea = document.createElement('div')
    jimakuArea.id = 'jimaku-area'
    playerSection.insertAdjacentElement('afterend', jimakuArea)

    return [
        createPortal(
            <TailwindScope>
                <OfflineRecordsProvider
                    room={info.room}
                    feature="jimaku"
                    settings={settings}
                    table="jimakus"
                    reverse={order === 'top'}
                    loading={
                        <>
                            <div style={{ height: backgroundHeight, backgroundColor }} className="flex justify-center items-start">
                                <h1 style={{ color, fontSize: firstLineSize, marginTop: lineGap }} className="animate-pulse font-bold">字幕加载中...</h1>
                            </div>
                            <div style={{ backgroundColor: backgroundListColor }} className="text-center overflow-x-auto flex justify-center gap-3">
                                {...Array(3).fill(0).map((_, i) => {
                                    // make random skeleton width
                                    const width = [120, 160, 130][i]
                                    return (
                                        <div key={i} style={{ width: width }} className="m-[5px] px-[20px] py-[10px] rounded-md text-[15px] animate-pulse bg-gray-300">
                                            &nbsp;
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    }
                    error={(err, retry) => (
                        <>
                            <div style={{ height: backgroundHeight, backgroundColor }} className="flex flex-col justify-start text-lg items-center gap-3 text-red-400">
                                <h1 style={{ fontSize: firstLineSize, margin: `${lineGap}px 0px` }} className="font-bold">加载失败</h1>
                                <span style={{ fontSize: size }}>{String(err)}</span>
                            </div>
                            <div style={{ backgroundColor: backgroundListColor }} className="text-center overflow-x-auto flex justify-center gap-3">
                                <button onClick={retry} className="m-[5px] px-[20px] py-[10px] text-[15px] bg-red-700 rounded-md">
                                    重试
                                </button>
                            </div>
                        </>
                    )}
                >
                    {(data) => <JimakuCaptureLayer settings={settings} info={info} offlineRecords={data} />}
                </OfflineRecordsProvider>
            </TailwindScope>
            , jimakuArea)
    ]
}

export default handler