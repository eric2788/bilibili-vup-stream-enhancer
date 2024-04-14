import type { Cleanup, FFMpegCore } from "~ffmpeg";

import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import ffmpegWorkerJs from 'url:assets/ffmpeg/worker.js';
import { randomString } from "~utils/misc";

const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm"

export class SingleThread implements FFMpegCore {

    private ffmpeg: FFmpeg = null

    async load(ffmpeg: FFmpeg): Promise<boolean> {
        this.ffmpeg = ffmpeg
        return ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "application/javascript"),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            classWorkerURL: await toBlobURL(ffmpegWorkerJs, 'text/javascript')
        })
    }

    async fix(input: string, output: string, prepareCut: boolean): Promise<Cleanup> {
        if (!this.ffmpeg) throw new Error('FFmpeg not loaded')

        await this.ffmpeg.exec([
            '-fflags', '+genpts+igndts',
            '-i', input,
            '-c', 'copy',
            ...(prepareCut ? [] : ['-r', '60']),
            output
        ])

        return async () => {
            await this.ffmpeg.deleteFile(output)
        }

    }

    async cut(input: string, output: string, duration: number): Promise<Cleanup> {
        if (!this.ffmpeg) throw new Error('FFmpeg not loaded')

        const seconds = `${duration * 60}`
        const temp = randomString()

        await this.ffmpeg.exec([
            '-fflags', '+genpts+igndts',
            '-sseof', `-${seconds}`,
            '-i', input,
            '-r', '60',
            '-avoid_negative_ts', 'make_zero',
            '-c', 'copy',
            temp + output
        ])

        await this.ffmpeg.exec([
            '-fflags', '+genpts+igndts',
            '-i', temp + output,
            '-t', seconds,
            '-c', 'copy',
            output
        ])

        return async () => {
            await this.ffmpeg.deleteFile(temp + output)
            await this.ffmpeg.deleteFile(output)
        }
    }

}

const singleThread = new SingleThread()
export default singleThread