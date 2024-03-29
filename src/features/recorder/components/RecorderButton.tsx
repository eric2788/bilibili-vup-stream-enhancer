import { IconButton, Tooltip } from "@material-tailwind/react"
import { useInterval } from "@react-hooks-library/core"
import { useContext, useState, type MutableRefObject } from "react"
import TailwindScope from "~components/TailwindScope"
import RecorderFeatureContext from "~contexts/RecorderFeatureContext"
import { useForceRender } from "~hooks/force-update"
import { useComputedStyle, useContrast } from "~hooks/styles"
import type { Recorder } from "~types/media"
import { toTimer } from "~utils/misc"

export type RecorderButtonProps = {
    recorder: MutableRefObject<Recorder>
    onClick?: () => void
}


function RecorderButton(props: RecorderButtonProps): JSX.Element {

    const { duration } = useContext(RecorderFeatureContext)
    const { recorder, onClick } = props
    const [timer, setTimer] = useState(0)
    const [recording, setRecording] = useState(false)
    const update = useForceRender()
    const { backgroundImage } = useComputedStyle(document.getElementById('head-info-vm'))

    useInterval(() => {
        if (!recorder.current) return
        update()
        if (recording !== recorder.current.recording) {
            setRecording(recorder.current.recording)
        }

        if (recording) {
            if (timer === duration * 60) return // if reached duration, stop increasing timer
            setTimer(timer + 1)
        } else {
            setTimer(0)
        }
    }, 1000)

    if (!recorder.current) return null

    return (
        <TailwindScope>
            <div className={`flex items-center ${backgroundImage !== 'none' ? 'dark' : ''}`}>
                <IconButton data-testid="record-button" onClick={onClick} variant="text" title={recording ? `中止录制` : `开始录制`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:stroke-white">
                        {recording ?
                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /> :
                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
                        }
                    </svg>
                </IconButton>
                {recording && (
                    <div data-testid="record-timer" className="ml-3 dark:text-white" title={`目前大小: ${recorder.current.fileSize}`}>
                        {toTimer(timer)}
                    </div>
                )}
            </div>
        </TailwindScope>
    )
}


export default RecorderButton