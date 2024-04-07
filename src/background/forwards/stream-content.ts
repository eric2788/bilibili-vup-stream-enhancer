import { useDefaultHandler } from "~background/forwards"
import type { VideoInfo } from "~players"

export type ForwardBody = {
    stage: 'init'
    id: string
    duration: number
    videoInfo: VideoInfo
    filename: string
    totalChunks: number
} | {
    stage: 'data'
    id: string
    order: number
    content: string
} | {
    stage: 'end'
    id: string
} | {
    stage: 'ready'
    id: string
} | {
    stage: 'error'
    message: string
    id: string
}

export default useDefaultHandler<ForwardBody>()