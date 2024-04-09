import { recordStream } from "~players";
import type { StreamPlayer } from "~types/media";
import { Recorder } from "~types/media";
import { type ChunkData } from ".";

class BufferRecorder extends Recorder {

    private player: StreamPlayer = null
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
        return this.saveChunk(blob, order)
    }

    async loadChunkData(flush: boolean = true): Promise<ChunkData> {
        const chunks = await this.loadChunks(flush)
        return {
            chunks,
            info: this.player.videoInfo
        }
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