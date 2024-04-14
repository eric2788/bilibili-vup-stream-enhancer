import { FFmpeg } from "@ffmpeg/ffmpeg"
import { isBackgroundScript } from "~utils/file"
import coreSt from './core'
import coreMt from './core-mt'

export type Cleanup = () => Promise<void>

export interface FFMpegCore {

    load(ffmpeg: FFmpeg): Promise<boolean>

    cut(input: string, output: string, duration: number): Promise<Cleanup>
    fix(input: string, output: string, prepareCut: boolean): Promise<Cleanup>
}

function getFFMpegCore(): FFMpegCore {
    return isBackgroundScript() ? coreMt : coreSt
}

export default getFFMpegCore