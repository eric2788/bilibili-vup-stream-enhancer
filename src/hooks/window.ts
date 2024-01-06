import { sendMessager } from "~utils/messaging"
import { useCallback } from "react"

export type PopupCreateInfo = Omit<chrome.windows.CreateData, 'url'>

export function usePopupWindow(enabledPip: boolean, options: PopupCreateInfo) {
    const pipSupported = window.documentPictureInPicture !== undefined
    const createPopupWindow = useCallback((tabUrl: string) => {
        const url = chrome.runtime.getURL(`/tabs/${tabUrl}`)
        return async function (e: React.MouseEvent<Element>) {
            e.preventDefault()
            if (enabledPip && e.ctrlKey) {
                if (!pipSupported) {
                    alert('你的浏览器不支持自定义元素的画中画')
                    return
                }
                const size: RequestPipOptions = options.width || options.height ? { width: options.width ?? 500, height: options.height ?? 800 } : undefined 
                const pip = await window.documentPictureInPicture.requestWindow(size)
                const iframe = document.createElement('iframe')
                iframe.src = url
                iframe.style.width = '100%'
                iframe.style.height = '100%'
                iframe.allowFullscreen = true
                pip.document.body.style.margin = '0' // I dunno why but default is 8px
                pip.document.body.style.overflow = 'hidden'
                pip.document.body.appendChild(iframe)
                return
            } else {
                await sendMessager('open-window', {
                    url,
                    ...options
                })
            }

        }

    }, [enabledPip, options])

    return { createPopupWindow, pipSupported }
}