import '~style.css';

import { Typography } from "@material-tailwind/react";
import icon from 'raw:assets/icon.png';
import { Fragment, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useForwarder } from "~hooks/forwarder";

import ChatBubble from "~components/ChatBubble";
import createLLMProvider from "~llms";
import { getSettingStorage } from "~utils/storage";
import Markdown from 'markdown-to-jsx';

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId')
const roomTitle = urlParams.get('title')

const loadingText = '正在加载同传字幕总结.....'

function App() {

    const [title, setTitle] = useState('加载中')
    const [summary, setSummary] = useState<string>(loadingText)
    const [error, setError] = useState('')
    const deferredSummary = useDeferredValue(summary)
    const forwarder = useForwarder('jimaku-summarize', 'pages')

    const loading = useMemo(
        () => summary === loadingText && !error,
        [summary, error]
    )

    useEffect(() => {
        if (!roomId) {
            alert('未指定房间号')
            return
        }
        setTitle(roomTitle ?? `B站直播间 ${roomId}`)
        // only run once after success
        const remover = forwarder.addHandler((data) => {
            if (data.roomId !== roomId) return
            console.debug('received ', data.jimakus.length, 'danmakus')
            summarize(data.jimakus)
            remover()
        })
        return remover
    }, [])

    const summarize = useCallback(async (danmakus: string[]) => {
        try {
            const llmSettings = await getSettingStorage('settings.llm')
            const llm = createLLMProvider(llmSettings)
            const summaryStream = llm.promptStream(`这位是一名在b站直播间直播的日本vtuber说过的话,请根据下文对话猜测与观众的互动内容,并用中文总结一下他们的对话:\n\n${danmakus.join('\n')}`)
            for await (const words of summaryStream) {
                if (llm.cumulative) {
                    setSummary(summary => summary === loadingText ? words : summary + words)
                } else {
                    setSummary(words)
                }
            }
        } catch (err) {
            console.error(err)
            setError('错误: ' + err.message)
        } finally {
            if (summary === '') {
                setError('同传总结返回了空的回应。')
            }
        }
    }, [])

    return (
        <main>
            <section className="sticky top-0 z-10 flex items-center h-16 shadow-md bg-gray-800 dark:bg-gray-800 py-3 px-6 w-full max-w-full">
                <Typography variant="h5" color="white" >{title}</Typography>
            </section>
            <section className="overflow-y-auto overflow-x-clip w-full">
                <div className="p-6">
                    <div className="grid pb-2">
                        <ChatBubble
                            avatar={icon}
                            loading={loading}
                            name="同传字幕总结"
                            messages={[{ text: <Markdown options={{ wrapper: Fragment }} >{deferredSummary}</Markdown> }]}
                            footer={error && <Typography variant="small" color="red" className="font-semibold">{error}</Typography>}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}


export default App;