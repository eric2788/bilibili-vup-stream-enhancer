import db from "~database";
import type { Streams } from "~database/tables/stream";
import { recordStream } from "~players";
import type { StreamPlayer } from "~types/media";
import { Recorder } from "~types/media";
import { type ChunkData } from ".";

class BufferRecorder extends Recorder {

    private player: StreamPlayer = null
    private readonly fallbackChunks: Streams[] = []
    private errorHandler: (error: Error) => void = null
    private bufferAppendChecker: NodeJS.Timeout = null

    async start(): Promise<void> {
        let i = 0
        this.player = await recordStream(this.urls, (buffer) => this.onBufferArrived(++i, buffer), this.options)
        let lastRecordedSize = 0
        this.bufferAppendChecker = setInterval(() => {
            if (!this.recording) {
                clearInterval(this.bufferAppendChecker)
                return
            }
            if (lastRecordedSize !== this.recordedSize) return
            console.warn('buffer data has not been appended for 15 seconds! current recorded size: ', this.fileSize)
            this.errorHandler?.(new Error('已超过15秒没再接收到数据流!你可能需要刷新页面'))
            lastRecordedSize = this.recordedSize
        }, 15000)
    }

    private async onBufferArrived(order: number, buffer: ArrayBuffer): Promise<void> {
        const blob = new Blob([buffer], { type: 'application/octet-stream' })
        const stream = {
            date: new Date().toISOString(),
            content: blob,
            order,
            room: this.room
        }
        try {
            await db.streams.add(stream)
            console.debug('recorded segment: ', buffer.byteLength, 'bytes, order: ', stream.order)
        } catch (err: Error | any) {
            console.error('Error writing buffer to file', err)
            console.warn('writing into fallback chunks')
            this.fallbackChunks.push(stream)
        } finally {
            this.recordedSize += buffer.byteLength
        }
    }

    async loadChunkData(flush: boolean = true): Promise<ChunkData> {

        const streams = await db.streams.where({ room: this.room }).sortBy('order')
        if (flush) {
            while (this.recordedSize >= (Recorder.FFmpegLimit - 1024) && streams.length > 0) { // 2GB - 1KB
                console.info(`recorded size exceeds 2GB (${this.fileSize}), deleting oldest record`)
                const { id, content } = streams.shift()
                await db.streams.delete(id)
                this.recordedSize -= content.size
            }
        }
        const chunks = [...streams, ...this.fallbackChunks].toSorted((a, b) => a.order - b.order).map(c => c.content)
        return {
            chunks,
            info: this.player.videoInfo
        }
    }

    async flush(): Promise<void> {
        this.recordedSize = 0
        const re = await db.streams.where({ room: this.room }).delete()
        this.fallbackChunks.length = 0
        console.debug('flushed ', re, ' records from databases')
    }

    stop(): void {
        clearInterval(this.bufferAppendChecker)
        this.player?.stopAndDestroy()
        this.player = null
    }

    get recording(): boolean {
        return !!this.player
    }

    set onerror(handler: (error: Error) => void) {
        if (!this.player) return
        if (this.errorHandler) this.player.off('error', this.errorHandler)
        this.player.on('error', handler)
        this.errorHandler = handler
    }

}

export default BufferRecorder