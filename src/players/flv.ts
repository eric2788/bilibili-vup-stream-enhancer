import flvJs from 'mpegts.js';
import { type VideoInfo } from "~players";
import { StreamPlayer } from '~types/media';

class FlvPlayer extends StreamPlayer {

    private player: flvJs.Player
    private streamController: AbortController

    get isSupported(): boolean {
        return flvJs.isSupported()
    }

    get internalPlayer(): any {
        return this.player
    }

    get videoInfo(): VideoInfo {
        return {
            mimeType: 'video/x-flv',
            extension: 'flv'
        }
    }

    play(url: string, media?: HTMLMediaElement): Promise<void> {

        if (!media) {
            // if no media, just load the stream via fetch
            return this.load(url)
        }

        this.player = flvJs.createPlayer({
            type: 'flv',
            isLive: true,
            url
        }, {
            stashInitialSize: 1024 * 1024,
            autoCleanupSourceBuffer: true,
            headers: {
                'Origin': 'https://live.bilibili.com'
            }
        })
        this.player.attachMediaElement(media)
        this.player.load()
        this.player.play()
        return new Promise((res, rej) => {
            this.player.on('media_info', () => {
                //this.hijackBaseLoader()
                this.emit('loaded', {})
                res()
            })
            this.player.on('error', (e) => {
                console.warn('flv error: ', e)
                this.player.detachMediaElement()
                this.emit('error', e)
                rej(e)
            })
        })
    }

    async load(url: string): Promise<void> {
        try {
            this.streamController = new AbortController()
            const res = await fetch(url, { signal: this.streamController.signal })
            if (!res.ok) throw new Error('fetch error: ' + res.statusText)
            if (res.bodyUsed) throw new Error('response body already used')
            const reader = res.body.getReader()
            const pump = async () => {
                try {
                    const { done, value } = await reader.read()
                    if (done) return
                    this.emit('buffer', value.buffer)
                    await pump()
                } catch (err: Error | any) {
                    if (err.name === 'AbortError') {
                        return
                    }
                    this.emit('error', err)
                    console.warn('error while reading stream segment: ', err)
                }
            }
            pump()
            this.emit('loaded', {})
        } catch (err: Error | any) {
            this.emit('error', err)
            throw err
        }
    }

    stopAndDestroy() {
        this.clearHandlers()
        // for load case
        if (this.streamController) {
            this.streamController.abort()
            this.streamController = null
        }
        // for play case
        if (this.player) {
            this.player.detachMediaElement()
            this.player.destroy()
            this.player = null
        }
    }

    // currently not working, so use the fetch method instead
    // hijackBaseLoader(): void {
    //     const flv = this
    //     const player = this.player as any
    //     if (player.TAG !== 'MSEPlayer') {
    //         console.error('Not a MSEPlayer, hijack failed')
    //         return
    //     }
    //     const baseLoader = player?._transmuxer?._controller?._ioctl?._loader
    //     if (!baseLoader) {
    //         console.error('No base loader found, hijack failed')
    //         return
    //     }
    //     const _onDataArrival = baseLoader._onDataArrival
    //     baseLoader._onDataArrival = function (chunks: ArrayBuffer, byteStart: number, receivedLength: number) {
    //         _onDataArrival(chunks, byteStart, receivedLength)
    //         flv.emit('buffer', chunks)
    //     }
    // }
}


export default FlvPlayer