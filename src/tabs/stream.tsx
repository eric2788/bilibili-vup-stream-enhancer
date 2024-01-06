import 'https://cdn.jsdelivr.net/npm/hls.js@1';
import 'https://github.com/xqq/mpegts.js/releases/download/v1.7.3/mpegts.js';
import '~tailwindcss';

import { useCallback, useState } from 'react';

import BJFThemeProvider from '~components/BJFThemeProvider';
import PromiseHandler from '~components/PromiseHandler';
import type { StreamUrls } from '~background/messages/get-stream-urls';
import { sendMessager } from '~utils/messaging';

const urlParams = new URLSearchParams(window.location.search);
const roomId = parseInt(urlParams.get('roomId'));
const title = urlParams.get('title')

document.title = `直播间: ${title}`

function MonitorApp({urls}: { urls: StreamUrls }): JSX.Element {
    return (
        <>
            {urls.map((url, i) => (
                <div key={i}>
                    <span>spec: {url.name}</span>
                    <span>quality: {url.quality}</span>
                    <span>url: {url.url}</span>
                    <span>type: {url.type}</span>
                </div>
            ))}
        </>
    )
}


export function App(): JSX.Element {

    const getStreamUrls = useCallback(async () => {
        const res = await sendMessager('get-stream-urls', { roomId })
        if (res.error) throw new Error(res.error)
        return res.data
    }, [])

    const [fetchUrls, setFetchUrls] = useState<() => Promise<StreamUrls>>(getStreamUrls)

    return (
        <BJFThemeProvider>
            <PromiseHandler promise={fetchUrls} >
                <PromiseHandler.Response>
                    {urls => <MonitorApp urls={urls} />}
                </PromiseHandler.Response>
            </PromiseHandler>
        </BJFThemeProvider>
    )
}


export default MonitorApp

