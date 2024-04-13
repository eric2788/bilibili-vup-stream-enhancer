import { IconButton, Tooltip } from "@material-tailwind/react"
import { useInterval } from "@react-hooks-library/core"
import { useContext, useState, type MutableRefObject } from "react"
import TailwindScope from "~components/TailwindScope"
import ContentContext from "~contexts/ContentContexts"
import RecorderFeatureContext from "~contexts/RecorderFeatureContext"
import { useForceRender } from "~hooks/force-update"
import { useComputedStyle, useContrast } from "~hooks/styles"
import type { Recorder } from "~types/media"
import { toTimer } from "~utils/misc"

export type RecorderButtonProps = {
    recorder: MutableRefObject<Recorder>
    record: VoidFunction
    screenshot: VoidFunction
}


function RecorderButton(props: RecorderButtonProps): JSX.Element {

    const { duration } = useContext(RecorderFeatureContext)
    const { settings } = useContext(ContentContext)
    const { recorder, record, screenshot } = props
    const [timer, setTimer] = useState(0)
    const [recording, setRecording] = useState(false)
    const update = useForceRender()
    const { headInfoArea } = settings['settings.developer'].elements
    const { backgroundImage } = useComputedStyle(document.querySelector(headInfoArea))

    useInterval(() => {
        if (!recorder.current) return
        update()
        if (recording !== recorder.current.recording) {
            setRecording(recorder.current.recording)
        }

        if (recording) {
            if (timer === duration * 60) return // if reached duration, stop increasing timer
            if (recorder.current.ticking) { // only ticking recorder will increase timer
                setTimer(timer + 1)
            }
        } else {
            setTimer(0)
        }
    }, 1000)

    if (!recorder.current) return null

    return (
        <TailwindScope>
            <div className={`flex items-center space-x-3 ${backgroundImage !== 'none' ? 'dark' : ''}`}>
                <IconButton data-testid="screenshot-button" onClick={screenshot} variant="text" title="屏幕截图">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                </IconButton>
                <IconButton data-testid="record-button" onClick={record} variant="text" title={recording ? `中止录制` : `开始录制`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:stroke-white">
                        {recording ?
                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /> :
                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
                        }
                    </svg>
                </IconButton>
                {recording && (
                    <div data-testid="record-timer" className="dark:text-white" title={`目前大小: ${recorder.current.fileSize}`}>
                        {toTimer(timer)}
                    </div>
                )}
            </div>
        </TailwindScope>
    )
}


export default RecorderButton