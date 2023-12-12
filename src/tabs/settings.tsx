import { Button, Collapse } from "@material-tailwind/react"
import React, { Fragment, useRef } from "react"
import { asStateProxy, useBinding, type StateProxy } from "~hooks/binding"
import { useStorage } from "~hooks/storage"
import fragments, { type Schema, type SettingFragments } from "~settings"

import '~tailwind'
import { sendBackground } from "~utils/messaging"
import { sleep } from "~utils/misc"

document.title = '字幕过滤设定'

console.log('hello world to setting page!')

const toggleMap = Object.fromEntries(Object.keys(fragments).map(key => [key, false])) as Record<keyof typeof fragments, boolean>


function SettingPage(): JSX.Element {

    const [section] = useBinding(toggleMap)
    const toggleSection = (key: keyof typeof fragments) => {
        section[key] = !section[key]
        console.info(`toggle collapse ${key} to ${section[key]}`)
    }


    const settingFragments = Object.keys(fragments).map((key: keyof SettingFragments) => {

        const { title, defaultSettings, default: component } = fragments[key] as SettingFragments[typeof key]
        const [settings, setSettings] = useStorage<Schema<SettingFragments[typeof key]>>(`settings.${key as string}`, (v) => v ?? defaultSettings)
        const stateProxy = asStateProxy(useBinding(settings))

        const ComponentFragment = component as React.FC<StateProxy<Schema<SettingFragments[typeof key]>>>

        const saveSettings = () => {
            console.debug('saving: ', { ...stateProxy.state })
            setSettings({ ...stateProxy.state })
        }

        return {
            component: (
                <section key={key} id={key} className={`py-2 px-4 mx-auto max-w-screen-xl justify-center`}>
                    <div onClick={() => toggleSection(key)} className={`
                            cursor-pointer border border-[#d1d5db] dark:border-[#4b4b4b6c] px-5 py-3 bg-gray-300 dark:bg-gray-800 w-full text-lg ${section[key] ? '' : 'shadow-lg'}
                            ${section[key] ? 'rounded-t-lg border-b-0' : 'rounded-lg'} hover:bg-gray-400 dark:hover:bg-gray-900`}>
                        <div className="flex items-center gap-3 dark:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008z" />
                            </svg>
                            <span>{title}</span>
                        </div>
                    </div>
                    <Collapse open={section[key]}>
                        <div className="container p-5 text-black dark:text-white bg-gray-200 dark:bg-gray-700 rounded-b-lg border border-[#d1d5db] dark:border-[#4b4b4b6c] border-l border-r">
                            <ComponentFragment {...stateProxy} />
                        </div>
                    </Collapse>
                </section>
            ),
            saveSettings
        }
    })

    const form = useRef<HTMLFormElement>()


    const [loading] = useBinding({
        checkingUpdate: false,
        insertingSettings: false,
        exportingSettings: false,
        clearingRecords: false,
        saving: false,
    })

    const saveAllSettings = async () => {
        loading.saving = true
        try {
            if (!form.current.checkValidity()) {
                form.current.reportValidity()
                return
            }
            await Promise.all(settingFragments.map(({ saveSettings }) => saveSettings()))
            await sendBackground('notify', {
                title: '保存设定成功',
                message: '所有设定已经保存成功。'
            })
            await sleep(5000)
        } catch (err: Error | any) {
            console.error(err)
            await sendBackground('notify', {
                title: '保存设定失败',
                message: err.message
            })
        } finally {
            loading.saving = false
        }
    }

    const checkUpdate = async () => {
        loading.checkingUpdate = true
        try {
            await sendBackground('check-update')
            await sleep(5000)
        } finally {
            loading.checkingUpdate = false
        }
    }

    const importSettings = async () => {
        loading.insertingSettings = true
        try {
            // TODO
            await sleep(5000)
        } finally {
            loading.insertingSettings = false
        }
    }

    const exportSettings = async () => {
        loading.exportingSettings = true
        try {
            // TODO
            await sleep(5000)
        } finally {
            loading.exportingSettings = false
        }
    }

    const clearAllRecords = async () => {
        loading.clearingRecords = true
        try {
            // TODO
            await sleep(3000)
        } finally {
            loading.clearingRecords = false
        }
    }

    return (
        <Fragment>
            <section className="bg-gray-700">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 text-white">
                    <h1 className="mb-4 text-4xl tracking-tight leading-none md:text-5xl lg:text-6xl ">字幕过滤设定</h1>
                    <p className="mb-8 text-lg font-light lg:text-xl text-black-400">设定页面: 按下储存后可即时生效。</p>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 gap-3">
                        <Button onClick={checkUpdate} disabled={loading.checkingUpdate} className="group flex items-center justify-center gap-3 text-lg hover:shadow-white-100/50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-disabled:animate-spin">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            检查更新
                        </Button>
                        <Button onClick={importSettings} disabled={loading.insertingSettings} className="group flex items-center justify-center gap-3 text-lg hover:shadow-white-100/50">
                            导入设定
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-disabled:animate-bounce">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </Button>
                        <Button onClick={exportSettings} disabled={loading.exportingSettings} className="group flex items-center justify-center gap-3 text-lg hover:shadow-white-100/50">
                            导出设定
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-disabled:animate-bounce">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </section>
            <form ref={form} className="container mx-auto m-10" onSubmit={e => e.preventDefault()}>
                {settingFragments.map(({ component }) => component)}
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 gap-3 px-4 pt-3 mx-auto max-w-screen-xl">
                    <Button
                        type="submit"
                        disabled={loading.saving}
                        onClick={saveAllSettings}
                        className="group flex items-center justify-center gap-3 bg-green-600 px-3 py-3 text-[1rem] hover:shadow-lg hover:shadow-green-600/50">
                        保存设定
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-disabled:animate-bounce">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                        </svg>
                    </Button>
                    <Button
                        disabled={loading.clearingRecords}
                        onClick={clearAllRecords}
                        className="group flex items-center justify-center gap-3 bg-red-600 px-3 py-3 text-[1rem] hover:shadow-lg hover:shadow-red-600/50">
                        清空所有记录储存库
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-disabled:animate-ping">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </Button>
                </div>
            </form>
        </Fragment>
    )
}



export default SettingPage