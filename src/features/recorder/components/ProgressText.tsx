import type { ProgressEvent } from "@ffmpeg/ffmpeg/dist/esm/types"
import { Spinner, Progress } from "@material-tailwind/react"
import { useState } from "react"
import TailwindScope from "~components/TailwindScope"
import type { FFMpegHooks } from "~hooks/ffmpeg"
import { useAsyncEffect } from "~hooks/life-cycle"


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

export default ProgressText