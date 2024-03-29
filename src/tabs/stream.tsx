import '~style.css';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { Button, Typography } from '@material-tailwind/react';
import { useInterval } from '@react-hooks-library/core';
import {
    MediaCaptionsButton,
    MediaChromeButton,
    MediaControlBar,
    MediaController,
    MediaLiveButton,
    MediaLoadingIndicator,
    MediaMuteButton,
    MediaPlayButton,
    MediaPlaybackRateButton,
    MediaTimeDisplay,
    MediaVolumeRange
} from 'media-chrome/dist/react';
import NDanmaku from 'n-danmaku';
import type { ResponseBody as DanmakuBody } from '~background/forwards/danmaku';
import type { StreamUrls } from '~background/messages/get-stream-urls';
import BJFThemeProvider from '~components/BJFThemeProvider';
import PromiseHandler from '~components/PromiseHandler';
import { useForwarder } from '~hooks/forwarder';
import loadStream from '~players';
import { sendMessager } from '~utils/messaging';
import { useAsyncEffect } from '~hooks/life-cycle';

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const title = urlParams.get('title')
const owner = urlParams.get('owner')

document.title = `${owner} 的直播间: ${title}`

// lock the screen size
document.documentElement.style.minHeight = window.innerHeight + 'px'
document.documentElement.style.minWidth = window.innerWidth + 'px'


function MonitorApp({ urls }: { urls: StreamUrls }): JSX.Element {

    const containerRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const danmaku = useRef<NDanmaku>(null)
    const danmakus = useRef<DanmakuBody[]>([])
    const danmakuForwarder = useForwarder('danmaku', 'pages')
    const jimakuForwarder = useForwarder('jimaku', 'pages')


    useAsyncEffect(
        async () => {
            console.info('urls: ', urls)
            const p = await loadStream(urls, videoRef.current)
            danmaku.current = new NDanmaku(containerRef.current, 'bjf-danmaku')
            p.on('error', console.error)
            return p
        },
        async (p) => {
            if (danmaku.current) {
                danmaku.current.clear()
            } else {
                console.warn('danmaku is not initialized, skip cleanup')
            }
            if (p) {
                p.stopAndDestroy()
                console.info('player destroyed')
            } else {
                console.warn('player is not initialized, skip cleanup')
            }
        },
        (err) => {
            console.error(err)
            alert('加载播放器失败, 请刷新页面')
        },
        [urls]
    )

    useInterval(() => {
        if (danmakus.current.length === 0) return
        const data = danmakus.current.shift()
        if (danmaku.current) {
            danmaku.current
                .resetAttrs()
                .attrs('color', data.color)
                .attrs('opacity', 80)
                .attrs('weight', 'bold')
                .attrs('type', data.pos)
                .attrs('custom_css', {
                    'text-shadow': '1px 0 1px #000000'
                })
                //.attrs('size', '25px')
                .create(data.text)
        } else {
            console.warn('danmaku is not ready, skipped')
        }
    }, 300)


    const [hidedDanmaku, setHidedDanmaku] = useState(false)

    useEffect(() => {

        const track = videoRef.current.addTextTrack('captions', '同传弹幕', 'zh-cn')
        track.addEventListener('error', console.error)
        track.mode = "showing"

        danmakuForwarder.addHandler((data) => {
            if (data.room !== roomId) return // return if not current room
            console.info('danmaku: ', data)
            danmakus.current.push(data)
        })

        jimakuForwarder.addHandler((data) => {
            console.info('jimaku: ', data)
            if (data.room !== roomId) return
            const start = videoRef.current.currentTime + 1 // 1 秒后开始
            const end = start + 3 // 字幕逗留 3 秒
            const cue = new VTTCue(start, end, data.text)
            track.addCue(cue)
        })

        const reloader = () => location.reload()
        const danmakuToggle = () => {
            const player = document.getElementsByClassName('N-dmLayer')[0] as HTMLElement
            if (!player) {
                alert('player not found')
                return
            }
            // 無論如何，先清除一下彈幕
            danmaku.current?.clear()
            if (player.style.display === 'none') {
                player.style.display = 'block'
                setHidedDanmaku(false)
            } else {
                player.style.display = 'none'
                setHidedDanmaku(true)
            }
        }

        document.getElementById('reload-btn').addEventListener('click', reloader)
        document.getElementById('danmaku-btn').addEventListener('click', danmakuToggle)

        return () => {
            document.getElementById('reload-btn').removeEventListener('click', reloader)
            document.getElementById('danmaku-btn').removeEventListener('click', danmakuToggle)
        }

    }, [])

    return (
        <Fragment>
            <div id="bjf-danmaku-container" ref={containerRef} className='w-full h-full'>
                <MediaController id="bjf-player" className="w-full h-full z-0" mediastreamtype="live">
                    <video
                        ref={videoRef}
                        id="bjf-video"
                        slot="media"
                        playsInline
                        autoPlay
                    />
                    <MediaLoadingIndicator slot="loading"></MediaLoadingIndicator>
                    <MediaControlBar className="flex justify-between">
                        <div>
                            <MediaPlayButton></MediaPlayButton>
                            <MediaLiveButton></MediaLiveButton>
                            <MediaTimeDisplay></MediaTimeDisplay>
                            <MediaMuteButton></MediaMuteButton>
                            <MediaVolumeRange></MediaVolumeRange>
                        </div>
                        <div>
                            <MediaChromeButton id="danmaku-btn" title="隐藏/显示弹幕">
                                {hidedDanmaku ?
                                    (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
                                        </svg>
                                    ) :
                                    (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
                                        </svg>
                                    )}
                            </MediaChromeButton>
                            <MediaChromeButton id="reload-btn" title="刷新直播">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                                </svg>
                            </MediaChromeButton>
                            <MediaCaptionsButton></MediaCaptionsButton>
                            <MediaPlaybackRateButton></MediaPlaybackRateButton>
                        </div>
                    </MediaControlBar>
                </MediaController>
            </div>
        </Fragment>
    )
}


function App(): JSX.Element {

    const getStreamUrls = useCallback(async () => {
        const res = await sendMessager('get-stream-urls', { roomId })
        if (res.error) throw new Error(res.error)
        return res.data.toSorted((a, b) => b.quality - a.quality)
    }, [])

    return (
        <BJFThemeProvider>
            <PromiseHandler promise={getStreamUrls}>
                <PromiseHandler.Error>
                    {error => (
                        <div className="flex flex-col justify-center items-center text-center h-screen w-full gap-5 text-red-500">
                            <div>
                                <Typography variant="h5" color="red" className="semi-bold">加载错误:</Typography>
                            </div>
                            <div>
                                <span className="text-[17px]">{error.message}</span><br />
                            </div>
                            <Button color="red" size='sm' className='text-lg' onClick={() => location.reload()}>重试</Button>
                        </div>
                    )}
                </PromiseHandler.Error>
                <PromiseHandler.Loading>
                    <div className="flex justify-center items-center text-center h-screen w-full">
                        <div className="text-gray-500">
                            <Typography variant="h5" color="gray" className="semi-bold animate-pulse">加载中...</Typography>
                        </div>
                    </div>
                </PromiseHandler.Loading>
                <PromiseHandler.Response>
                    {urls => <MonitorApp urls={urls} />}
                </PromiseHandler.Response>
            </PromiseHandler>
        </BJFThemeProvider>
    )
}


export default App

