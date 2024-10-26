import { useMutationObserver } from '@react-hooks-library/core';
import { useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner/dist';
import { isNativeVtuber } from "~api/bilibili";
import OfflineRecordsProvider from '~components/OfflineRecordsProvider';
import TailwindScope from '~components/TailwindScope';
import ContentContext from "~contexts/ContentContexts";
import JimakuFeatureContext from "~contexts/JimakuFeatureContext";
import { parseJimaku } from "~utils/bilibili";
import { retryCatcher } from "~utils/fetch";
import { findOrCreateElement } from '~utils/react-node';
import type { FeatureHookRender } from "..";
import JimakuCaptureLayer from './components/JimakuCaptureLayer';
import JimakuAreaSkeleton from './components/JimakuAreaSkeleton';
import JimakuAreaSkeletonError from './components/JimakuAreaSkeletonError';
import { useQuerySelector } from "~hooks/dom";



function warnIfAdaptive() {
    // warn: this will make context menu wrong position
    if (!document.documentElement.getAttribute('lab-style').includes('adaptive')) return
    toast.error(`检测到你已启用屏幕适配，这将导致字幕右键菜单位置错乱，建议关闭。`, {
        position: 'top-center',
        duration: 10000,
    })
}

export const FeatureContext = JimakuFeatureContext

export function App(): JSX.Element {

    const { settings } = useContext(ContentContext)
    const { danmakuZone: { regex, opacity, hide } } = useContext(FeatureContext)

    const dev = settings['settings.developer']

    const danmakuArea = useQuerySelector(dev.elements.danmakuArea)
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
        for (const node of mutationsList.flatMap(mu => mu.addedNodes).flatMap(node => [...Array.from(node)])) {
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
    const { noNativeVtuber, jimakuZone: jimakuSettings } = settings['settings.features']['jimaku']
    const { order } = jimakuSettings

    const playerSection = document.querySelector(dev.elements.jimakuArea)
    const jimakuArea = findOrCreateElement('div', 'jimaku-area')
    playerSection.insertAdjacentElement('afterend', jimakuArea)

    // 自動過濾國V功能僅限在同傳字幕過濾生效
    if (noNativeVtuber && (await retryCatcher(() => isNativeVtuber(info.uid), 5))) {
        // do log
        console.info('檢測到為國V, 已略過')
        return undefined // 返回 undefined 以禁用此功能且不發送任何警告
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
                    loading={<JimakuAreaSkeleton />}
                    error={(err, retry) => <JimakuAreaSkeletonError error={err} retry={retry} />}
                >
                    {(data) => <JimakuCaptureLayer offlineRecords={data} />}
                </OfflineRecordsProvider>
            </TailwindScope>
            , jimakuArea)
    ]
}

export default handler