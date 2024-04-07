import type { FFMpegCore } from "~ffmpeg";

import classWorkerURL from 'url:assets/ffmpeg/mt-worker.js'

import workerURL from 'url:@ffmpeg/core-mt/dist/umd/ffmpeg-core.worker.js'
import wasmURL from 'raw:@ffmpeg/core-mt/dist/umd/ffmpeg-core.wasm'
import coreURL from 'url:assets/ffmpeg/mt-core.js'

import { toBlobURL } from '@ffmpeg/util';
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { getSettingStorage } from "~utils/storage";

export class MultiThread implements FFMpegCore {

    private divider = 0.5 // default divider

    async load(ffmpeg: FFmpeg): Promise<boolean> {

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

    get args(): string[] {
        return [
            '-threads', `${Math.round(window.navigator.hardwareConcurrency * this.divider)}`,
            '-vcodec', 'h264',
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