import { forwardRef, useEffect, useImperativeHandle, useState, type Ref } from "react"
import type { Step } from "react-joyride"
import Joyride, { EVENTS, STATUS } from "react-joyride"
import { localStorage } from "~utils/storage"

/**
 * Represents a tutorial step.
 */
export type TutorialStep = Step & {
    /**
     * A function that is called before entering the step.
     * @param element - The HTML element associated with the step.
     */
    beforeEnter?: (element: HTMLElement) => void

    /**
     * A function that is called before leaving the step.
     * @param element - The HTML element associated with the step.
     */
    beforeLeave?: (element: HTMLElement) => void
}

/**
 * Props for the Tutorial component.
 */
export type TutorialProps = {
    /**
     * An array of tutorial steps.
     */
    steps: Array<TutorialStep>;

    /**
     * An optional key to identify the state of the tutorial component.
     */
    stateKey?: string;

    /**
     * The z-index of the tutorial component.
     */
    zIndex?: number;

    /**
     * A flag indicating whether scrolling should be disabled during the tutorial.
     */
    noScroll?: boolean;

    /**
     * A callback function to apply global settings for each tutorial step.
     * @param step - The current tutorial step.
     */
    applyGlobalSettings?: (step: TutorialStep) => void;
}

/**
 * Represents the props for the Tutorial component.
 */
export type TutorialRefProps = {
    /**
     * Function to start the tutorial.
     */
    start: () => void

    /**
     * Function to stop the tutorial.
     */
    stop: () => void

    /**
     * Indicates whether the tutorial is currently running.
     */
    running: boolean
}

function defaultApplyGlobalSettings(step: TutorialStep) {
    if (!step.placement) step.placement = 'auto'
}

/**
 * Renders a tutorial component using the Joyride library.
 *
 * @param {TutorialProps} props - The props for the Tutorial component.
 * @param {Ref<TutorialRefProps>} ref - The ref object for the Tutorial component.
 * @returns {JSX.Element} The rendered Tutorial component.
 *
 * @example
 * // Example usage of Tutorial component
 * const steps = [
 *   {
 *     target: '.step-1',
 *     content: 'This is step 1',
 *   },
 *   {
 *     target: '.step-2',
 *     content: 'This is step 2',
 *   },
 * ];
 *
 * function App() {
 *   const tutorialRef = useRef<TutorialRefProps>(null);
 *
 *   const startTutorial = () => {
 *     if (tutorialRef.current) {
 *       tutorialRef.current.start();
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={startTutorial}>Start Tutorial</button>
 *       <Tutorial steps={steps} ref={tutorialRef} />
 *     </div>
 *   );
 * }
 */
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
                if (noAutoJournal) return
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