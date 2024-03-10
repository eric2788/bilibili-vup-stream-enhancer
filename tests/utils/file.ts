import { glob, type GlobOptions as IOptions } from 'glob'
import type { Readable } from 'stream'

export type IModule = {
    name: string,
    file: string,
    module: any
}

/**
 * Retrieves an array of TypeScript file paths from the specified directory path.
 * @param dirPath - The directory path to search for TypeScript files.
 * @param options - Optional configuration options for the glob pattern matching.
 * @returns An array of TypeScript file paths.
 */
export function getTSFiles(dirPath: string, options?: IOptions): string[] {
    return glob.sync(`${dirPath}/**/*.{ts,tsx}`, options) as string[]
}

/**
 * Retrieves a stream of modules from a directory path.
 * @param dirPath - The directory path to search for modules.
 * @param options - Optional configuration options.
 * @returns A generator that yields promises of modules.
 */
export function* getModuleStream(dirPath: string, options: IOptions = { ignore: '**/index.ts' }): Generator<Promise<IModule>, void, any> {
    for (const file of getTSFiles(dirPath, options)) {
        const name = file.split('/').pop().split('.')[0]
        yield import(file).then(module => ({ name, file, module }))
    }
}

/**
 * Retrieves a generator that yields module information synchronously.
 * @param dirPath - The directory path to search for TypeScript files.
 * @param options - The options for filtering files. Default value is { ignore: '**/
export function* getModuleStreamSync(dirPath: string, options: IOptions = { ignore: '**/index.ts' }): Generator<IModule, void, any> {
    for (const file of getTSFiles(dirPath, options)) {
        const name = file.split('/').pop().split('.')[0]
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