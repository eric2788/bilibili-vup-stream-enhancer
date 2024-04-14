import type { StreamUrls } from "~background/messages/get-stream-urls"
import type { PlayerOptions, VideoInfo } from "~players"
import { Recorder } from "~types/media"
import buffer from "./buffer"
import capture, { type CaptureOptions } from "./capture"

export type ChunkData = {
    chunks: Blob[]
    info: VideoInfo
}

export type RecorderType = keyof typeof recorders

export type RecorderPayload = {
    buffer: PlayerOptions
    capture: CaptureOptions
}

const recorders = {
    buffer,
    capture,
}

function createRecorder<T extends RecorderType>(room: string, urls: StreamUrls, type: T, options: RecorderPayload[T]): Recorder {
    const Recorder = recorders[type]
    if (!Recorder) {
        throw new Error('unsupported recorder type: ' + type)
    }
    return new Recorder(room, urls, options)
}

export default createRecorder