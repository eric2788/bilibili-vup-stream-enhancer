
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

import ffmpegWorkerJs from 'url:assets/ffmpeg-web-worker.js';

const ffmpeg = new FFmpeg()

console.debug('SharedArrayBuffer: ', window.SharedArrayBuffer)

async function ensureInit() {
    if (!ffmpeg.loaded) {
        await ffmpeg.load({
            classWorkerURL: await toBlobURL(ffmpegWorkerJs, 'text/javascript')
        })
        ffmpeg.on("log", ({ type, message }) => {
            console.debug(`[${type}] ${message}`)
        })
    }
}

export async function getFFmpeg(): Promise<FFmpeg> {
    await ensureInit()
    return ffmpeg
}



export async function fixCorrupted(input: Blob, ext: string = 'mp4'): Promise<ArrayBufferLike> {
    await ensureInit()

    const inputFile = `input.${ext}`
    const outputFile = `output.${ext}`

    const original = await input.arrayBuffer()
    await ffmpeg.writeFile(inputFile, new Uint8Array(original))
    await ffmpeg.exec(['-i', inputFile, '-c', 'copy', outputFile])
    const data = await ffmpeg.readFile(outputFile)
    return (data as Uint8Array).buffer
}
