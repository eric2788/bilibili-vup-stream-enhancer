import '~tailwindcss';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import BJFThemeProvider from '~components/BJFThemeProvider';
import DPlayer from 'dplayer';
import PromiseHandler from '~components/PromiseHandler';
import type { StreamUrls } from '~background/messages/get-stream-urls';
import flvContent from 'https://github.com/bilibili/flv.js/releases/download/v1.6.2/flv.min.js';
import hlsContent from 'https://cdn.jsdelivr.net/npm/hls.js@1';
import { sendInternal } from '~background/messages';
import { useForwarder } from '~hooks/forwarder';
import { Button, Typography } from '@material-tailwind/react';

console.info(window.flvjs, flvContent)
console.info(window.Hls, hlsContent)

const urlParams = new URLSearchParams(window.location.search);
const roomId = parseInt(urlParams.get('roomId'));
const title = urlParams.get('title')
const owner = urlParams.get('owner')

document.title = `${owner} 的直播间: ${title}`


function MonitorApp({ urls }: { urls: StreamUrls }): JSX.Element {

    const playerRef = useRef<HTMLDivElement>()
    const dplayer = useRef<DPlayer>()

    console.info('urls: ', urls)

    useEffect(() => {
        const player = new DPlayer({
            container: playerRef.current,
            autoplay: true,
            live: true,
            preload: 'auto',
            lang: 'zh-cn',
            screenshot: true,
            danmaku: {
                id: 'bjf-player',
                api: ''
            },
            video: {
                url: urls
                    .filter(e => e.type === 'flv')
                    .toSorted((a, b) => b.quality - a.quality)[0].url,
                type: 'flv',
                quality: urls
                    .toSorted((a, b) => b.quality - a.quality)
                    .map(url => ({
                        url: url.url,
                        name: url.name,
                        type: url.type
                    })),
                defaultQuality: 0
            },
            pluginOptions: {
                flv: {
                    // refer to https://github.com/bilibili/flv.js/blob/master/docs/api.md#flvjscreateplayer
                    mediaDataSource: {
                        // mediaDataSource config
                        type: 'flv',
                        isLive: true,
                        withCredentials: true,
                        cors: true
                    },
                    config: {
                        // config
                        autoCleanupSourceBuffer: true,
                        headers: {
                            'Origin': 'https://live.bilibili.com',
                            'Referer': `https://live.bilibili.com/${roomId}`
                        }
                    },
                },
                hls: {

                }
            }
        })
        player.fullScreen.request('web') // request web fullscreen
        player.play()
        dplayer.current = player
    }, [urls])


    const forwarder = useForwarder('danmaku', 'pages')
    forwarder.addHandler((data) => {
        console.info('danmaku: ', data)
        if (dplayer.current) {
            dplayer.current.danmaku.draw(data)
        } else {
            console.warn('danmaku: dplayer is not ready, skipped')
        }
    })


    return (
        <Fragment>
            <div className='w-full h-full' ref={playerRef} id="bjf-player"></div>
        </Fragment>
    )
}


function App(): JSX.Element {

    const init = useCallback(async () => {

        window.flvjs = flvContent instanceof Promise ? await flvContent : flvContent
        window.Hls = hlsContent instanceof Promise ? await hlsContent : hlsContent

        const res = await sendInternal('get-stream-urls', { roomId })
        if (res.error) throw new Error(res.error)
        return res.data

    }, [])

    const [initData, setInitData] = useState<() => Promise<StreamUrls>>(init)
    const refresh = () => setInitData(init)

    return (
        <BJFThemeProvider>
            <PromiseHandler promise={initData}>
                <PromiseHandler.Error>
                    {error => (
                        <div className="flex justify-center items-center text-center h-full w-full">
                            <div className="text-red-500">
                                <Typography variant="h5" color="red" className="semi-bold">加载错误:</Typography>
                                <span className="text-[17px]">{error.message}</span>
                                <Button color="red" onClick={refresh}>重试</Button>
                            </div>
                        </div>
                    )}
                </PromiseHandler.Error>
                <PromiseHandler.Response>
                    {urls => <MonitorApp urls={urls} />}
                </PromiseHandler.Response>
            </PromiseHandler>
        </BJFThemeProvider>
    )
}


export default App

