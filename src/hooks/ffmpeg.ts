import { FFmpeg } from "@ffmpeg/ffmpeg";
import type { LogEventCallback, ProgressEvent, ProgressEventCallback } from "@ffmpeg/ffmpeg/dist/esm/types";
import { useMemo, useRef } from "react";

import getFFMpegLoader, { type FFMpegCore } from "~ffmpeg";
import { isBackgroundScript } from "~utils/file";
import { useAsyncEffect } from "./life-cycle";
import getFFMpegCore from "~ffmpeg";
import { downloadWithProgress, fetchFile } from "@ffmpeg/util";
import { formatBytes } from "~utils/binary";


export type FFMpegProgress = ProgressEvent & {
    stage: 'fix' | 'cut'
}

export type FFMpegProgressCallback = (event: FFMpegProgress) => void

/**
 * Represents a class that provides hooks for interacting with FFmpeg.
 */
export class FFMpegHooks implements Disposable {

    private ffmpeg: FFmpeg
    private logEventCallback: LogEventCallback
    private progressCallback: ProgressEventCallback
    private readonly ffCore: FFMpegCore

    private stage: 'fix' | 'cut' = 'fix'

    constructor() {
        this.ffCore = getFFMpegCore()
        this.ffmpeg = new FFmpeg()
        this.logEventCallback = ({ type, message }) => console.log(`[${type}] ${message}`)
    }

    /**
     * Loads FFmpeg and initializes the necessary callbacks.
     * @throws Error if FFmpeg is already loaded.
     */
    async load() {
        if (this.ffmpeg.loaded) throw new Error('FFmpeg already loaded')
        await this.ffCore.load(this.ffmpeg)
        this.ffmpeg.on("log", this.logEventCallback)
        console.log('FFMpegHooks loaded')
    }

    /**
     * Sets the progress callback function.
     * @param callback - The callback function to be called on progress events.
     */
    onProgress(callback: FFMpegProgressCallback) {
        const listener: ProgressEventCallback = (event) => {
            callback({ ...event, stage: this.stage })
        }
        if (this.progressCallback) this.ffmpeg.off("progress", this.progressCallback)
        this.ffmpeg.on("progress", listener)
        this.progressCallback = listener
    }

    /**
     * Fixes the information of the input file using FFmpeg.
     * @param input - The input file as a Blob.
     * @param ext - The file extension of the output file (default: 'mp4').
     * @param copy - Indicates whether to copy the input file or not (default: true).
     * @returns A Promise that resolves to the fixed file as an ArrayBufferLike object.
     */
    async fixInfoAndCut(input: Blob, duration: number, ext: string = 'mp4'): Promise<ArrayBufferLike> {
        const inputFile = `input.${ext}`
        const outputFile = `output.${ext}`
        const middleFile = `output-uncut.${ext}`
        const needCut = duration > 0
        console.debug('reading file size: ', formatBytes(input.size))
        const original = await input.arrayBuffer()
        const cutArgs = [
            ...this.ffCore.args,
            '-b:v', '0',
            '-r', '60',
            '-avoid_negative_ts', 'make_zero'
        ]
        const fixArgs = needCut ? ['-c', 'copy'] : cutArgs // 如需剪輯，則在第一次執行一律使用快速編譯
        await this.ffmpeg.writeFile(inputFile, new Uint8Array(original))
        this.stage = 'fix'
        console.debug('fixArg: ', fixArgs)
        await this.ffmpeg.exec([
            '-fflags', '+genpts+igndts', 
            '-i', inputFile, 
            ...fixArgs, 
            middleFile
        ])
        if (needCut) {
            this.stage = 'cut'
            console.debug('cutArg: ', cutArgs)
            await this.ffmpeg.exec([
                '-fflags', '+genpts+igndts', 
                '-sseof', `-${duration * 60}`, 
                '-i', middleFile, 
                ...cutArgs, 
                outputFile
            ])
        }
        const data = await this.ffmpeg.readFile(needCut ? outputFile : middleFile)
        return (data as Uint8Array).buffer
    }

    /**
     * Terminates FFmpeg and cleans up the callbacks.
     * @throws Error if FFmpeg is not loaded.
     */
    terminate() {
        if (!this.ffmpeg.loaded) throw new Error('FFmpeg not loaded')
        if (this.progressCallback) this.ffmpeg.off("progress", this.progressCallback)
        this.ffmpeg.off("log", this.logEventCallback)
        this.ffmpeg.terminate()
    }

    [Symbol.dispose](): void {
        if (!this.ffmpeg.loaded) return
        this.terminate()
        console.log('FFMpegHooks disposed')
    }

    get core() {
        return this.ffmpeg
    }
}


/**
 * Custom hook for using FFMpeg.
 * 
 * @param errCallback - Optional callback function to handle errors. Defaults to console.error.
 * @returns An object containing a promise that resolves to FFMpegHooks instance.
 * 
 * @example
 * ```typescript
 * const { ffmpeg } = useFFMpeg((err) => {
 *   // Handle error
 * });
 * 
 * useEffect(() => {
 *   ffmpeg.then((ff) => {
 *     // Use FFMpegHooks instance
 *   });
 * }, [ffmpeg]);
 * ```
 */
export function useFFMpeg(errCallback: (err: Error) => void = console.error): { ffmpeg: Promise<FFMpegHooks> } {

    const ffmpegHooks = useRef<FFMpegHooks>()

    const ffmpeg = useMemo(() => (async () => {
        if (!ffmpegHooks.current) {
            ffmpegHooks.current = new FFMpegHooks()
            await ffmpegHooks.current.load()
        }
        return ffmpegHooks.current
    })(), [])

    useAsyncEffect(
        async () => ffmpeg,
        async (ff) => ff.terminate(),
        errCallback,
        [ffmpeg]
    )

    return { ffmpeg }
}