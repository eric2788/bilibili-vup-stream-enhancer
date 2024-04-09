import Hls from 'hls.js';
import { type VideoInfo } from "~players";
import { StreamPlayer } from '~types/media';

class HlsPlayer extends StreamPlayer {

    private player: Hls

    get isSupported(): boolean {
        return Hls.isSupported()
    }

    get internalPlayer(): Hls {
        return this.player
    }

    get videoInfo(): VideoInfo {
        return {
            mimeType: 'video/mp4',
            extension: 'mp4'
        }
    }

    play(url: string, media?: HTMLMediaElement): Promise<void> {

        if (!media) {
            // create a hidden video element
            media = document.createElement('video')
            media.style.display = 'none'
            media.volume = 0
            media.muted = true
            media.autoplay = true
        }

        this.player = new Hls({
            lowLatencyMode: true,
            maxBufferLength: Infinity,
            liveDurationInfinity: true,
            backBufferLength: 10,
        })

        return new Promise((res, rej) => {
            this.player.once(Hls.Events.MEDIA_ATTACHED, () => {
                console.log('video and hls.js are now bound together !')
            })

            this.player.once(Hls.Events.MANIFEST_PARSED, (event, data) => {
                console.log('manifest loaded, found ' + data.levels.length + ' quality level', data)
                this.emit('loaded', {})
                res()
            })

            this.player.on(Hls.Events.BUFFER_APPENDING, (event, data) => {
                this.emit('buffer', data.data.buffer)
            })

            this.player.on(Hls.Events.BACK_BUFFER_REACHED, (event, data) => {
                console.log('back buffer reached, buffer length: ', data.bufferEnd)
            })

            this.player.on(Hls.Events.BUFFER_FLUSHING, (event, data) => {
                console.log('buffer flushing from ', data.startOffset, ' to ', data.endOffset, ', type: ', data.type)  
            })

            this.player.on(Hls.Events.BUFFER_FLUSHED, (event, data) => {
                console.log('buffer flushed for type: ', data.type)
            })

            this.player.loadSource(url);
            this.player.attachMedia(media);

            let retryCount = 0
            this.player.on(Hls.Events.ERROR, (event, data) => {
                console.warn('hls error: ', data.error, data.errorAction, data.reason)
                console.warn('retry count: ', retryCount++)
                if (retryCount >= 3) {
                    console.error('retry count exceeded, stop and destroy player')
                    this.stopAndDestroy()
                    this.emit('error', data.error)
                    return
                }
                
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('fatal media error encountered, try to recover');
                            this.player.recoverMediaError()
                            break;
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('fatal network error encountered', data);
                            this.player.startLoad()
                            break;
                        default:
                            // cannot recover
                            console.error('fatal error encountered, cannot recover');
                            this.player.destroy();
                            this.emit('error', data.error)
                            break;
                    }
                    rej(data.error)
                }
            })
        })
    }

    stopAndDestroy() {
        this.clearHandlers()
        this.player.stopLoad()
        this.player.detachMedia()
        this.player.destroy()
        this.player = null
    }

}

export default HlsPlayer