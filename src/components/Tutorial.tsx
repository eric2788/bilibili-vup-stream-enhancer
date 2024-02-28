import { useState, useEffect, forwardRef, useImperativeHandle, type Ref, useRef } from "react"
import type { Step } from "react-joyride"
import { localStorage } from "~utils/storage"
import Joyride, { type StoreHelpers } from "react-joyride"

export type TutorialStep = Step & {
    beforeEnter?: () => void
    beforeLeave?: () => void
}

export type TutorialProps = {
    steps: Array<TutorialStep>
    stateKey: string
}

export type TutorialRefProps = {
    start: () => void
    stop: () => void
}

function Tutorial(props: TutorialProps, ref: Ref<TutorialRefProps>): JSX.Element {

    const joyRef = useRef<StoreHelpers>()
    const { steps, stateKey } = props

    useEffect(() => {
        localStorage.get<boolean>(`no_auto_journal.${stateKey}`)
            .then((noAutoJournal) => {
                if (noAutoJournal && process.env.NODE_ENV === 'production') return
                joyRef.current.open()
                return localStorage.set(`no_auto_journal.${stateKey}`, true)
            })
            .catch((err) => console.info(`Error while getting no_auto_journal.${stateKey}`, err))
    }, [])

    useImperativeHandle(ref, () => ({
        start: joyRef.current.open,
        stop: joyRef.current.close,
    }))

    return <Joyride
        getHelpers={(helpers) => joyRef.current = helpers}
        steps={steps}
        continuous={true}
        disableOverlayClose={true}
        showSkipButton={true}
        showProgress={true}
        styles={{
            options: {
                primaryColor: '#a1a1a1',
            },
        }}
        locale={{
            back: '上一步',
            close: '关闭',
            last: '完成',
            next: '下一步',
            skip: '跳过',
        }}
        callback={({ status, index }) => {
            if (["skipped", "finished"].includes(status)) {
                joyRef.current.close()
                return
            }
            steps[index]?.beforeLeave?.()
            steps[index + 1]?.beforeEnter?.()
        }}
    />
}

export default forwardRef(Tutorial)