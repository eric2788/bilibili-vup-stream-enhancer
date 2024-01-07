import flvJs from 'mpegts.js';
import type { StreamPlayer } from "~players";

class FlvPlayer implements StreamPlayer {

    private player: flvJs.Player
    private room: string

    constructor(room: string) {
        this.room = room
    }

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
            autoCleanupSourceBuffer: false,
            headers: {
                'Origin': 'https://live.bilibili.com',
                'Referer': `https://live.bilibili.com/${this.room}`
            }
        })
        this.player.attachMediaElement(container)
        this.player.load()
        this.player.play()
        return new Promise((res, rej) => {
            this.player.on('media_info', res)
            this.player.on('error', (e) => {
                console.warn('flv error: ', e)
                this.player.detachMediaElement()
                rej(e)
            })
        })
    }

    async stopAndDestroy(): Promise<void> {
        this.player.detachMediaElement()
        this.player.destroy()
    }

    get internalPlayer(): any {
        return this.player
    }
}


export default FlvPlayer