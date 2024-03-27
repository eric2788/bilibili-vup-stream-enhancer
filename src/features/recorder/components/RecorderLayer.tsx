import { useKeyDown } from "@react-hooks-library/core"
import { useContext, useEffect, useRef } from "react"
import { toast } from "sonner/dist"
import type { StreamUrls } from "~background/messages/get-stream-urls"
import RecorderFeatureContext from "~contexts/RecorderFeatureContext"
import { useAsyncEffect } from "~hooks/life-cycle"
import { recordStream } from "~players"
import { fixCorrupted } from "~utils/ffmpeg"
import { download, downloadBlob } from "~utils/file"

export type RecorderLayerProps = {
    urls: StreamUrls
}


function RecorderLayer(props: RecorderLayerProps): JSX.Element {

    const { urls } = props
    const { duration, hotkeyClip, recordFix } = useContext(RecorderFeatureContext)

    const chunks = useRef<Blob[]>([])

    const { error } = useAsyncEffect(
        async () => {
            console.log('setup!')
            if (duration <= 0) return
            return await recordStream(urls, (buffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream'})
                chunks.current.push(blob)
                console.log('chunks is now: ', chunks.current.length)
            }, 'hls') // flv 的目前有問題，錄製不了，因此這邊指定 HLS
        },
        async (clean) => {
            console.log('clean up!')
            if (clean) {
                await clean()
            }
            chunks.current = []
        }, 
    [urls])

    useEffect(() => {
        if (error) {
            toast.error('直播推流录制失败: '+error)
        }
    }, [error])

    useKeyDown(hotkeyClip.key, async (e) => {
        if (e.ctrlKey !== hotkeyClip.ctrlKey) return
        if (e.shiftKey !== hotkeyClip.shiftKey) return
        toast.info('修复视频中...')
        const original = new Blob([ ...chunks.current ], { type: 'video/mp4' })
        const fixed = await fixCorrupted(original)
        toast.info('下載視頻中...')
        downloadBlob(new Blob([fixed], { type: 'video/mp4' }), 'clip.mp4')
    })

    return null
}


export default RecorderLayer