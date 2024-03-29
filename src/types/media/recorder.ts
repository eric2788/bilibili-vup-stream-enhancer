import type { StreamUrls } from "~background/messages/get-stream-urls"
import type { PlayerOptions, PlayerType } from "~players"
import type { ChunkData } from "~features/recorder/recorders"
import { formatBytes } from "~utils/binary"

export abstract class Recorder {

    protected static readonly FFmpegLimit = 2 * 1024 * 1024 * 1024 // 2GB

    protected readonly room: string
    protected readonly urls: StreamUrls
    protected readonly options: PlayerOptions
    protected recordedSize = 0
    
    constructor(room: string, urls: StreamUrls, options: PlayerOptions) {
        this.room = room
        this.urls = urls
        this.options = options
    }

    abstract start(): Promise<void>

    abstract loadChunkData(flush?: boolean): Promise<ChunkData>

    abstract flush(): Promise<void>

    abstract stop(): void

    abstract get recording(): boolean

    abstract set onerror(handler: (error: Error) => void)

    get fileSize(): string {
        return formatBytes(this.recordedSize)
    }

    get fileSizeMB(): number {
        return this.recordedSize / (1024 * 1024)
    }
}