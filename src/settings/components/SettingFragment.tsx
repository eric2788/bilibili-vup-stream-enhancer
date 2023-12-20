import { Collapse, Spinner } from "@material-tailwind/react"
import { useStorage } from "@plasmohq/storage/hook"
import { forwardRef, useImperativeHandle, type Ref, useEffect, useRef, useState, useCallback, useMemo } from "react"
import PromiseHandler from "~components/PromiseHandler"
import { asStateProxy, useBinding, type StateProxy, type ExposeHandler } from "~hooks/binding"
import fragments, { type Schema, type SettingFragments } from "~settings"
import { deepCopy, sleep } from "~utils/misc"
import { getSettingStorage, setSettingStorage } from "~utils/storage"


export type SettingFragmentProps<T extends keyof SettingFragments> = {
    fragmentKey: T
    toggleExpanded: () => void
    expanded: boolean
}

export type SettingFragmentContentProps<T extends keyof SettingFragments> = {
    fragmentKey: T
    settings: Schema<SettingFragments[T]>
    Component: React.FC<StateProxy<Schema<SettingFragments[T]>>>
}


export type ExportRefProps<K extends keyof SettingFragments> = {
    saveSettings: () => Promise<void>
    fragmentKey: K
    importSettings: (settings: Schema<SettingFragments[K]>) => Promise<void>
}

function SettingFragment<T extends keyof SettingFragments>(props: SettingFragmentProps<T>, ref: Ref<ExportRefProps<T>>): JSX.Element {

    const { fragmentKey, toggleExpanded, expanded } = props
    const { title, default: component } = fragments[fragmentKey] as SettingFragments[T]

    const ComponentFragment = component as React.FC<StateProxy<Schema<SettingFragments[T]>>>

    const fetchSettings = useCallback(() => getSettingStorage<T, Schema<SettingFragments[T]>>(fragmentKey), [props.fragmentKey])

    return (
        <section id={fragmentKey} className={`py-2 px-4 mx-auto max-w-screen-xl justify-center`}>
            <div onClick={toggleExpanded} className={`
                            cursor-pointer border border-[#d1d5db] dark:border-[#4b4b4b6c] px-5 py-3 bg-gray-300 dark:bg-gray-800 w-full text-lg ${expanded ? '' : 'shadow-lg'}
                            ${expanded ? 'rounded-t-lg border-b-0' : 'rounded-lg'} hover:bg-gray-400 dark:hover:bg-gray-900`}>
                <div className="flex items-center gap-3 dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008z" />
                    </svg>
                    <span>{title}</span>
                </div>
            </div>
            <Collapse open={expanded}>
                <div className="container p-5 text-black dark:text-white bg-gray-200 dark:bg-gray-700 rounded-b-lg border border-[#d1d5db] dark:border-[#4b4b4b6c] border-l border-r transition-all ease-out duration-200 transform">
                    <PromiseHandler promise={fetchSettings}>
                        <PromiseHandler.Response>
                            {settings => (
                                <div className="px-5 py-5 grid max-md:grid-cols-1 md:grid-cols-2 gap-10">
                                    <SettingFragmentContent ref={ref} fragmentKey={fragmentKey} settings={settings} Component={ComponentFragment} />
                                </div>
                            )}
                        </PromiseHandler.Response>
                    </PromiseHandler>
                </div>
            </Collapse>
        </section>
    )
}


const SettingFragmentContent = forwardRef(function SettingFragmentContent<T extends keyof SettingFragments>(props: SettingFragmentContentProps<T>, ref: Ref<ExportRefProps<T>>): JSX.Element {

    const { settings, fragmentKey, Component } = props

    const [beforeSettings, setBeforeSettings] = useState<Schema<SettingFragments[T]>>(settings)

    const stateProxy = asStateProxy(useBinding(beforeSettings))

    useImperativeHandle(ref, () => ({
        async saveSettings() {
            if (!isModified()) return // if not modified, do nothing
            await setSettingStorage<T, Schema<SettingFragments[T]>>(fragmentKey, { ...stateProxy.state }) // set the settings to storage
            setBeforeSettings(deepCopy(stateProxy.state)) // update before settings so that to update check modified status
        },
        async importSettings(settings: Schema<SettingFragments[T]>) {
            await setSettingStorage<T, Schema<SettingFragments[T]>>(fragmentKey, settings)
            setBeforeSettings(deepCopy(settings))
        },
        fragmentKey: fragmentKey
    }), [beforeSettings]);

    // create a memo function for check modified status
    // only before settings changed or after settings changed, the modified status will be changed
    const isModified = useCallback(() => JSON.stringify(beforeSettings) !== JSON.stringify(stateProxy.state), [beforeSettings])

    // create beforeunload event listener for alert user when leaving page without saving
    useEffect(() => {
        const listener = (e: BeforeUnloadEvent) => {
            if (isModified()) {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', listener)
        return () => window.removeEventListener('beforeunload', listener)
    }, [beforeSettings])

    return <Component {...stateProxy} />
})


export default forwardRef(SettingFragment)