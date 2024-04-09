import { useKeyDown } from "@react-hooks-library/core"
import { useCallback, useContext, useRef } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner/dist"
import type { StreamUrls } from "~background/messages/get-stream-urls"
import ContentContext from "~contexts/ContentContexts"
import RecorderFeatureContext from "~contexts/RecorderFeatureContext"
import { useFFMpeg } from "~hooks/ffmpeg"
import { useAsyncEffect } from "~hooks/life-cycle"
import { useShardSender } from "~hooks/stream"
import { Recorder } from "~types/media"
import { screenshotFromVideo } from "~utils/binary"
import { downloadBlob } from "~utils/file"
import { sendMessager } from "~utils/messaging"
import { randomString } from '~utils/misc'
import createRecorder from "../recorders"
import ProgressText from "./ProgressText"
import RecorderButton from "./RecorderButton"

export type RecorderLayerProps = {
    urls: StreamUrls
}

function RecorderLayer(props: RecorderLayerProps): JSX.Element {

    const { urls } = props
    const { info, settings } = useContext(ContentContext)
    const { elements: { upperHeaderArea, livePlayerVideo } } = settings['settings.developer']
    const {
        duration,
        recordHotkey: recordKey,
        screenshotHotkey: screenshotKey,
        recordFix,
        mechanism,
        hiddenUI,
        outputType,
        overflow,
        autoSwitchQuality
    } = useContext(RecorderFeatureContext)

    const recorder = useRef<Recorder>()
    const { ffmpeg } = useFFMpeg()
    const manual = duration <= 0
    const sendStreamToBackground = useShardSender('content-script')

    useAsyncEffect(
        async () => {
             // ffmpeg.wasm is not supported hevc codec
            recorder.current = createRecorder(info.room, urls, mechanism, { 
                type: outputType, 
                codec: 'avc',
                autoSwitchQuality
            })
            await recorder.current.flush() // clear old records
            if (!manual) {
                await recorder.current.start()
            }
            recorder.current.onerror = (err) => {
                console.error('recorder error: ', err)
                toast.error('录制直播时出现错误: ' + err.message)
            }
        },
        async () => {
            if (recorder.current) {
                recorder.current.stop()
                console.info('recorder destoryed')
            } else {
                console.warn('recorder is not ready, skipped clean up')
            }
        },
        (err) => {
            console.error('錄製直播推流失敗: ', err)
            toast.error('錄製直播推流失敗: ' + err)
        },
        [urls])

    const clipRecord = useCallback(async () => {

        console.debug('hotkey triggered!')

        if (!recorder.current) {
            console.warn('錄製器未初始化')
            toast.warning('录制功能尚未初始化')
            return
        }

        if (!recorder.current.recording) {
            try {
                if (manual) {
                    await recorder.current.start()
                    toast.info('开始录制...')
                } else {
                    toast.warning('录制没有在加载时自动开始，请稍等片刻或刷新页面。')
                }
            } catch (err: Error | any) {
                console.error('unexpected error: ', err)
                toast.error('未知错误: ' + err.message)
            } finally {
                return
            }
        } else if (manual) {
            recorder.current.stop()
        }

        const encoding = (async () => {
            const chunkData = await recorder.current.loadChunkData(overflow === 'limit')
            if (chunkData.chunks.length === 0) {
                throw new Error('录制的内容为空。')
            }
            const original = new Blob([...chunkData.chunks], { type: chunkData.info.mimeType })
            const today = new Date().toString().substring(0, 24).replaceAll(' ', '-').replaceAll(':', '-')
            const filename = `${info.room}-${today}.${chunkData.info.extension}`

            // 超出 2GB 时，如果满溢策略是跳过，则直接下载
            if (overflow === 'skip' && recorder.current.fileSizeMB >= 2048) {
                downloadBlob(original, filename)
                return
            }

            const ff = await ffmpeg

            // 如果为完整编译，则发送到后台进行多线程编译
            if (recordFix === 'reencode') {
                const id = randomString()
                await sendMessager('open-tab', { tab: 'encoder', active: false, params: { id } })
                await sendStreamToBackground('pages', {
                    id,
                    duration,
                    videoInfo: chunkData.info,
                    filename,
                    blob: original
                })
            } else {
                const fixed = await ff.fixInfoAndCut(original, duration, chunkData.info.extension)
                downloadBlob(new Blob([fixed], { type: chunkData.info.mimeType }), filename)
            }

        })();

        if (overflow === 'skip' && recorder.current.fileSizeMB >= 2048) {
            toast.promise(encoding, {
                loading: '准备下载中...',
                error: err => `下载失败: ${err?.message ?? err}`,
                success: '视频下载成功。'
            })
        } else {
            toast.promise(encoding, {
                loading: recordFix === 'reencode' ? '准备视频中...' : <ProgressText ffmpeg={ffmpeg} />,
                error: err => `视频${recordFix === 'reencode' ? '准备' : '编译'}失败: ${err?.message ?? err}`,
                success: recordFix === 'reencode' ? '视频已发送到后台进行完整编码。' : '视频下载成功。'
            })
        }


        try {
            await encoding
        } catch (err: Error | any) {
            console.error('unexpected error: ', err, err.stack)
        }

        if (manual) {
            await recorder.current.flush() // clear records after download
            // make sure to make this toast be the latest (although it's already stopped the recorder)
            toast.info('录制已中止。')
        }

    }, [ffmpeg])


    const screenshot = useCallback(() => {
        const video = document.querySelector(livePlayerVideo) as HTMLVideoElement
        if (video === null) {
            toast.warning('截图失败: 无法找到直播视频')
            return
        }
        const screenshoting = (async () => {
            const blob = await screenshotFromVideo(video)
            const today = new Date().toString().substring(0, 24).replaceAll(' ', '-').replaceAll(':', '-')
            const filename = `${info.room}-${today}.jpeg`
            downloadBlob(blob, filename)
        })();
        toast.promise(screenshoting, {
            loading: '正在摄取直播画面...',
            error: err => `截图失败: ${err?.message ?? err}`,
            success: '截图成功并已保存。'
        })
    }, [])


    useKeyDown(recordKey.key, (e) => {
        if (e.ctrlKey !== recordKey.ctrlKey) return
        if (e.shiftKey !== recordKey.shiftKey) return
        e.preventDefault()
        clipRecord()
    })

    useKeyDown(screenshotKey.key, (e) => {
        if (e.ctrlKey !== screenshotKey.ctrlKey) return
        if (e.shiftKey !== screenshotKey.shiftKey) return
        e.preventDefault()
        screenshot()
    })

    if (hiddenUI || document.querySelector(upperHeaderArea) === null) {
        return null
    }

    return createPortal(
        <RecorderButton
            recorder={recorder}
            record={clipRecord}
            screenshot={screenshot}
        />,
        document.querySelector(upperHeaderArea)
    )

}


export default RecorderLayer