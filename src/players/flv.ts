import flvJs from 'mpegts.js';
import { StreamPlayer } from "~players";

class FlvPlayer extends StreamPlayer {

    private player: flvJs.Player

    get isSupported(): boolean {
        return flvJs.isSupported()
    }

    loadAndPlay(url: string, container: HTMLMediaElement): Promise<void> {
        this.player = flvJs.createPlayer({
            type: 'flv',
            isLive: true,
            url,
            cors: true,
            withCredentials: true
        }, {
            autoCleanupSourceBuffer: true,
            headers: {
                'Origin': 'https://live.bilibili.com',
                'Referer': `https://live.bilibili.com/${this.info.room}`
            }
        })
        this.player.attachMediaElement(container)
        this.player.load()
        this.player.play()
        return new Promise((res, rej) => {
            this.player.on('media_info', res)
            this.player.on('error', (e) => {
                this.player.detachMediaElement()
                rej(e)
                delete this.player
            })
        })
    }

    get internalPlayer(): any {
        return this.player
    }
}


export default FlvPlayer