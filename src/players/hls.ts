import { StreamPlayer } from "~players";
import Hls from 'hls.js'


class HlsPlayer extends StreamPlayer {

    private player: Hls

    get isSupported(): boolean {
        return Hls.isSupported()
    }

    loadAndPlay(url: string, video: HTMLMediaElement): Promise<void> {
        this.player = new Hls({
            enableWorker: true,
            enableWebVTT: true,
            lowLatencyMode: true
        })
        return new Promise((res, rej) => {

            this.player.on(Hls.Events.MEDIA_ATTACHED, () => {
                console.log('video and hls.js are now bound together !')
                video.play()
                res()
            })

            this.player.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                console.log('manifest loaded, found ' + data.levels.length + ' quality level', data)
            })

            this.player.once(Hls.Events.ERROR, (event, data) => {
                rej(data)
            })

            this.player.loadSource(url);
            this.player.attachMedia(video);

            this.player.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('fatal media error encountered, try to recover');
                            this.player.recoverMediaError();
                            return
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('fatal network error encountered', data);
                            this.loadAndPlay(url, video)
                            break;
                        default:
                            // cannot recover
                            this.player.destroy();
                            break;
                    }
                    rej(data)
                    delete this.player
                }
            })
        })
    }

    get internalPlayer(): Hls {
        return this.player
    }

}

export default HlsPlayer