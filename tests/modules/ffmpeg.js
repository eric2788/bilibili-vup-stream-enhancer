import { FFmpeg } from "@ffmpeg/ffmpeg"
import { toBlobURL } from "@ffmpeg/util"

const ffmpeg = new FFmpeg()
const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm"

window.getFFmpeg = async function(){
    if (!ffmpeg.loaded) {
        console.info('loading ffmpeg for first time...')
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "application/javascript"),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            classWorkerURL: await toBlobURL('https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/814.ffmpeg.js', "application/javascript")
        })
        console.info('ffmpeg loaded!')
        ffmpeg.on("log", ({ type, message }) => console.log(`[${type}] ${message}`))
        ffmpeg.on("progress", ({ progress, time }) => {
            console.log(`progressing: ${progress * 100} % (transcoded time: ${time / 1000000} s)`)
        })
    }
    return ffmpeg
}