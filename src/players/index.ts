import type { StreamInfo } from "~api/bilibili"
import hls from './hls'
import flv from './flv'

export type EventType = keyof StreamParseEvent

export type StreamParseEvent = {
    'loaded': {},
    'error': Error
}

export abstract class StreamPlayer {

    protected info: StreamInfo

    constructor(info: StreamInfo) {
        this.info = info
    }

    abstract get isSupported(): boolean

    abstract loadAndPlay(url: string, video: HTMLMediaElement): Promise<void>

    abstract get internalPlayer(): any

}

export type PlayerType = keyof typeof players

const players = {
    hls,
    flv
}

export default players