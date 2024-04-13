import { recordStream, type PlayerOptions, type VideoInfo } from "~players";
import type { StreamPlayer } from "~types/media";
import { Recorder } from "~types/media";
import { type ChunkData } from ".";
import type { StreamUrls } from "~background/messages/get-stream-urls";

class BufferRecorder extends Recorder<PlayerOptions> {

    private player: StreamPlayer = null
    private info: VideoInfo = null

    async start(): Promise<void> {
        let i = 0
        this.player = await recordStream(this.urls, (buffer) => this.onBufferArrived(++i, buffer), this.options)
        this.appendBufferChecker()
        this.info = this.player.videoInfo
    }

    private async onBufferArrived(order: number, buffer: ArrayBuffer): Promise<void> {
        const blob = new Blob([buffer], { type: 'application/octet-stream' })
        return this.saveChunk(blob, order)
    }

    async loadChunkData(flush: boolean = true): Promise<ChunkData> {
        const chunks = await this.loadChunks(flush)
        return {
            chunks,
            info: this.info
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