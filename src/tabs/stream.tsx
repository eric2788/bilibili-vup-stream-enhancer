import '~tailwindcss';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import BJFThemeProvider from '~components/BJFThemeProvider';
import PromiseHandler from '~components/PromiseHandler';
import type { StreamUrls } from '~background/messages/get-stream-urls';
import { sendInternal } from '~background/messages';
import { useForwarder } from '~hooks/forwarder';
import { Button, Typography } from '@material-tailwind/react';

const urlParams = new URLSearchParams(window.location.search);
const roomId = parseInt(urlParams.get('roomId'));
const title = urlParams.get('title')
const owner = urlParams.get('owner')

document.title = `${owner} 的直播间: ${title}`


function MonitorApp({ urls, refresh }: { urls: StreamUrls, refresh: VoidFunction }): JSX.Element {

    const playerRef = useRef<HTMLDivElement>(null)
    const player = useRef(null)

    console.info('urls: ', urls)

    const defaultUrl = urls.filter(url => url.type === 'flv').toSorted(((a, b) => b.quality - a.quality))[0]?.url

    useEffect(() => {
        

    }, [urls])


    const forwarder = useForwarder('danmaku', 'pages')
    forwarder.addHandler((data) => {
        console.info('danmaku: ', data)
        if (player.current) {
            player.current.danmaku.draw(data)
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

    const getStreamUrls = useCallback(async () => {
        const res = await sendInternal('get-stream-urls', { roomId })
        if (res.error) throw new Error(res.error)
        return res.data

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
                <PromiseHandler.Response>
                    {urls => <MonitorApp urls={urls} refresh={refresh} />}
                </PromiseHandler.Response>
            </PromiseHandler>
        </BJFThemeProvider>
    )
}


export default App

