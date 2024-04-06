import type { StreamUrls } from '~background/messages/get-stream-urls'
import flv from './flv'
import hls from './hls'
import type { StreamPlayer } from '~types/media'

export type EventType = keyof StreamParseEvent

export type StreamParseEvent = {
    'loaded': {},
    'error': Error,
    'buffer': ArrayBuffer
}

export type EventHandler<E extends EventType> = (event: StreamParseEvent[E]) => void

export type VideoInfo = {
    mimeType: string
    extension: string
}

export type PlayerType = keyof typeof players

const players = {
    hls,
    flv
}


export type PlayerOptions = {
    type?: PlayerType
    codec?: 'avc' | 'hevc'
}

async function loadStream(urls: StreamUrls, video: HTMLVideoElement, options: PlayerOptions = { codec: 'avc' }): Promise<StreamPlayer> {
    for (const url of urls) {
        if (options.type && url.type !== options.type) continue
        if (options.codec && url.codec !== options.codec) continue
        const Player = players[url.type]
        const player = new Player()
        console.info(`trying to use type ${url.type} player to load: `, url.url, ' quality: ', url.quality, ' codec: ', url.codec)
        if (!player.isSupported) {
            console.warn(`Player ${url.type} is not supported, skipped: `, url)
            continue
        }
        try {
            await player.play(url.url, video)
            return player
        } catch (err: Error | any) {
            console.error(`Player failed to load: `, err, ', from: ', url)
            continue
        }
    }
    throw new Error('No player is supported')
}

export async function recordStream(urls: StreamUrls, handler: EventHandler<'buffer'>, options: PlayerOptions = { codec: 'avc' }): Promise<StreamPlayer> {
    for (const url of urls) {
        if (options.type && url.type !== options.type) continue
        if (options.codec && url.codec !== options.codec) continue
        const Player = players[url.type]
        const player = new Player()
        console.info(`trying to use type ${url.type} player to record: `, url.url, ' quality: ', url.quality, ' codec: ', url.codec)
        if (!player.isSupported) {
            console.warn(`Player ${url.type} is not supported, skipped: `, url)
            continue
        }
        try {
            await player.play(url.url)
            player.on('buffer', handler)
            return player
        } catch (err: Error | any) {
            console.error(`Player failed to load: `, err, ', from: ', url)
            continue
        }
    }
    throw new Error('No recorder is supported')
}

export default loadStream