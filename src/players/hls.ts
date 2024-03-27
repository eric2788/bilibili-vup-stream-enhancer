import type { BufferHandler, StreamPlayer } from "~players";
import Hls from 'hls.js'


class HlsPlayer implements StreamPlayer {

    private bufferHandlers: BufferHandler[] = []
    private player: Hls

    get isSupported(): boolean {
        return Hls.isSupported()
    }

    loadAndPlay(url: string, video: HTMLMediaElement): Promise<void> {
        this.player = new Hls({
            lowLatencyMode: true,
        })
        return new Promise((res, rej) => {
            this.player.once(Hls.Events.MEDIA_ATTACHED, () => {
                console.log('video and hls.js are now bound together !')
                res()
            })

            this.player.once(Hls.Events.MANIFEST_PARSED, (event, data) => {
                console.log('manifest loaded, found ' + data.levels.length + ' quality level', data)
                let i = 0;
                this.player.on(Hls.Events.BUFFER_APPENDING, (event, data) => {
                    this.bufferHandlers.forEach(handler => handler(data.data))
                    i++;
                    const end = this.player.config.maxBufferLength+1
                    if (i % end === 0){
                        console.info('flushing buffer', i, '/', end)
                        this.player.trigger(Hls.Events.BUFFER_FLUSHING, {startOffset: 0, endOffset: end-1, type: 'audiovideo'})
                    }
                })
            })

            this.player.loadSource(url);
            this.player.attachMedia(video);

            this.player.once(Hls.Events.ERROR, (event, data) => {
                console.warn('hls error: ', data)
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('fatal media error encountered, try to recover');
                            this.player.recoverMediaError();
                            break;
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('fatal network error encountered', data);
                            break;
                        default:
                            // cannot recover
                            this.player.destroy();
                            break;
                    }
                    rej(data)
                }
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
        this.player.stopLoad()
        this.player.detachMedia()
        this.player.destroy()
    }

    get internalPlayer(): Hls {
        return this.player
    }

}

export default HlsPlayer