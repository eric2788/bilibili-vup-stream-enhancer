import type { FFMpegCore } from "~ffmpeg";

import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import ffmpegWorkerJs from 'url:assets/ffmpeg/worker.js';

const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm"

export class SingleThread implements FFMpegCore {

    async load(ffmpeg: FFmpeg): Promise<boolean> {
        return ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "application/javascript"),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            classWorkerURL: await toBlobURL(ffmpegWorkerJs, 'text/javascript')
        })
    }

    get args(): string[] {
        return ['-c', 'copy'] // in single thread mode, we just copy the input file to speed up the process
    }

}

const singleThread = new SingleThread()
export default singleThread