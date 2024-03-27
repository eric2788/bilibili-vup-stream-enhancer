import { glob, type GlobOptions as IOptions } from 'glob'
import type { Readable } from 'stream'
import fs from 'fs/promises'
import type { PathLike } from 'fs'

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


/**
 * Reads the MP4 file information.
 * @param path - The path to the MP4 file.
 * @returns An object containing the time scale, duration, movie length, and start position.
 */
export async function readMp4Info(path: PathLike) {
    const buf = Buffer.alloc(100);
    const file = await fs.open(path);
    const { buffer } = await file.read({
      buffer: buf,
      length: 100,
      offset: 0,
      position: 0,
    });
    await file.close();
    const start = buffer.indexOf(Buffer.from("mvhd")) + 16;
    const timeScale = buffer.readUInt32BE(start);
    const duration = buffer.readUInt32BE(start + 4);
    const movieLength = Math.floor(duration / timeScale);
    return { timeScale, duration, movieLength, start }
}