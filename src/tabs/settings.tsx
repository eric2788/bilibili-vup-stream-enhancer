import { Button, ButtonGroup, Card, CardBody, CardHeader, Collapse, Typography } from "@material-tailwind/react"
import { Fragment, useState } from "react"
import { useBinding } from "~hooks/binding"
import fragments, { type SettingFragment } from "~settings"

import '~tailwind'

document.title = '字幕过滤设定'

console.log('hello world to setting page!')

const toggleMap = Object.fromEntries(Object.keys(fragments).map(key => [key, false])) as Record<keyof typeof fragments, boolean>

function SettingPage(): JSX.Element {

    const [section] = useBinding(toggleMap)
    const toggleSection = (key: keyof typeof fragments) => {
        section[key] = !section[key]
        console.info(`toggle collapse ${key} to ${section[key]}`)
    }

    return (
        <Fragment>
            <section className="bg-gray-700 ">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
                    <h1 className="mb-4 text-4xl tracking-tight leading-none md:text-5xl lg:text-6xl text-black">字幕过滤设定</h1>
                    <p className="mb-8 text-lg font-light lg:text-xl text-black-400">设定页面: 按下储存后可即时生效。</p>
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 gap-3">
                        <Button size="lg">保存设定</Button>
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
                <section className="mx-2 md:mx-5 my-2 lg:mx-auto justify-center">
                    <div onClick={() => toggleSection('danmaku')} className="cursor-pointer outline shadow-lg px-5 py-5 bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-800 rounded-md w-full text-lg">
                        ➵ 同传弹幕设定
                    </div>
                    <Collapse open={section['danmaku']}>
                       <div className="container p-2 text-white">
                        hello world!!!
                       </div>
                    </Collapse>
                </section>
            </div>
        </Fragment>
    )
}



export default SettingPage