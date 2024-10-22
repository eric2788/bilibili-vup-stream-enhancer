import { Typography } from "@material-tailwind/react";
import icon from 'raw:assets/icon.png';
import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { useForwarder } from "~hooks/forwarder";

import ChatBubble from "~components/ChatBubble";
import createLLMProvider, { type LLMProviders } from "~llms";
import type { AISchema } from "~options/features/jimaku/components/AIFragment";
import '~style.css';
import { getSettingStorage } from "~utils/storage";

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId')
const roomTitle = urlParams.get('title')

function createLLM(schema: AISchema): LLMProviders {
    switch (schema.provider) {
        case 'worker':
        case 'nano':
            return createLLMProvider(schema.provider)
        case 'qwen':
            return createLLMProvider(schema.provider, schema.accountId, schema.apiToken)
    }
}

const loadingText = '正在加载同传字幕总结.....'

function App() {

    const [title, setTitle] = useState('加载中')
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<string>(loadingText)
    const [error, setError] = useState('')
    const deferredSummary = useDeferredValue(summary)
    const forwarder = useForwarder('jimaku-summarize', 'pages')

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
            const { jimaku: { aiZone } } = await getSettingStorage('settings.features')
            const llm = createLLM(aiZone)
            const summaryStream = llm.promptStream(`这位是一名在b站直播间直播的日本vtuber说过的话,请根据下文对话猜测与观众的互动内容,并用中文总结一下他们的对话:\n\n${danmakus.join('\n')}`)
            setLoading(false)
            for await (const words of summaryStream) {
                setSummary(summary => summary === loadingText ? words : summary + words)
            }
        } catch (err) {
            setLoading(false)
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
                            messages={[{ text: deferredSummary }]}
                            footer={error && <Typography variant="small" color="red" className="font-semibold">{error}</Typography>}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}


export default App;