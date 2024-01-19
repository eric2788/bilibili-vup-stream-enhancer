import { sendMessager } from "~utils/messaging"
import { useCallback } from "react"

export type PopupCreateInfo = Omit<chrome.windows.CreateData, 'url'>

/**
 * Custom hook for creating a popup window or opening a new tab/window.
 * @param enabledPip - Flag indicating whether picture-in-picture mode is enabled.
 * @param options - chrome window create configuration options.
 * @returns An object containing the createPopupWindow function and the pipSupported flag.
 * @example
 * const { createPopupWindow, pipSupported } = usePopupWindow(true, { width: 800, height: 600 });
 * createPopupWindow('https://example.com', { param1: 'value1', param2: 'value2' });
 */
export function usePopupWindow(enabledPip: boolean, options: PopupCreateInfo) {
    const pipSupported = window.documentPictureInPicture !== undefined
    const createPopupWindow = useCallback((tabUrl: string, params: Record<string, string> = {}) => {
        const url = chrome.runtime.getURL(`/tabs/${tabUrl}?${new URLSearchParams(params).toString()}`)
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
                iframe.height = options.height?.toString()
                iframe.width = options.width?.toString()
                iframe.allow = 'autoplay; fullscreen'
                iframe.frameBorder = '0'
                iframe.allowFullscreen = true
                iframe.mozallowfullscreen = true
                iframe.msallowfullscreen = true
                iframe.oallowfullscreen = true
                iframe.webkitallowfullscreen = true
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