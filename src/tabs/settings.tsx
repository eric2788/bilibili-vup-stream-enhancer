import { Button } from "@material-tailwind/react"
import { Fragment, useRef } from "react"
import { sendInternal } from "~background/messages"
import BJFThemeProvider from "~components/BJFThemeProvider"
import { useBinding } from "~hooks/binding"
import { useForwarder } from "~hooks/forwarder"
import { useLoader } from "~hooks/loader"
import fragments, { type Schema, type SettingFragments, type Settings } from "~settings"
import SettingFragment, { type SettingFragmentRef } from "~settings/components/SettingFragment"

import '~tailwindcss'
import { download, readAsJson } from "~utils/file"
import { arrayEqual, removeInvalidKeys, sleep } from "~utils/misc"
import { getFullSettingStroage } from "~utils/storage"

document.title = '字幕过滤设定'

const toggleMap = Object.fromEntries(Object.keys(fragments).map(key => [key, false])) as Record<keyof typeof fragments, boolean>

const fragmentKeys = Object.keys(fragments) as (keyof SettingFragments)[]

async function exportSettings(): Promise<void> {
    try {
        const settings = await getFullSettingStroage()
        const exportContent = JSON.stringify(settings)
        download('settings.json', exportContent, 'application/json')
        await sendInternal('notify', {
            title: '导出设定成功',
            message: '设定已经导出成功。'
        })
    } catch (err: Error | any) {
        await sendInternal('notify', {
            title: '导出设定失败',
            message: err.message
        })
    }
}

async function clearRecords(): Promise<void> {
    try {
        const re = await sendInternal('clear-table', { table: 'all' })
        if (re instanceof Object && re.result !== 'success') {
            throw re.error
        }
        await sendInternal('notify', {
            title: '清空记录成功',
            message: '所有记录已经清空。'
        })
    } catch (err: Error | any) {
        await sendInternal('notify', {
            title: '清空记录失败',
            message: err.message
        })
    }
}

async function checkingUpdate(): Promise<void> {
    try {
        await sendInternal('check-update')
    } catch (err: Error | any) {
        await sendInternal('notify', {
            title: '检查更新失败',
            message: err.message
        })
    }
}

function SettingPage(): JSX.Element {

    const [section] = useBinding(toggleMap)
    const toggleSection = (key: keyof typeof fragments) => section[key] = !section[key]

    const form = useRef<HTMLFormElement>()
    const fileImport = useRef<HTMLInputElement>()
    const fragmentRefs = fragmentKeys.map(key => useRef<SettingFragmentRef<typeof key>>())

    const forwarder = useForwarder('command', 'pages')

    const [loader, loading] = useLoader({
        checkingUpdate,
        exportSettings,
        clearRecords,
        importSettings: async () => {
            const listener = async (e: Event) => {
                const target = e.target as HTMLInputElement
                if (target.files.length === 0) return
                const file = target.files[0]
                try {
                    const settings = (await readAsJson(file)) as Settings
                    if (!(settings instanceof Object)) {
                        throw new Error('导入的设定文件格式错误。')
                    }
                    if (!arrayEqual(Object.keys(settings), fragmentKeys)) {
                        throw new Error('导入的设定文件格式错误。')
                    }
                    await Promise.all(fragmentRefs.map((ref) => {
                        const fragmentKey = ref.current.fragmentKey
                        const { defaultSettings } = fragments[fragmentKey]
                        const importContent = removeInvalidKeys({ ...defaultSettings, ...settings[fragmentKey] }, defaultSettings as Schema<SettingFragments[typeof fragmentKey]>)
                        return ref.current.importSettings(importContent)
                    }))
                    await sendInternal('notify', {
                        title: '导入设定成功',
                        message: '设定已经导入成功。'
                    })
                    // 向所有页面发送重启指令
                    forwarder.sendForward('content-script', { command: 'restart' })
                } catch (err: Error | any) {
                    console.error(err)
                    await sendInternal('notify', {
                        title: '导入设定失败',
                        message: err.message
                    })
                } finally {
                    fileImport.current.files = null
                    fileImport.current.removeEventListener('change', listener)
                }
            }
            fileImport.current.addEventListener('change', listener)
            fileImport.current.click()
        },
        saveAllSettings: async () => {
            if (!form.current.checkValidity()) {
                form.current.reportValidity()
                return
            }
            await Promise.all(fragmentRefs.map(ref => ref.current.saveSettings()))
            await sendInternal('notify', {
                title: '保存设定成功',
                message: '所有设定已经保存成功。'
            })
            // 向所有页面发送重启指令
            forwarder.sendForward('content-script', { command: 'restart' }, { url: '*://live.bilibili.com/*' })
            await sleep(5000)
        }
    }, (err) => {
        console.error(err)
        sendInternal('notify', {
            title: '保存设定失败',
            message: err.message
        })
    })

    return (
        <Fragment>
            <section className="bg-gray-700">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 text-white">
                    <h1 className="mb-4 text-4xl tracking-tight leading-none md:text-5xl lg:text-6xl ">字幕过滤设定</h1>
                    <p className="mb-8 text-lg font-light lg:text-xl text-black-400">设定页面: 按下储存后可即时生效。</p>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 gap-3">
                        <Button onClick={loader.checkingUpdate} disabled={loading.checkingUpdate} className="group flex items-center justify-center gap-3 text-lg hover:shadow-white-100/50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-disabled:animate-spin">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            检查更新
                        </Button>
                        <Button onClick={loader.importSettings} disabled={loading.importSettings} className="group flex items-center justify-center gap-3 text-lg hover:shadow-white-100/50">
                            导入设定
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-disabled:animate-bounce">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </Button>
                        <Button onClick={loader.exportSettings} disabled={loading.exportSettings} className="group flex items-center justify-center gap-3 text-lg hover:shadow-white-100/50">
                            导出设定
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-disabled:animate-bounce">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </section>
            <form ref={form} className="container mx-auto m-10" onSubmit={e => e.preventDefault()}>
                {fragmentKeys.map((key, index) => (
                    <SettingFragment ref={fragmentRefs[index]} key={key} fragmentKey={key} toggleExpanded={() => toggleSection(key)} expanded={section[key]} />
                ))}
                <input ref={fileImport} placeholder="" title="" type="file" style={{ display: 'none' }} accept=".json"></input>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 gap-3 px-4 pt-3 mx-auto max-w-screen-xl">
                    <Button
                        type="submit"
                        disabled={loading.saveAllSettings}
                        onClick={loader.saveAllSettings}
                        className="group flex items-center justify-center gap-3 text-white bg-green-600 px-3 py-3 text-[1rem] hover:shadow-lg hover:shadow-green-600/50">
                        保存设定
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-disabled:animate-bounce">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                        </svg>
                    </Button>
                    <Button
                        disabled={loading.clearRecords}
                        onClick={loader.clearRecords}
                        className="group flex items-center justify-center gap-3 text-white bg-red-600 px-3 py-3 text-[1rem] hover:shadow-lg hover:shadow-red-600/50">
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




function SettingApp(): JSX.Element {
    return (
        <BJFThemeProvider>
            <SettingPage />
        </BJFThemeProvider>
    )
}

export default SettingApp

