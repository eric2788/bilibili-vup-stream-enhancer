import type { StreamUrls } from "~background/messages/get-stream-urls"
import db from "~database"
import type { Stream } from "~database/tables/stream"
import type { ChunkData } from "~features/recorder/recorders"
import { formatBytes } from "~utils/binary"

export abstract class Recorder<Options = {}> {

    protected static readonly FFmpegLimit = 2 * 1024 * 1024 * 1024 // 2GB

    protected _ticking: boolean | null = null
    protected recordedSize = 0
    protected fallbackChunks: Stream[] = []
    protected errorHandler: (error: Error) => void = null
    protected bufferAppendChecker: NodeJS.Timeout = null

    constructor(
        protected readonly room: string,
        protected readonly urls: StreamUrls,
        protected readonly options: Options
    ) { }

    abstract start(): Promise<void>

    abstract loadChunkData(flush?: boolean): Promise<ChunkData>

    abstract stop(): void

    abstract get recording(): boolean

    get ticking(): boolean {
        return this._ticking ?? this.recording
    }

    set onerror(handler: (error: Error) => void) {
        this.errorHandler = handler
    }

    get fileSize(): string {
        return formatBytes(this.recordedSize)
    }

    get fileSizeMB(): number {
        return this.recordedSize / (1024 * 1024)
    }

    async flush(): Promise<void> {
        this.recordedSize = 0
        const re = await db.streams.where({ room: this.room }).delete()
        this.fallbackChunks.length = 0
        console.debug('flushed ', re, ' records from databases')
    }

    protected appendBufferChecker(): void {
        let lastRecordedSize = 0
        this._ticking = null
        this.bufferAppendChecker = setInterval(() => {
            if (!this.recording) {
                clearInterval(this.bufferAppendChecker)
                return
            }
            try {
                if (lastRecordedSize !== this.recordedSize) return
                console.warn('buffer data has not been appended for 15 seconds! current recorded size: ', this.fileSize)
                this.errorHandler?.(new Error('已超过15秒没再接收到数据流!你可能需要刷新页面'))
                this._ticking = false
            } finally {
                lastRecordedSize = this.recordedSize
            }

        }, 15000)
    }

    protected async saveChunk(blob: Blob, order: number): Promise<void> {
        const stream = {
            date: new Date().toISOString(),
            content: blob,
            order,
            room: this.room
        }
        try {
            await db.streams.add(stream)
            console.debug('recorded segment: ', blob.size, 'bytes, order: ', stream.order)
        } catch (err: Error | any) {
            console.error('Error writing buffer to file', err)
            console.warn('writing into fallback chunks')
            this.fallbackChunks.push(stream)
        } finally {
            this.recordedSize += blob.size
        }
    }

    protected async loadChunks(flush: boolean = true): Promise<Blob[]> {
        const streams = await db.streams.where({ room: this.room }).sortBy('order')
        if (flush) {
            while (this.recordedSize >= (Recorder.FFmpegLimit - 1024) && streams.length > 0) { // 2GB - 1KB
                console.info(`recorded size exceeds 2GB (${this.fileSize}), deleting oldest record`)
                const { id, content } = streams.shift()
                await db.streams.delete(id)
                this.recordedSize -= content.size
            }
        }
        return [...streams, ...this.fallbackChunks].toSorted((a, b) => a.order - b.order).map(c => c.content)
    }

}