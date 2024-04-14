import type { StreamUrl, StreamUrls } from '~background/messages/get-stream-urls'
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

async function loopStreams(urls: StreamUrls, handler: (p: StreamPlayer, url: StreamUrl) => Promise<void>, options: PlayerOptions = { codec: 'avc' }) {
    const availables = urls
        .filter(url => options.type ? url.type === options.type : true)
        .filter(url => options.codec ? url.codec === options.codec : true)
    if (availables.length === 0) throw new Error('没有可用的视频流URL')
    for (const url of availables) {
        const Player = players[url.type]
        const player = new Player()
        console.info(`trying to use type ${url.type} player to load: `, url.url, ' quality: ', url.quality, ' codec: ', url.codec)
        if (!player.isSupported) {
            console.warn(`Player ${url.type} is not supported, skipped: `, url)
            continue
        }
        try {
            await handler(player, url)
            return player
        } catch (err: Error | any) {
            console.error(`Player failed to load: `, err, ', from: ', url)
            continue
        }
    }
    throw new Error('没有可用的播放器支援 ' + JSON.stringify(options))
}

export async function loadStream(urls: StreamUrls, video: HTMLVideoElement, options: PlayerOptions = { codec: 'avc' }): Promise<StreamPlayer> {
    return loopStreams(
        urls,
        (p, url) => p.play(url.url, video),
        options
    )
}

export async function recordStream(urls: StreamUrls, handler: EventHandler<'buffer'>, options: PlayerOptions = { codec: 'avc' }): Promise<StreamPlayer> {
    return loopStreams(
        urls,
        async (p, url) => {
            p.on('buffer', handler)
            await p.play(url.url)
        },
        options
    )
}

export default loadStream