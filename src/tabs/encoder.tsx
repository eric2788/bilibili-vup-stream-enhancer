import { Progress, Spinner } from "@material-tailwind/react"
import PromiseHandler from "~components/PromiseHandler"
import { FFMpegHooks, useFFMpeg, type FFMpegProgress } from "~hooks/ffmpeg"
import injectToaster from "~toaster"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import BJFThemeProvider from "~components/BJFThemeProvider"
import { useAsyncEffect, useTimeoutElement } from "~hooks/life-cycle"
import { useShardReceiver } from "~hooks/stream"
import '~style.css'
import { downloadBlob } from "~utils/file"
import { toTimer } from "~utils/misc"

const urlParams = new URLSearchParams(window.location.search);
const ffmpegID = urlParams.get('id')

injectToaster()

export type ConverterProps = {
    ffmpeg: FFMpegHooks
}


function Converter(props: ConverterProps): JSX.Element {

    const { ffmpeg } = props
    const [progress, setProgress] = useState<FFMpegProgress>(null)
    const [result, setResult] = useState<Blob>(null)
    const [error, setError] = useState<Error>(null)
    const {
        info,
        progress: infoProgress,
        error: infoError,
        ready
    } = useShardReceiver(ffmpegID, 'pages')

    useEffect(() => {
        if (result || error) return
        const beforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', beforeUnload)
        return () => window.removeEventListener('beforeunload', beforeUnload)
    }, [result, error])

    useAsyncEffect(
        async () => {
            console.info('info is null: ', !info)
            console.info('ffmpeg is null: ', !ffmpeg)
            if (!ffmpeg) return
            if (!info) {
                ready('content-script')
                console.info('正在等待视频数据...')
                return
            }
            console.info('开始编译视频...')
            ffmpeg.onProgress(progress => {
                console.info('received progress: ', progress)
                setProgress(() => progress)
                if (progress.progress > 0 && progress.progress < 1) {
                    setError(null) // 如果有进度，一律当没有错误
                }
            })
            const original = new Blob(info.content, { type: info.videoInfo.mimeType })
            const fixed = await ffmpeg.fixInfoAndCut(original, info.duration, info.videoInfo.extension)
            setResult(() => new Blob([fixed], { type: info.videoInfo.mimeType }))
            downloadBlob(new Blob([fixed], { type: info.videoInfo.mimeType }), info.filename)
        },
        async () => { },
        (err) => {
            toast.error('编译视频时发生错误')
            console.error('unexpected error: ', err)
            setError(err)
        },
        [ffmpeg, info]
    )

    if (error) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center text-red-500">
                <h1>编译视频时发生错误</h1>
                <div>{error?.message ?? new String(error)}</div>
            </div>
        )
    } else if (infoError) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center text-red-500">
                <h1>获取视频数据时发生错误</h1>
                <div>{infoError?.message ?? new String(infoError)}</div>
            </div>
        )
    }

    if (!info) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center dark:text-white space-y-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 dark:stroke-white animate-bounce">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </div>
                <h1>正在等待视频数据...</h1>
                <Progress color="blue" value={infoProgress} className="w-1/2" />
            </div>
        )
    }

    if (!progress) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center space-y-2 dark:text-white">
                <Spinner className="w-10 h-10" />
                <div>编译准备中...</div>
            </div>
        )
    }

    const action = progress.stage === 'fix' ? '修复' : '编译'

    if (progress.progress === 1) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center dark:text-white space-y-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 stroke-green-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                <h1>视频已{action}完成。</h1>
                <h3>{info.filename}</h3>
            </div>
        )
    }

    console.debug('progress: ', progress)
    const progressInvalid = isNaN(progress.progress) || !isFinite(progress.progress)
    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col space-y-2 dark:text-white">
            <div className="flex flex-row items-center space-x-2">
                <div>
                    <Spinner className="h-10 w-10" />
                </div>
                <div>
                    {`${action}视频中... ${progressInvalid ? '' : `(${Math.round(progress.progress * 10000) / 100}%)`}`}
                </div>
                <div>
                    时间段: {toTimer(Math.round(progress.time / 1000000))}
                </div>
            </div>
            {!progressInvalid && <Progress className="w-1/2" color="blue" value={progress.progress * 100} />}
        </div>
    )

}


function App(): JSX.Element {

    const { ffmpeg } = useFFMpeg()

    if (!ffmpegID) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center text-red-500 text-lg">
                <h1>无效的请求</h1>
            </div>
        )
    }

    return (
        <BJFThemeProvider>
            <main className="text-lg">
                <PromiseHandler promise={ffmpeg}>
                    <PromiseHandler.Loading>
                        <div className="w-screen h-screen flex flex-col space-y-2 justify-center items-center">
                            <Spinner className="h-10 w-10" color="blue" />
                            <div className="dark:text-white">正在加载 FFMpeg...</div>
                        </div>
                    </PromiseHandler.Loading>
                    <PromiseHandler.Error>
                        {err => (
                            <div className="w-screen h-screen flex flex-col justify-center items-center text-red-500">
                                <h1>FFMpeg 加载失败</h1>
                                <div>{err?.message ?? err}</div>
                            </div>
                        )}
                    </PromiseHandler.Error>
                    <PromiseHandler.Response>
                        {(ff) => useTimeoutElement(
                            (
                                <div className="w-screen h-screen flex flex-col justify-center items-center dark:text-white space-y-2">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 stroke-green-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <h1>FFMpeg 已成功加载。</h1>
                                </div>
                            ),
                            <Converter ffmpeg={ff} />,
                            2000
                        )}
                    </PromiseHandler.Response>
                </PromiseHandler>
            </main>
        </BJFThemeProvider>
    )
}

export default App