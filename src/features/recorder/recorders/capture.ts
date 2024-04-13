import db from "~database";
import type { VideoInfo } from "~players";
import { Recorder } from "~types/media";
import { injectFunction } from "~utils/inject";
import { sleep } from "~utils/misc";
import type { ChunkData } from ".";

export type CaptureOptions = {
    autoSwitchQuality?: boolean
}

class CaptureRecorder extends Recorder<CaptureOptions> {

    private static readonly Info: VideoInfo = {
        mimeType: 'video/mp4',
        extension: 'mp4',
    }

    private recorder: MediaRecorder
    private videoTrackChecker: NodeJS.Timeout

    async start(): Promise<void> {
        let video = await this.loadVideoElement()
        if (this.options.autoSwitchQuality === true) {
            video = await this.switchQuality(video)
        }
        if (video.muted) {
            if (window.confirm('此录制方式需要使直播处于非静音状态，是否解除静音？')) {
                video.muted = false
            } else {
                throw new Error('直播处于静音状态，无法录制。')
            }
        }
        return this.startRecording(video)
    }

    async loadChunkData(flush?: boolean): Promise<ChunkData> {
        const chunks = await this.loadChunks(flush)
        return { chunks, info: CaptureRecorder.Info }
    }

    stop(): void {
        clearInterval(this.videoTrackChecker)
        clearInterval(this.bufferAppendChecker)
        this.recorder?.stop()
        this.recorder = null
        this._ticking = false
    }

    get recording(): boolean {
        return this.recorder?.state === 'recording'
    }

    async loadVideoElement(): Promise<HTMLVideoElement> {
        const videos = [...document.querySelectorAll('video').values()].filter(v => v.captureStream)
        if (videos.length === 0) {
            console.warn('no video element found, waiting 2 seconds for video element...')
            await sleep(2000)
            return this.loadVideoElement()
        }
        console.debug('videos availables: ', videos)
        const video = videos[0]
        if (video.readyState === 4) {
            return video
        }
        console.debug('video is not ready, waiting for load event...')
        return new Promise((res, rej) => {
            video.onloadeddata = () => res(video)
            video.onplaying = () => res(video)
            video.onerror = (e) => rej(e)
        })
    }

    private startVideoTracker(video: HTMLVideoElement): void {
        const id = video.id
        this.videoTrackChecker = setInterval(async () => {
            if (!this.recording) {
                clearInterval(this.videoTrackChecker)
                return
            }
            if (document.getElementById(id)) return
            console.warn('视频源已被更改, 请刷新页面重新进行录制。')
            const rows = (await db.streams.where({ room: this.room }).count()) + this.fallbackChunks.length
            if (rows > 0) {
                console.debug('found ', rows, ' buffer in database, avoid to stop recorder.')
                this.errorHandler?.(new Error('视频源已被更改, 请刷新页面重新进行录制。'))
                this._ticking = false
                clearInterval(this.videoTrackChecker)
            } else {
                console.debug('no buffer found, restarting the recorder!')
                this.stop()
                await this.start()
                clearInterval(this.bufferAppendChecker)
                clearInterval(this.videoTrackChecker)
            }
        }, 1000)
    }

    private async switchQuality(current: HTMLVideoElement): Promise<HTMLVideoElement> {
        let info = undefined
        while (!info) {
            await sleep(1000)
            info = await injectFunction('invokeLivePlayer', 'getPlayerInfo')
        }
        console.debug('video info: ', info)
        if (info.quality === '10000') {
            console.debug('video quality is already 10000')
            return current
        }
        await injectFunction('invokeLivePlayer', 'switchQuality', '10000')
        console.info('switched live video quality to 10000')
        console.debug('wait for video quality ready...')
        let latest = await this.loadVideoElement()
        while (latest.id === current.id) {
            await sleep(1000)
            latest = await this.loadVideoElement()
        }
        return latest
    }

    private async startRecording(video: HTMLVideoElement): Promise<void> {
        video.crossOrigin = 'annoymous'
        const stream = video.captureStream()
        this.recorder = new MediaRecorder(stream, {
            audioBitsPerSecond: 320000,
            videoBitsPerSecond: 8000000,
            mimeType: 'video/webm; codecs="h264, opus"'
        })
        let order = 0
        this.recorder.ondataavailable = (e) => {
            this.saveChunk(e.data, ++order)
        }
        this.recorder.onstart = () => {
            console.debug('media recorder started')
        }
        this.recorder.onerror = (e) => {
            console.error('media recorder error: ', e)
            this.errorHandler?.(new Error('MediaRecorder error: ' + e.type))
        }
        this.recorder.onstop = () => {
            console.debug('media recorder stopped')
        }
        this.recorder.start(1000)
        this.appendBufferChecker()
        this.startVideoTracker(video)
    }
}

export default CaptureRecorder