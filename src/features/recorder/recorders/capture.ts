import { Recorder } from "~types/media";
import type { ChunkData } from ".";

class CaptureRecorder extends Recorder {

    start(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    loadChunkData(flush?: boolean): Promise<ChunkData> {
        throw new Error("Method not implemented.");
    }

    stop(): void {
        throw new Error("Method not implemented.");
    }

    get recording(): boolean {
        throw new Error("Method not implemented.");
    }

    set onerror(handler: (error: Error) => void) {
        throw new Error("Method not implemented.");
    }

}

export default CaptureRecorder