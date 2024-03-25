import type { StreamUrls } from '~background/messages/get-stream-urls'
import flv from './flv'
import hls from './hls'

export type EventType = keyof StreamParseEvent

export type StreamParseEvent = {
    'loaded': {},
    'error': Error
}

export type BufferHandler = (buffer: ArrayBuffer) => void

export interface StreamPlayer {

    get isSupported(): boolean

    loadAndPlay(url: string, video: HTMLMediaElement): Promise<void>

    addBufferHandler(handler: BufferHandler): VoidFunction

    get internalPlayer(): any

    stopAndDestroy(): Promise<void>

}

export type PlayerType = keyof typeof players

const players = {
    hls,
    flv
}

async function loadStream(urls: StreamUrls, video: HTMLVideoElement, type?: PlayerType): Promise<StreamPlayer> {
    for (const url of urls) {
        if (type && url.type !== type) continue
        const Player = players[url.type]
        const player = new Player()
        console.info(`trying to use type ${url.type} player to load: `, url.url)
        if (!player.isSupported) {
            console.warn(`Player ${url.type} is not supported, skipped: `, url)
            continue
        }
        try {
            await player.loadAndPlay(url.url, video)
            return player
        } catch (err: Error | any) {
            console.error(`Player failed to load: `, err, ', from: ', url)
            continue
        }
    }
    throw new Error('No player is supported')
}

export async function recordStream(urls: StreamUrls, handler: BufferHandler, type?: PlayerType): Promise<VoidFunction> {
    const video = document.createElement('video')
    video.style.display = 'none'
    video.volume = 0
    video.muted = true
    const player = await loadStream(urls, video, type)
    return player.addBufferHandler(handler)
}

export default loadStream