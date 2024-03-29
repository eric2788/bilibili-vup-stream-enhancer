import type { ProgressEvent } from "@ffmpeg/ffmpeg/dist/esm/types"
import { Progress, Spinner } from "@material-tailwind/react"
import { useKeyDown } from "@react-hooks-library/core"
import { useCallback, useContext, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner/dist"
import type { StreamUrls } from "~background/messages/get-stream-urls"
import TailwindScope from "~components/TailwindScope"
import ContentContext from "~contexts/ContentContexts"
import RecorderFeatureContext from "~contexts/RecorderFeatureContext"
import { FFMpegHooks, useFFMpeg } from "~hooks/ffmpeg"
import { useAsyncEffect } from "~hooks/life-cycle"
import { useShardSender } from "~hooks/stream"
import { Recorder } from "~types/media"
import { downloadBlob } from "~utils/file"
import { sendMessager } from "~utils/messaging"
import { randomString } from '~utils/misc'
import createRecorder from "../recorders"
import RecorderButton from "./RecorderButton"

export type RecorderLayerProps = {
    urls: StreamUrls
}


function ProgressText({ ffmpeg }: { ffmpeg: Promise<FFMpegHooks> }) {

    const [progress, setProgress] = useState<ProgressEvent>(null)

    useAsyncEffect(
        async () => {
            const ff = await ffmpeg
            ff.onProgress(setProgress)
        },
        async () => { },
        (err) => {
            console.error('unexpected: ', err)
        },
        [ffmpeg])

    if (!progress) {
        return `编译视频中...`
    }

    return (
        <TailwindScope>
            <div className="flex justify-center flex-col space-y-2">
                <div className="flex flex-row items-center space-x-2">
                    <div>
                        <Spinner className="h-5 w-5" />
                    </div>
                    <div>
                        {`编译视频中... (${Math.round(progress.progress * 10000) / 100}%)`}
                    </div>
                </div>
                <Progress color="blue" value={progress.progress * 100} />
            </div>
        </TailwindScope>
    )

}

function RecorderLayer(props: RecorderLayerProps): JSX.Element {

    const { urls } = props
    const { info, settings } = useContext(ContentContext)
    const { elements: { upperHeaderArea } } = settings['settings.developer']
    const {
        duration,
        hotkeyClip,
        recordFix,
        mechanism,
        hiddenUI,
        outputType,
        overflow
    } = useContext(RecorderFeatureContext)

    const recorder = useRef<Recorder>()
    const { ffmpeg } = useFFMpeg()
    const manual = duration <= 0
    const sendStreamToBackground = useShardSender('content-script')

    useAsyncEffect(
        async () => {
            recorder.current = createRecorder(info.room, urls, mechanism, { type: outputType, codec: 'avc' }) // ffmpeg.wasm is not supported hevc codec
            await recorder.current.flush() // clear old records
            if (!manual) {
                await recorder.current.start()
            }
            recorder.current.onerror = (err) => {
                console.error('recorder error: ', err)
                toast.error('录制直播推流时出现错误: ' + err.message)
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
            if (manual) {
                await recorder.current.start()
                toast.info('开始录制...')
            } else {
                toast.warning('录制没有在加载时自动开始，请稍等片刻或刷新页面。')
            }
            return
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
            recorder.current.stop()
            await recorder.current.flush() // clear records after download
            toast.info('录制已中止。')
        }

    }, [ffmpeg])

    useKeyDown(hotkeyClip.key, async (e) => {
        if (e.ctrlKey !== hotkeyClip.ctrlKey) return
        if (e.shiftKey !== hotkeyClip.shiftKey) return
        try {
            await clipRecord()
        } catch (err: Error | any) {
            console.error('unexpected error: ', err)
            toast.error('未知错误: ' + err.message)
        }
    })

    if (hiddenUI || document.querySelector(upperHeaderArea) === null) {
        return null
    }

    return createPortal(
        <RecorderButton
            recorder={recorder}
            onClick={clipRecord}
        />,
        document.querySelector(upperHeaderArea)
    )

}


export default RecorderLayer