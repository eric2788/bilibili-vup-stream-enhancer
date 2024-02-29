import { forwardRef, useEffect, useImperativeHandle, useState, type Ref } from "react"
import type { Step } from "react-joyride"
import Joyride, { STATUS, EVENTS } from "react-joyride"
import { isThemePage } from "~utils/bilibili"
import { localStorage } from "~utils/storage"

export type TutorialStep = Step & {
    beforeEnter?: (element: HTMLElement) => void
    beforeLeave?: (element: HTMLElement) => void
}

export type TutorialProps = {
    steps: Array<TutorialStep>
    stateKey?: string
    zIndex?: number
    noScroll?: boolean
    applyGlobalSettings?: (step: TutorialStep) => void
}

export type TutorialRefProps = {
    start: () => void
    stop: () => void
    running: boolean
}

function defaultApplyGlobalSettings(step: TutorialStep) {
    if (!step.placement) step.placement = 'auto'
}

function Tutorial(props: TutorialProps, ref: Ref<TutorialRefProps>): JSX.Element {

    const [run, setRun] = useState(false)
    const { steps, stateKey, zIndex, noScroll } = props

    useEffect(() => {
        steps.forEach((step, index) => {
            if (index === 0) {
                // auto start
                step.disableBeacon = true
            }
            // apply global settings
            props.applyGlobalSettings ? props.applyGlobalSettings(step) : defaultApplyGlobalSettings(step)
        })
    }, [steps])

    useEffect(() => {
        if (!stateKey) return
        localStorage.get<boolean>(`no_auto_journal.${stateKey}`)
            .then((noAutoJournal) => {
                if (noAutoJournal || isThemePage()) return
                setRun(true)
                return localStorage.set(`no_auto_journal.${stateKey}`, true)
            })
            .catch((err) => console.error(`Error while getting no_auto_journal.${stateKey}`, err))
    }, [])

    useImperativeHandle(ref, () => ({
        start: () => setRun(true),
        stop: () => setRun(false),
        running: run
    }), [run])

    return <Joyride
        steps={steps}
        run={run}
        continuous
        scrollToFirstStep
        hideCloseButton
        disableCloseOnEsc
        disableOverlayClose
        showSkipButton
        disableScrolling={noScroll ?? false}
        showProgress
        floaterProps={{
            styles: {
                wrapper: {
                    zIndex: zIndex ?? 5000
                },
                options: {
                    zIndex: zIndex ?? 5000
                }
            }
        }}
        styles={{
            options: {
                primaryColor: '#a1a1a1',
                zIndex: zIndex ?? 5000
            },
        }}
        locale={{
            back: '上一步',
            close: '关闭',
            last: '完成',
            next: '下一步',
            skip: '跳过',
        }}
        callback={({ status, index, type }) => {
            const doneStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]
            if (doneStatuses.includes(status)) {
                setRun(false)
                return
            }
            if (steps[index]) {
                const s = steps[index]
                const element = typeof s.target === 'string' ? document.querySelector(s.target as string) : s.target
                if (element instanceof HTMLElement) {
                    if (type === EVENTS.STEP_BEFORE) {
                        s.beforeEnter?.(element)
                    } else if (type === EVENTS.STEP_AFTER) {
                        s.beforeLeave?.(element)
                    }
                }
            }
        }}
    />
}

export default forwardRef(Tutorial)