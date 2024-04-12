import type { Cleanup, FFMpegCore } from "~ffmpeg";

import classWorkerURL from 'url:assets/ffmpeg/mt-worker.js'

import workerURL from 'url:@ffmpeg/core-mt/dist/umd/ffmpeg-core.worker.js'
import wasmURL from 'raw:@ffmpeg/core-mt/dist/umd/ffmpeg-core.wasm'
import coreURL from 'url:assets/ffmpeg/mt-core.js'

import { toBlobURL } from '@ffmpeg/util';
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { getSettingStorage } from "~utils/storage";
import { randomString } from "~utils/misc";

export class MultiThread implements FFMpegCore {

    private ffmpeg: FFmpeg = null
    private divider = 0.5 // default divider

    async load(ffmpeg: FFmpeg): Promise<boolean> {
        this.ffmpeg = ffmpeg
        try {
            await this.loadDivide()
        } catch (err: Error | any) {
            console.warn('无法从设定获取线程占用，使用默认值: 50%', err)
        }

        return ffmpeg.load({
            coreURL,
            wasmURL,
            workerURL,
            classWorkerURL: await toBlobURL(classWorkerURL, 'application/javascript'),
        })
    }

    async fix(input: string, output: string, prepareCut: boolean): Promise<Cleanup> {
        if (!this.ffmpeg) throw new Error('FFmpeg not loaded')

        await this.ffmpeg.exec([
            '-fflags', '+genpts+igndts',
            '-i', input,
            '-c', 'copy',
            ...(prepareCut ? [] : this.args),
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
            ...this.args,
            '-avoid_negative_ts', 'make_zero',
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


    private get args(): string[] {
        return [
            '-b:v', '0',
            '-threads', `${Math.round(window.navigator.hardwareConcurrency * this.divider)}`,
            '-vcodec', 'h264',
            '-r', '60'
        ]
    }


    // 从设定加载线程数量
    async loadDivide(): Promise<void> {
        const feature = await getSettingStorage('settings.features')
        this.divider = feature.recorder.threads
    }

}

const multiThread = new MultiThread()
export default multiThread