import type { FFMpegCore } from "~ffmpeg";

import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import ffmpegWorkerJs from 'url:assets/ffmpeg/worker.js';

export class SingleThread implements FFMpegCore {

    async load(ffmpeg: FFmpeg): Promise<boolean> {
        return ffmpeg.load({
            classWorkerURL: await toBlobURL(ffmpegWorkerJs, 'text/javascript')
        })
    }

    get args(): string[] {
        return ['-c', 'copy'] // in single thread mode, we just copy the input file to speed up the process
    }

}

const singleThread = new SingleThread()
export default singleThread