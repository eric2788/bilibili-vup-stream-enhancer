import type { StreamPlayer } from "~players";
import Hls from 'hls.js'


class HlsPlayer implements StreamPlayer {

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

    stopAndDestroy(): Promise<void> {
        return new Promise((res,) => {
            this.player.detachMedia()
            this.player.on(Hls.Events.MEDIA_DETACHED, () => {
                this.player.destroy()
                res()
            })
        })
    }

    get internalPlayer(): Hls {
        return this.player
    }

}

export default HlsPlayer