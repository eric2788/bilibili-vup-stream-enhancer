import type { StreamUrls } from '~background/messages/get-stream-urls'
import flv from './flv'
import hls from './hls'

export type EventType = keyof StreamParseEvent

export type StreamParseEvent = {
    'loaded': {},
    'error': Error
}

export interface StreamPlayer {

    get isSupported(): boolean

    loadAndPlay(url: string, video: HTMLMediaElement): Promise<void>

    get internalPlayer(): any

    stopAndDestroy(): Promise<void>

}

export type PlayerType = keyof typeof players

const players = {
    hls,
    flv
}

async function loadStream(roomId: string, urls: StreamUrls, video: HTMLVideoElement): Promise<StreamPlayer> {
    for (const url of urls) {
        const Player = players[url.type]
        const player = new Player(roomId)
        console.info('trying to use: ', url)
        if (!player.isSupported) {
            console.warn(`Player ${url.type} is not supported, skipped: `, url)
            continue
        }
        try {
            await player.loadAndPlay(url.url, video)
            return player
        } catch (err: Error | any) {
            console.error(`Player failed to load: `, err, ', from: ', url)
            throw new Error(`Player failed to load: ${err.message}`)
        }
    }
    throw new Error('No player is supported')
}

export default loadStream