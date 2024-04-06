/// <reference path="../types/movie.ts" />
import { glob, type GlobOptions as IOptions } from 'glob'
import type { Readable } from 'stream'
import fs from 'fs/promises'
import type { PathLike } from 'fs'
import VideoLib from 'node-video-lib'
import gifyParse from 'gify-parse'
import type { Movie } from '@tests/types/movie'

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



export async function readMovieInfo(source: PathLike | Buffer): Promise<Movie> {
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