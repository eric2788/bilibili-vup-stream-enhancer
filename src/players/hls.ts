import Hls, { LevelDetails } from 'hls.js';
import { type VideoInfo } from "~players";
import { StreamPlayer } from '~types/media';

class HlsPlayer extends StreamPlayer {

    private player: Hls
    private bufferFlushChecker: NodeJS.Timeout

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
            media.muted = true // after muted, the auto clean back buffer will not work in hls.js, so we need to manually check
            media.autoplay = true
        }

        this.player = new Hls({
            lowLatencyMode: true,
            maxBufferLength: Infinity,
            liveDurationInfinity: true,
            backBufferLength: 30
        })

        return new Promise((res, rej) => {

            this.player.once(Hls.Events.MEDIA_ATTACHED, () => {
                console.log('video and hls.js are now bound together !')
            })

            this.player.once(Hls.Events.MANIFEST_PARSED, (event, data) => {
                console.log('manifest loaded, found ' + data.levels.length + ' quality level', data)
                this.emit('loaded', {})
                res()
                this.bufferFlushChecker = setInterval(() => {
                    const tr = media.buffered
                    if (tr.length < 1) return
                    this.checkBufferShouldFlush(tr)
                }, this.player.config.backBufferLength * 500)
            })

            this.player.on(Hls.Events.BUFFER_APPENDING, (event, data) => {
                this.emit('buffer', data.data.buffer)
            })

            this.player.on(Hls.Events.BUFFER_APPENDED, (event, data) => {
                const tr = data.timeRanges.audiovideo
                if (tr.length < 1) return
                console.debug('start: ', tr.start(0), ', end: ', tr.end(tr.length - 1), ', gap: ', tr.end(tr.length - 1) - tr.start(0))
            })

            this.player.loadSource(url);
            this.player.attachMedia(media);

            this.player.on(Hls.Events.BUFFER_FLUSHING, (event, data) => {
                console.debug('buffer flushing for type: ', data.type, ', start: ', data.startOffset, ', end: ', data.endOffset)
            })

            let retryCount = 0
            this.player.on(Hls.Events.ERROR, (event, data) => {
                console.warn('hls error: ', data.error, data.errorAction, data.reason)

                if (data.details === Hls.ErrorDetails.BUFFER_FULL_ERROR) {
                    console.warn('buffer full error encountered, trying to flush all buffer')
                    this.player.trigger(Hls.Events.BUFFER_FLUSHING, {
                        startOffset: 0,
                        endOffset: media.buffered.end(media.buffered.length - 1) - 60,
                        type: 'audiovideo'
                    })
                }

                if (data.fatal) {
                    // only fatal error will trigger retry, otherwise ignore
                    console.warn('retry count: ', ++retryCount)
                    if (retryCount >= 3) {
                        console.error('retry count exceeded, stop and destroy player')
                        this.emit('error', data.error)
                        this.stopAndDestroy()
                        return
                    }
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
        clearInterval(this.bufferFlushChecker)
        this.clearHandlers()
        this.player.stopLoad()
        this.player.detachMedia()
        this.player.destroy()
        this.player = null
    }

    // for recording only
    private checkBufferShouldFlush(tr: TimeRanges) {
        if (tr.length < 1) return
        const start = tr.start(0)
        const gap = tr.end(tr.length - 1) - start
        const maxBuffer = this.player.config.backBufferLength * 1.3
        // if the hlsjs back buffer flushing is working, this gap will never larger than maxBuffer
        // so only will trigger on recording
        if (gap <= maxBuffer) return
        console.debug('buffer gap is larger than max buffer, flushing buffer...')
        this.player.trigger(Hls.Events.BUFFER_FLUSHING, {
            startOffset: 0,
            endOffset: start + (gap - maxBuffer),
            type: 'audiovideo'
        })
    }

}

export default HlsPlayer