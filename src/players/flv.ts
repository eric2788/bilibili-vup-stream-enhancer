import flvJs from 'mpegts.js';
import type { BufferHandler, StreamPlayer } from "~players";

class FlvPlayer implements StreamPlayer {

    private bufferHandlers: BufferHandler[] = []
    private player: flvJs.Player

    get isSupported(): boolean {
        return flvJs.isSupported()
    }

    loadAndPlay(url: string, container: HTMLMediaElement): Promise<void> {
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
        this.player.attachMediaElement(container)
        this.player.load()
        this.player.play()
        return new Promise((res, rej) => {
            this.player.on('media_info', () => {
                this.hijackBaseLoader()
                res()
            })
            this.player.on('error', (e) => {
                console.warn('flv error: ', e)
                this.player.detachMediaElement()
                rej(e)
            })
        })
    }

    addBufferHandler(handler: BufferHandler): VoidFunction {
        this.bufferHandlers.push(handler)
        return () => {
            const idx = this.bufferHandlers.indexOf(handler)
            if (idx !== -1) {
                this.bufferHandlers.splice(idx, 1)
            }
        }
    }

    async stopAndDestroy(): Promise<void> {
        this.player.detachMediaElement()
        this.player.destroy()
        this.player = null
    }

    get internalPlayer(): any {
        return this.player
    }

    hijackBaseLoader(): void {
        const flv = this
        const player = this.player as any
        if (player.TAG !== 'MSEPlayer') {
            console.error('Not a MSEPlayer, hijack failed')
            return
        }
        const baseLoader = player?._transmuxer?._controller?._ioctl?._loader
        if (!baseLoader) {
            console.error('No base loader found, hijack failed')
            return
        }
        const _onDataArrival = baseLoader._onDataArrival
        baseLoader._onDataArrival = function(chunks: ArrayBuffer, byteStart: number, receivedLength: number) {
            _onDataArrival(chunks, byteStart, receivedLength)
            flv.bufferHandlers.forEach(handler => handler(chunks))
        }
    }
}


export default FlvPlayer