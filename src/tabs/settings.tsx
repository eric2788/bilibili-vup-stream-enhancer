import { Button, ButtonGroup, Card, CardBody, CardHeader, Collapse, Typography } from "@material-tailwind/react"
import React, { Fragment, useState } from "react"
import { asStateProxy, useBinding, type StateProxy } from "~hooks/binding"
import fragments, { type SettingFragment, type SettingFragments, type Schema } from "~settings"
import { useStorage } from "~hooks/storage"

import '~tailwind'
import { sendBackground } from "~utils/messaging"

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

        const saveSettings = () => setSettings({ ...stateProxy.state })

        return {
            component: (
                <section key={key} id={key} className={`mx-2 md:mx-5 my-5 max-md:mx-5 lg:mx-auto justify-center ${section[key] ? '' : 'shadow-lg'} rounded-md`}>
                    <div onClick={() => toggleSection(key)} className={`
                            cursor-pointer border border-[#d1d5db] dark:border-[#4b4b4b6c] px-5 py-3 bg-gray-300 dark:bg-gray-800 w-full text-lg 
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
                        <div className="container p-5 bg-white-200 text-black dark:text-white bg-gray-200 dark:bg-gray-700 rounded-b-lg border border-[#d1d5db] dark:border-[#4b4b4b6c] border-l border-r">
                            <ComponentFragment {...stateProxy} />
                        </div>
                    </Collapse>
                </section>
            ),
            saveSettings
        }
    })

    const saveAllSettings = async () => {
        try {
            await Promise.all(settingFragments.map(({ saveSettings }) => saveSettings()))
            await sendBackground('notify', {
                title: '保存设定成功',
                message: '所有设定已经保存成功。'
            })
        } catch (err: Error | any) {
            console.error(err)
            await sendBackground('notify', {
                title: '保存设定失败',
                message: err.message
            })
        }
    }

    return (
        <Fragment>
            <section className="bg-gray-700">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 text-white">
                    <h1 className="mb-4 text-4xl tracking-tight leading-none md:text-5xl lg:text-6xl ">字幕过滤设定</h1>
                    <p className="mb-8 text-lg font-light lg:text-xl text-black-400">设定页面: 按下储存后可即时生效。</p>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 gap-3">
                        <Button size="lg" onClick={() => sendBackground('check-update', {})}>检查更新</Button>
                        <Button size="lg" className="flex items-center justify-center gap-3">
                            导入设定
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </Button>
                        <Button size="lg" className="flex items-center justify-center gap-3">
                            导出设定
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </section>
            <div className="container mx-auto m-10">
                {settingFragments.map(({ component }) => component)}
            </div>
        </Fragment>
    )
}



export default SettingPage