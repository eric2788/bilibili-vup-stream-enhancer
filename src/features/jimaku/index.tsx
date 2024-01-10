import type { FeatureHookRender } from "..";
import JimakuCaptureLayer from './components/JimakuCaptureLayer';
import OfflineRecordsProvider from '~components/OfflineRecordsProvider';
import type { Settings } from "~settings";
import { isNativeVtuber, type StreamInfo } from "~api/bilibili";
import TailwindScope from '~components/TailwindScope';
import { createPortal } from 'react-dom';
import { retryCatcher } from "~utils/fetch";
import { toast } from 'sonner/dist';
import { useEffect } from 'react';
import { useMutationObserver } from '@react-hooks-library/core';
import { parseJimaku } from "~utils/bilibili";


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
        for (const node of mutationsList.flatMap(mu => mu.addedNodes).flatMap(node => [...node.values()])) {
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
    }, { childList: true, subtree: true })


    return <></>
}

const handler: FeatureHookRender = async (settings, info) => {

    const dev = settings['settings.developer']
    const { backgroundHeight, backgroundColor, color, firstLineSize, lineGap, size, order } = settings['settings.jimaku']
    const { backgroundListColor } = settings['settings.button']
    const { noNativeVtuber } = settings['settings.features'].jimaku

    const playerSection = document.querySelector(dev.elements.jimakuArea)
    const jimakuArea = document.createElement('div')
    jimakuArea.id = 'jimaku-area'
    playerSection.insertAdjacentElement('afterend', jimakuArea)

    // 自動過濾國V功能僅限在同傳字幕過濾生效
    if (noNativeVtuber && (await retryCatcher(() => isNativeVtuber(info.uid), 5))) {
        // do log
        console.info('檢測到為國V, 已略過')
        return undefined // 返回 undefined 以禁用此功能
    }

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
                    {(data) => <JimakuCaptureLayer offlineRecords={data} />}
                </OfflineRecordsProvider>
            </TailwindScope>
            , jimakuArea)
    ]
}

export default handler