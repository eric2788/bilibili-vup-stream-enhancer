import type { FFmpeg } from "@ffmpeg/ffmpeg"
import { isBackgroundScript } from "~utils/file"
import coreSt from './core'
import coreMt from './core-mt'

export interface FFMpegCore {

    load(ffmpeg: FFmpeg): Promise<boolean>

    get args(): string[]

}

function getFFMpegCore(): FFMpegCore {
    return isBackgroundScript() ? coreMt : coreSt
}

export default getFFMpegCore