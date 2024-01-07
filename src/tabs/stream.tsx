import '~tailwindcss';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { Button, Typography } from '@material-tailwind/react';
import {
    MediaControlBar,
    MediaController,
    MediaMuteButton,
    MediaPlayButton,
    MediaTimeDisplay,
    MediaTimeRange,
    MediaVolumeRange,
    MediaLiveButton,
    MediaPlaybackRateButton,
    MediaLoadingIndicator
} from 'media-chrome/dist/react';
import { sendInternal } from '~background/messages';
import type { StreamUrls } from '~background/messages/get-stream-urls';
import BJFThemeProvider from '~components/BJFThemeProvider';
import PromiseHandler from '~components/PromiseHandler';
import { useForwarder } from '~hooks/forwarder';
import loadStream, { type StreamPlayer } from '~players';
import Danmaku from 'danmaku';

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const title = urlParams.get('title')
const owner = urlParams.get('owner')

document.title = `${owner} 的直播间: ${title}`

function MonitorApp({ urls, refresh }: { urls: StreamUrls, refresh: VoidFunction }): JSX.Element {

    const containerRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const player = useRef<StreamPlayer>(null)
    const danmaku = useRef<Danmaku>(null)

    console.info('urls: ', urls)

    useEffect(() => {

        loadStream(roomId, urls, videoRef.current)
            .then(p => player.current = p)
            .catch(e => {
                console.error(e)
                alert('加载播放器失败, 请刷新页面')
                refresh()
            })

        danmaku.current = new Danmaku({
            container: containerRef.current,
            media: videoRef.current,
        })

        return () => {
            danmaku.current.destroy()
            if (!player.current) {
                console.warn('player is not initialized, skip cleanup')
                return
            }
            player.current.stopAndDestroy()
                .then(() => {
                    console.info('player destroyed')
                    player.current = null
                })
        }

    }, [urls])


    const forwarder = useForwarder('danmaku', 'pages')
    forwarder.addHandler((data) => {
        console.info('danmaku: ', data)
        if (danmaku.current) {
            danmaku.current.emit({
                text: data.text,
                mode: data.pos,
                style: {
                    color: data.color,
                }
            })
        } else {
            console.warn('danmaku is not ready, skipped')
        }
    })

    const isLive = videoRef.current ? (videoRef.current.duration - videoRef.current.currentTime < 5) : false // within 5 seconds

    console.info('isLive is now: ', isLive)

    return (
        <Fragment>
            <MediaController id="bjf-player" className="w-full h-full" onResize={() => danmaku.current && danmaku.current.resize()}>
                <div ref={containerRef}></div>
                <video
                    ref={videoRef}
                    id="bjf-video"
                    slot="media"
                    preload="auto"
                    autoPlay
                />
                <MediaLoadingIndicator slot="loading"></MediaLoadingIndicator>
                <MediaControlBar>
                    <MediaPlayButton></MediaPlayButton>
                    <MediaLiveButton></MediaLiveButton>
                    <MediaMuteButton></MediaMuteButton>
                    <MediaVolumeRange></MediaVolumeRange>
                    <MediaTimeRange></MediaTimeRange>
                    <MediaTimeDisplay showDuration></MediaTimeDisplay>
                    <MediaPlaybackRateButton></MediaPlaybackRateButton>
                </MediaControlBar>
            </MediaController>
        </Fragment>
    )
}


function App(): JSX.Element {

    const getStreamUrls = useCallback(async () => {
        const res = await sendInternal('get-stream-urls', { roomId })
        if (res.error) throw new Error(res.error)
        return res.data.toSorted((a, b) => b.quality - a.quality)
    }, [])

    const [fetchUrls, setFetchUrls] = useState<() => Promise<StreamUrls>>(getStreamUrls)
    const refresh = () => setFetchUrls(getStreamUrls)

    return (
        <BJFThemeProvider>
            <PromiseHandler promise={fetchUrls}>
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
                <PromiseHandler.Loading>
                    <div className="flex justify-center items-center text-center h-full w-full">
                        <div className="text-gray-500">
                            <Typography variant="h5" color="gray" className="semi-bold animate-pulse">加载中...</Typography>
                        </div>
                    </div>
                </PromiseHandler.Loading>
                <PromiseHandler.Response>
                    {urls => <MonitorApp urls={urls} refresh={refresh} />}
                </PromiseHandler.Response>
            </PromiseHandler>
        </BJFThemeProvider>
    )
}


export default App

