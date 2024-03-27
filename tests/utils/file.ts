import { glob, type GlobOptions as IOptions } from 'glob'
import type { Readable } from 'stream'
import fs from 'fs/promises'
import type { PathLike } from 'fs'
import VideoLib from 'node-video-lib'
import gifyParse from 'gify-parse'

export type IModule = {
    name: string,
    file: string,
    module: any
}

/**
 * Retrieves an array of JavaScript/TypeScript file paths from the specified directory path.
 * @param dirPath - The directory path to search for JavaScript/TypeScript files.
 * @param options - Optional configuration options for the glob pattern matching.
 * @returns An array of JavaScript/TypeScript file paths.
 */
export function getJSFiles(dirPath: string, options?: IOptions): string[] {
    return glob.sync(`${dirPath}/**/*.{ts,tsx,js,jsx}`, options) as string[]
}

/**
 * Retrieves a stream of modules from a directory path.
 * @param dirPath - The directory path to search for modules.
 * @param options - Optional configuration options.
 * @returns A generator that yields promises of modules.
 */
export function* getModuleStream(dirPath: string, options: IOptions = { ignore: '**/index.ts' }): Generator<Promise<IModule>, void, any> {
    for (const file of getJSFiles(dirPath, options)) {
        const name = file.split(/[\\\/]/).pop().split('.')[0]
        yield import(file).then(module => ({ name, file, module }))
    }
}

/**
 * Retrieves a generator that yields module information synchronously.
 * @param dirPath - The directory path to search for TypeScript files.
 * @param options - The options for filtering files. Default value is { ignore: '**/
export function* getModuleStreamSync(dirPath: string, options: IOptions = { ignore: '**/index.ts' }): Generator<IModule, void, any> {
    for (const file of getJSFiles(dirPath, options)) {
        const name = file.split(/[\\\/]/).pop().split('.')[0]
        yield { name, file, module: require(file) }
    }
}

/**
 * Reads the text from a Readable stream and returns it as a string.
 * @param readable The Readable stream to read from.
 * @returns A promise that resolves with the text from the Readable stream.
 */
export async function readText(readable: Readable): Promise<string> {
    return new Promise((res, rej) => {
        let data = ''
        readable.on('data', chunk => data += chunk)
        readable.on('end', () => res(data))
        readable.on('error', rej)
    })
}

// reference data
// Movie {
//     duration: 32167,
//     timescale: 1000,
//     tracks: [
//       VideoTrack {
//         duration: 2894970,
//         timescale: 90000,
//         extraData: <Buffer 61 76 63 43 01 64 00 28 ff e1 00 1d 67 64 00 28 ac 72 89 01 40 16 e9 a8 08 08 0a 00 00 03 00 02 00 00 0f a0 1e 30 61 44 c0 01 00 04 68 e9 3b cb fd f8 ... 6 more bytes>,
//         codec: 'avc1.640028',
//         samples: [Array],
//         width: 1280,
//         height: 720
//       },
//       AudioTrack {
//         duration: 1542734,
//         timescale: 48000,
//         extraData: <Buffer 6d 70 34 61 11 90 56 e5 00>,
//         codec: 'mp4a.40.2',
//         samples: [Array],
//         channels: 2,
//         sampleRate: 48000,
//         sampleSize: 16
//       }
//     ]
//   }
export async function readMovieInfo(source: PathLike | Buffer) {
    source = await readBufferIfNeeded(source)
    return VideoLib.MovieParser.parse(source)
}


export async function readGifInfo(source: PathLike | Buffer) {
    source = await readBufferIfNeeded(source)
    return gifyParse.getInfo(source);
}

async function readBufferIfNeeded(source: PathLike | Buffer): Promise<Buffer> {
    return Buffer.isBuffer(source) ? source : fs.readFile(source)
}